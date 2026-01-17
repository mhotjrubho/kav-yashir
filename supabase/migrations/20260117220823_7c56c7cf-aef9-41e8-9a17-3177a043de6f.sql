-- ==========================================
-- SECURITY FIX: Complaint Insert Policy
-- ==========================================

-- Drop the overly permissive policy that allows arbitrary user_id
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;

-- Create two separate policies for authenticated and anonymous users
-- Authenticated users MUST set their own user_id
CREATE POLICY "Authenticated users can create their own complaints"
ON public.complaints FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Anonymous users can only insert with NULL user_id
CREATE POLICY "Anonymous users can create complaints with null user_id"
ON public.complaints FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- ==========================================
-- SECURITY FIX: Make Storage Bucket Private
-- ==========================================

-- Make the complaint-attachments bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'complaint-attachments';

-- Drop overly permissive storage policies
DROP POLICY IF EXISTS "Anyone can view complaint attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload complaint attachments" ON storage.objects;

-- Create new restrictive storage policies
-- Anyone (authenticated or anon) can still upload
CREATE POLICY "Anyone can upload complaint attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'complaint-attachments');

-- Only admins can view all attachments (they use signed URLs)
CREATE POLICY "Admins can view all attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'complaint-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- ==========================================
-- SECURITY FIX: Revoke Public Access to Tables
-- ==========================================

-- Revoke any direct public access grants on sensitive tables
-- This ensures that only RLS policies control access
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.complaints FROM anon;
REVOKE ALL ON public.user_roles FROM anon;

-- Re-grant necessary INSERT for anonymous complaint submission
GRANT INSERT ON public.complaints TO anon;

-- Ensure authenticated users have the right permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.complaints TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;