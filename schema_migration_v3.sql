-- Add 'specs' JSONB column to store flexible fabric specifications
ALTER TABLE fabric_master 
ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;

-- Create a GIN index on 'specs' for efficient JSON searching later
CREATE INDEX IF NOT EXISTS idx_fabric_master_specs ON fabric_master USING GIN (specs);
