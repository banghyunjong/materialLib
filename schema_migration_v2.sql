-- Add original_spec_text column to fabric_master to store raw user input from AI Smart Input
ALTER TABLE fabric_master 
ADD COLUMN IF NOT EXISTS original_spec_text TEXT;
