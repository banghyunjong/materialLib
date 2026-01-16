-- Add 'is_fixed_material' column to fabric_master
ALTER TABLE fabric_master 
ADD COLUMN IF NOT EXISTS is_fixed_material BOOLEAN DEFAULT false;
