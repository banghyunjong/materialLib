-- Add 'search_text' column for universal search
ALTER TABLE fabric_master 
ADD COLUMN IF NOT EXISTS search_text TEXT;

-- Create a trigram index for fast text search (optional but recommended for 'ilike')
-- Note: Requires pg_trgm extension. If not enabled, standard index or no index works for small datasets.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_fabric_master_search_text ON fabric_master USING GIN (search_text gin_trgm_ops);
