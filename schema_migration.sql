-- 1. Fabric Master (Update or recreate if needed)
-- NOTE: If the table already exists, you may need to ALTER it to add missing columns like season_month, category_major, etc.
-- However, based on the request, here is the full definition.
CREATE TABLE IF NOT EXISTS fabric_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  season_year TEXT NOT NULL,
  season_month TEXT NOT NULL,
  season_term TEXT NOT NULL,
  art_no TEXT NOT NULL UNIQUE,
  vendor_name TEXT,
  category_major TEXT,
  category_middle TEXT,
  width TEXT,
  weight TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. Fabric Mixing Ratio (Already implemented but included for completeness)
CREATE TABLE IF NOT EXISTS fabric_mixing_ratio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_id UUID NOT NULL REFERENCES fabric_master(id) ON DELETE CASCADE,
  fiber_type TEXT NOT NULL,
  percentage INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 3. Fabric Color (Renamed from Detail, New Table)
CREATE TABLE IF NOT EXISTS fabric_color (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_id UUID NOT NULL REFERENCES fabric_master(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  pantone_code TEXT,
  style_code TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 4. Fabric Style Link (New Table)
CREATE TABLE IF NOT EXISTS fabric_style_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_id UUID NOT NULL REFERENCES fabric_master(id) ON DELETE CASCADE,
  style_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fabric_master_brand ON fabric_master(brand);
CREATE INDEX IF NOT EXISTS idx_fabric_master_art_no ON fabric_master(art_no);
CREATE INDEX IF NOT EXISTS idx_mixing_ratio_fabric_id ON fabric_mixing_ratio(fabric_id);
CREATE INDEX IF NOT EXISTS idx_fabric_color_fabric_id ON fabric_color(fabric_id);
CREATE INDEX IF NOT EXISTS idx_style_link_fabric_id ON fabric_style_link(fabric_id);
CREATE INDEX IF NOT EXISTS idx_style_link_code ON fabric_style_link(style_code);
