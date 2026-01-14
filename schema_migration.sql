-- 2025-01-14: Refactor Price to History Table
CREATE TABLE IF NOT EXISTS fabric_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_id UUID NOT NULL REFERENCES fabric_master(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  vendor_name TEXT,
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_price_history_fabric_id ON fabric_price_history(fabric_id);

-- Remove columns from fabric_master
-- Note: In a real production env, we'd migrate data first.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'price') THEN
        ALTER TABLE fabric_master DROP COLUMN price;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'currency') THEN
        ALTER TABLE fabric_master DROP COLUMN currency;
    END IF;
END $$;