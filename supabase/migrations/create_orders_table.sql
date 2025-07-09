-- Create orders table for The Hungry Drop
CREATE TABLE IF NOT EXISTS orders_hd2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  items JSONB NOT NULL,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE orders_hd2024 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users" 
  ON orders_hd2024 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" 
  ON orders_hd2024 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Create index on order_id
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders_hd2024(order_id);

-- Create index on customer_email
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders_hd2024(customer_email);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders_hd2024(status);