-- Company (organization) settings for SaaS (MVP)
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: allow only users whose company_name matches
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_settings_select ON public.company_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.company_name IS NOT NULL AND u.company_name = company_settings.company_name
    )
  );
CREATE POLICY company_settings_upsert ON public.company_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.company_name IS NOT NULL AND u.company_name = company_settings.company_name
    )
  );
CREATE POLICY company_settings_update ON public.company_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.company_name IS NOT NULL AND u.company_name = company_settings.company_name
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.company_name IS NOT NULL AND u.company_name = company_settings.company_name
    )
  );

