-- Create app_users table for centralized user management
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'player', 'fan', 'partner', 'user')) DEFAULT 'user',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'banned')) DEFAULT 'active',
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON public.app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_auth_id ON public.app_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_app_users_created_at ON public.app_users(created_at DESC);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Allow public to view active users (for users listing page)
CREATE POLICY "Allow public to view active users"
  ON public.app_users
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users to view their own profile
CREATE POLICY "Allow users to view own profile"
  ON public.app_users
  FOR SELECT
  USING (auth_id = auth.uid());

-- Allow authenticated admins to view all users
CREATE POLICY "Allow admins to view all users"
  ON public.app_users
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow authenticated admins to insert users
CREATE POLICY "Allow admins to insert users"
  ON public.app_users
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow authenticated admins to update users
CREATE POLICY "Allow admins to update users"
  ON public.app_users
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow authenticated admins to delete users
CREATE POLICY "Allow admins to delete users"
  ON public.app_users
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_app_users_updated_at_trigger ON public.app_users;
CREATE TRIGGER update_app_users_updated_at_trigger
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_app_users_updated_at();
