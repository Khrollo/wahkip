-- Add capacity field to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS capacity text CHECK (capacity IN ('low', 'medium', 'high'));

-- Create index for capacity
CREATE INDEX IF NOT EXISTS idx_events_capacity ON public.events (capacity);

