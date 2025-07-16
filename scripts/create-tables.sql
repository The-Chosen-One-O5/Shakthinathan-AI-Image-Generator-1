-- Create table for storing image generations
CREATE TABLE IF NOT EXISTS image_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  model VARCHAR(50) NOT NULL,
  size VARCHAR(20) NOT NULL,
  count INTEGER NOT NULL,
  images JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_image_generations_created_at ON image_generations(created_at DESC);

-- Enable Row Level Security (optional)
ALTER TABLE image_generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON image_generations FOR ALL USING (true);
