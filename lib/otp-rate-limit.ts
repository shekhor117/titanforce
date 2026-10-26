import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

const redis = url && token ? new Redis({ url, token }) : null
const sendLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "10 m"), prefix: "titanforce:otp:send" }) : null
const verifyLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 m"), prefix: "titanforce:otp:verify" }) : null
const uploadLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "10 m"), prefix: "titanforce:upload" }) : null

export type OtpRateLimitResult = {
  allowed: boolean
  configured: boolean
  unavailable: boolean
}

async function check(limiter: Ratelimit | null, identifier: string): Promise<OtpRateLimitResult> {
  if (!limiter) return { allowed: process.env.NODE_ENV !== 'production', configured: false, unavailable: process.env.NODE_ENV === 'production' }

  try {
    const result = await limiter.limit(identifier)
    return { allowed: result.success, configured: true, unavailable: false }
  } catch (error) {
    console.error("[v0] OTP rate limiter unavailable:", error instanceof Error ? error.message : "unknown error")
    return { allowed: false, configured: true, unavailable: true }
  }
}

export async function checkOtpSendRateLimit(email: string, ip: string): Promise<OtpRateLimitResult> {
  const emailResult = await check(sendLimiter, `email:${email}`)
  if (!emailResult.allowed || emailResult.unavailable) return emailResult
  return check(sendLimiter, `ip:${ip}`)
}

export async function checkOtpVerifyRateLimit(email: string, ip: string): Promise<OtpRateLimitResult> {
  const emailResult = await check(verifyLimiter, `email:${email}`)
  if (!emailResult.allowed || emailResult.unavailable) return emailResult
  return check(verifyLimiter, `ip:${ip}`)
}

export async function checkUploadRateLimit(userId: string, ip: string): Promise<OtpRateLimitResult> {
  const userResult = await check(uploadLimiter, `user:${userId}`)
  if (!userResult.allowed || userResult.unavailable) return userResult
  return check(uploadLimiter, `ip:${ip}`)
}
