-- Add new columns to profiles table for enhanced tutor information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS certificates text[],
ADD COLUMN IF NOT EXISTS course_topics text[],
ADD COLUMN IF NOT EXISTS teaching_levels text[],
ADD COLUMN IF NOT EXISTS intro_video_url text,
ADD COLUMN IF NOT EXISTS suitable_for text[];

-- Add default empty arrays
UPDATE public.profiles SET 
  certificates = '{}',
  course_topics = '{}',
  teaching_levels = '{}',
  suitable_for = '{}'
WHERE certificates IS NULL;