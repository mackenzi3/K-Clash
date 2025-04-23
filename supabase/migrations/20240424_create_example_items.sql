-- Create example_items table for testing
CREATE TABLE IF NOT EXISTS public.example_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.example_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Example items are viewable by everyone"
  ON public.example_items
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert example items"
  ON public.example_items
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own example items"
  ON public.example_items
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete example items"
  ON public.example_items
  FOR DELETE
  USING (auth.role() = 'authenticated');
