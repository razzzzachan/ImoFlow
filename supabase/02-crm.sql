-- =====================================================
-- IMMOFLOW - MÓDULO CRM
-- Execute este script após o 01-setup.sql
-- =====================================================

-- =====================================================
-- TABELAS DO CRM
-- =====================================================

-- Tabela de funil de vendas (configurável)
CREATE TABLE IF NOT EXISTS public.sales_funnel (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  stages JSONB NOT NULL DEFAULT '[
    {"id": "captado", "name": "Captado", "color": "#6B7280", "order": 1},
    {"id": "em_atendimento", "name": "Em Atendimento", "color": "#3B82F6", "order": 2},
    {"id": "visita_marcada", "name": "Visita Marcada", "color": "#F59E0B", "order": 3},
    {"id": "proposta", "name": "Proposta", "color": "#8B5CF6", "order": 4},
    {"id": "negociacao", "name": "Negociação", "color": "#EF4444", "order": 5},
    {"id": "fechado", "name": "Fechado", "color": "#10B981", "order": 6},
    {"id": "perdido", "name": "Perdido", "color": "#6B7280", "order": 7}
  ]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  property_type TEXT, -- casa, apartamento, terreno, comercial
  location TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  status TEXT DEFAULT 'captado',
  source TEXT DEFAULT 'whatsapp' CHECK (source IN ('whatsapp', 'site', 'indicacao', 'telefone', 'email', 'bot')),
  assigned_to UUID REFERENCES public.users(id),
  tags TEXT[],
  notes TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  lead_score INTEGER DEFAULT 0,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_followup TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de interações
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('text', 'audio', 'image', 'pdf', 'call', 'email', 'meeting', 'note', 'status_change')),
  content TEXT,
  metadata JSONB, -- dados extras como transcrição, análise de imagem, etc.
  file_url TEXT, -- URL do arquivo no Supabase Storage
  ai_processed BOOLEAN DEFAULT FALSE,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de status dos leads
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RLS (ROW LEVEL SECURITY) - CRM
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.sales_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para sales_funnel
CREATE POLICY "Users can view own funnels" ON public.sales_funnel
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own funnels" ON public.sales_funnel
  FOR ALL USING (user_id = auth.uid());

-- Políticas para leads
CREATE POLICY "Users can view all leads" ON public.leads
  FOR SELECT USING (true);

CREATE POLICY "Users can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update leads" ON public.leads
  FOR UPDATE USING (true);

-- Políticas para interactions
CREATE POLICY "Users can view all interactions" ON public.interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create interactions" ON public.interactions
  FOR INSERT WITH CHECK (true);

-- Políticas para lead_status_history
CREATE POLICY "Users can view status history" ON public.lead_status_history
  FOR SELECT USING (true);

CREATE POLICY "Users can create status history" ON public.lead_status_history
  FOR INSERT WITH CHECK (true);

-- Políticas para tasks
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can manage tasks" ON public.tasks
  FOR ALL USING (true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE - CRM
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);

CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON public.interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON public.interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_created_at ON public.lead_status_history(created_at);

CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT - CRM
-- =====================================================

-- Triggers para updated_at
CREATE TRIGGER update_sales_funnel_updated_at 
  BEFORE UPDATE ON public.sales_funnel 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICAÇÃO - CRM
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('sales_funnel', 'leads', 'interactions', 'lead_status_history', 'tasks')
ORDER BY tablename;
