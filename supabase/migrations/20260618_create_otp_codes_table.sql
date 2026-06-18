-- Drop existing table and policies if they exist (for fresh migration)
DROP TABLE IF EXISTS public.otp_codes CASCADE;

-- Create OTP codes table for storing temporarily generated OTP codes
CREATE TABLE public.otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX idx_otp_codes_code ON public.otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Enable RLS (but with permissive policies since we use service role)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (service role bypasses RLS but let's be explicit)
CREATE POLICY "Allow service role full access"
  ON public.otp_codes
  FOR ALL
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

-- Grant permissions to authenticated users and service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_codes TO anon, authenticated, service_role;
