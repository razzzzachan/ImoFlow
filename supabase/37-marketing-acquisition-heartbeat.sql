-- =====================================================
-- IMMOFLOW - HEARTBEAT DIARIO DE AQUISICAO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.marketing_acquisition_heartbeat_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  run_type TEXT NOT NULL DEFAULT 'daily' CHECK (run_type IN ('daily', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('ok', 'degraded', 'failed')),
  snapshot_date DATE NOT NULL,
  window_days INTEGER NOT NULL DEFAULT 7,
  source_status JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  action_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  markdown TEXT NOT NULL DEFAULT '',
  error_message TEXT,
  run_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  run_finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_acquisition_heartbeat_runs_started_at
  ON public.marketing_acquisition_heartbeat_runs(run_started_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketing_acquisition_heartbeat_runs_snapshot_date
  ON public.marketing_acquisition_heartbeat_runs(snapshot_date DESC);

ALTER TABLE public.marketing_acquisition_heartbeat_runs ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_marketing_acquisition_heartbeat_runs_updated_at ON public.marketing_acquisition_heartbeat_runs;
CREATE TRIGGER update_marketing_acquisition_heartbeat_runs_updated_at
  BEFORE UPDATE ON public.marketing_acquisition_heartbeat_runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();