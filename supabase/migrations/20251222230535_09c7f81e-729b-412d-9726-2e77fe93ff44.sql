-- Create storage bucket for complaint attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-attachments', 'complaint-attachments', true);

-- Allow anyone to upload files to the bucket
CREATE POLICY "Anyone can upload complaint attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'complaint-attachments');

-- Allow anyone to view complaint attachments
CREATE POLICY "Anyone can view complaint attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-attachments');