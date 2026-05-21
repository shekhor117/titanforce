// Currency conversion and formatting utilities
// Base rate: 1 USD = 110 BDT (approximate, can be adjusted)

export const EXCHANGE_RATE = 110 // 1 USD to BDT
export const CURRENCY_SYMBOL_BDT = '৳'
export const CURRENCY_SYMBOL_USD = '$'

export type Currency = 'USD' | 'BDT'

/**
 * Convert USD to BDT
 */
export function usdToBdt(amount: number): number {
  return Math.round(amount * EXCHANGE_RATE)
}

/**
 * Convert BDT to USD
 */
export function bdtToUsd(amount: number): number {
  return Math.round(amount / EXCHANGE_RATE)
}

/**
 * Format price with currency symbol and locale
 */
export function formatPrice(
  amount: number,
  currency: Currency = 'BDT',
  locale: string = 'bn-BD'
): string {
  if (currency === 'BDT') {
    const bdt = typeof amount === 'number' && amount < 1000 ? usdToBdt(amount) : amount
    return `${CURRENCY_SYMBOL_BDT} ${bdt.toLocaleString(locale)}`
  }
  return `${CURRENCY_SYMBOL_USD} ${amount.toLocaleString(locale)}`
}

/**
 * Format price in USD
 */
export function formatUSD(amount: number): string {
  return `${CURRENCY_SYMBOL_USD} ${amount.toLocaleString('en-US')}`
}

/**
 * Format price in BDT
 */
export function formatBDT(amount: number): string {
  return `${CURRENCY_SYMBOL_BDT} ${Math.round(amount).toLocaleString('bn-BD')}`
}

/**
 * Get price in specified currency
 */
export function getPrice(usdAmount: number, currency: Currency = 'BDT'): number {
  return currency === 'BDT' ? usdToBdt(usdAmount) : usdAmount
}

/**
 * Format total order price
 */
export function formatOrderTotal(
  usdTotal: number,
  currency: Currency = 'BDT'
): string {
  if (currency === 'BDT') {
    return formatBDT(usdToBdt(usdTotal))
  }
  return formatUSD(usdTotal)
}

/**
 * Price list for jersey store items in USD
 */
export const JERSEY_PRICES_USD = {
  base: 45,
  homKit: 0,
  awayKit: 5,
  thirdKit: 8,
  badgesChampionsGold: 8,
  badgesPremierSilver: 5,
  badgesClassicBronze: 0,
  leaguePatch: 3,
  sizeXS: 0,
  sizeS: 0,
  sizeM: 0,
  sizeL: 0,
  sizeXL: 0,
  sizeXXL: 3,
  sizeXXXL: 5,
} as const

/**
 * Get final price for jersey with customizations
 */
export function calculateJerseyPrice(options: {
  kitType?: 'Home' | 'Away' | 'Third'
  badgeType?: 'Champions Gold' | 'Premier Silver' | 'Classic Bronze'
  sizeType?: string
  hasLeaguePatch?: boolean
}): number {
  let price = JERSEY_PRICES_USD.base
  
  if (options.kitType === 'Away') price += JERSEY_PRICES_USD.awayKit
  if (options.kitType === 'Third') price += JERSEY_PRICES_USD.thirdKit
  
  if (options.badgeType === 'Champions Gold') price += JERSEY_PRICES_USD.badgesChampionsGold
  if (options.badgeType === 'Premier Silver') price += JERSEY_PRICES_USD.badgesPremierSilver
  
  if (options.sizeType === 'XXL') price += JERSEY_PRICES_USD.sizeXXL
  if (options.sizeType === 'XXXL') price += JERSEY_PRICES_USD.sizeXXXL
  
  if (options.hasLeaguePatch) price += JERSEY_PRICES_USD.leaguePatch
  
  return price
}

export default {
  EXCHANGE_RATE,
  CURRENCY_SYMBOL_BDT,
  CURRENCY_SYMBOL_USD,
  usdToBdt,
  bdtToUsd,
  formatPrice,
  formatUSD,
  formatBDT,
  getPrice,
  formatOrderTotal,
  calculateJerseyPrice,
  JERSEY_PRICES_USD,
}
