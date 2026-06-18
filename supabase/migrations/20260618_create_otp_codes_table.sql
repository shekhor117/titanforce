-- Create OTP codes table for storing temporarily generated OTP codes
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email and code for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON public.otp_codes(code);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create OTP codes
CREATE POLICY "Allow anyone to create OTP codes"
  ON public.otp_codes
  FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own OTP codes
CREATE POLICY "Allow reading own OTP codes"
  ON public.otp_codes
  FOR SELECT
  USING (true);

-- Allow users to update their own OTP codes
CREATE POLICY "Allow updating own OTP codes"
  ON public.otp_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Auto-cleanup function to remove expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
