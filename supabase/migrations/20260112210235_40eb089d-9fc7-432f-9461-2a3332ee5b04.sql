-- Make user_id nullable for anonymous submissions
ALTER TABLE public.complaints ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own complaints" ON public.complaints;

-- Create new INSERT policy that allows anyone to insert
CREATE POLICY "Anyone can create complaints"
ON public.complaints
FOR INSERT
WITH CHECK (true);