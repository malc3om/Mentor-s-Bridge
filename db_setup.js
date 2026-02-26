import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function run() {
    const sql = `
  CREATE TABLE IF NOT EXISTS public.mentee_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL UNIQUE,
      clerk_id TEXT NOT NULL UNIQUE,
      assessment_answers JSONB,
      profile_insights JSONB,
      matching_criteria JSONB,
      career_stage TEXT,
      industry TEXT,
      goals JSONB,
      preferences JSONB,
      profile_generated_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_mentee_profile_insights ON public.mentee_profiles USING GIN (profile_insights);
  CREATE INDEX IF NOT EXISTS idx_mentee_matching_criteria ON public.mentee_profiles USING GIN (matching_criteria);

  ALTER TABLE public.mentee_profiles ENABLE ROW LEVEL SECURITY;

  -- Allow anyone to read profiles (helpful for matching)
  CREATE POLICY "Enable read access for all users" ON public.mentee_profiles FOR SELECT USING (true);
  
  -- Create policy for user updates
  CREATE POLICY "Enable update for users based on clerk_id" ON public.mentee_profiles
    FOR ALL USING (auth.uid()::text = clerk_id) WITH CHECK (auth.uid()::text = clerk_id);
  `

    console.log("We cannot run raw SQL easily via client API on production. You'll need to run this in the Supabase SQL Editor.")
}

run();
