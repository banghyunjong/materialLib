-- 1. Fabric Master (Update or recreate if needed)
-- NOTE: If the table already exists, you may need to ALTER it to add missing columns like season_month, category_major, etc.
-- However, based on the request, here is the full definition.
-- 1. Alter Fabric Master to remove columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'brand') THEN
        ALTER TABLE fabric_master DROP COLUMN brand;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'season_year') THEN
        ALTER TABLE fabric_master DROP COLUMN season_year;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'season_month') THEN
        ALTER TABLE fabric_master DROP COLUMN season_month;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'season_term') THEN
        ALTER TABLE fabric_master DROP COLUMN season_term;
    END IF;
END $$;

-- Drop index if exists (Postgres handles this gracefully usually but good to be explicit or ignore error)
DROP INDEX IF EXISTS idx_fabric_master_brand;


-- Indexes
CREATE INDEX IF NOT EXISTS idx_fabric_master_art_no ON fabric_master(art_no);
CREATE INDEX IF NOT EXISTS idx_mixing_ratio_fabric_id ON fabric_mixing_ratio(fabric_id);
CREATE INDEX IF NOT EXISTS idx_fabric_color_fabric_id ON fabric_color(fabric_id);
CREATE INDEX IF NOT EXISTS idx_style_link_fabric_id ON fabric_style_link(fabric_id);
CREATE INDEX IF NOT EXISTS idx_style_link_code ON fabric_style_link(style_code);

-- 5. Add fabric_code and auto-generation logic
-- Add column if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'fabric_code') THEN
        ALTER TABLE fabric_master ADD COLUMN fabric_code TEXT UNIQUE;
    END IF;
END $$;

-- Create Sequence for Serial Number
CREATE SEQUENCE IF NOT EXISTS seq_fabric_code_serial START 1;

-- Function to generate fabric_code
CREATE OR REPLACE FUNCTION generate_fabric_code()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT;
    serial_num INT;
BEGIN
    -- category_middle이 없으면 기본값 'XX' 또는 예외처리
    prefix := NEW.category_middle;
    IF prefix IS NULL OR prefix = '' THEN
        prefix := 'XX';
    END IF;
    
    -- 시퀀스에서 다음 값 가져오기
    serial_num := nextval('seq_fabric_code_serial');
    
    -- 포맷팅: Prefix(2자리) + Serial(6자리, 0 padding)
    -- 예: PL000001
    NEW.fabric_code := prefix || to_char(serial_num, 'FM000000');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute before insert
DROP TRIGGER IF EXISTS trg_generate_fabric_code ON fabric_master;
CREATE TRIGGER trg_generate_fabric_code
    BEFORE INSERT ON fabric_master
    FOR EACH ROW
    EXECUTE FUNCTION generate_fabric_code();

-- 6. Add Physical Properties columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'yarn_count_warp') THEN
        ALTER TABLE fabric_master ADD COLUMN yarn_count_warp TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'yarn_count_weft') THEN
        ALTER TABLE fabric_master ADD COLUMN yarn_count_weft TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'density_warp') THEN
        ALTER TABLE fabric_master ADD COLUMN density_warp TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'density_weft') THEN
        ALTER TABLE fabric_master ADD COLUMN density_weft TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'shrinkage') THEN
        ALTER TABLE fabric_master ADD COLUMN shrinkage TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fabric_master' AND column_name = 'color_fastness') THEN
        ALTER TABLE fabric_master ADD COLUMN color_fastness TEXT;
    END IF;
END $$;


