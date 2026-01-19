-- Add ministry_case_id column to complaints table
ALTER TABLE public.complaints
ADD COLUMN ministry_case_id text;