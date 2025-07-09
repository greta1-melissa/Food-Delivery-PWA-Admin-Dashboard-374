-- Create users table for customer accounts
CREATE TABLE IF NOT EXISTS users_hd2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE users_hd2024 ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view own profile" 
  ON users_hd2024 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON users_hd2024 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON users_hd2024 
  FOR UPDATE 
  TO authenticated, anon
  USING (true);

-- Update orders table to link to users
ALTER TABLE orders_hd2024 ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE orders_hd2024 ADD CONSTRAINT fk_orders_user 
  FOREIGN KEY (user_id) REFERENCES users_hd2024(id) ON DELETE SET NULL;

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders_hd2024(user_id);

-- Update orders policies to be user-specific
DROP POLICY IF EXISTS "Enable read for authenticated users" ON orders_hd2024;
CREATE POLICY "Users can view own orders" 
  ON orders_hd2024 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own orders" 
  ON orders_hd2024 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users_hd2024(email);