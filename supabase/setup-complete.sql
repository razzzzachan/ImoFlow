-- =====================================================
-- IMMOFLOW - SETUP COMPLETO DO BANCO DE DADOS
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELAS DE AUTENTICAÇÃO
-- =====================================================

-- Tabela de usuários (estende auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'corretor' CHECK (role IN ('admin', 'gestor', 'corretor', 'atendente')),
  avatar_url TEXT,
  company_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de convites de usuários
CREATE TABLE IF NOT EXISTS public.user_invites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gestor', 'corretor', 'atendente')),
  invited_by UUID REFERENCES public.users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tokens de recuperação de senha
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELAS DO CRM
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
  property_type TEXT,
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
  metadata JSONB,
  file_url TEXT,
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
-- 3. TABELAS DE BOTS
-- =====================================================

-- Tabela de bots
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  mode TEXT DEFAULT 'assistido' CHECK (mode IN ('assistido', 'avancado')),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fluxos de bots
CREATE TABLE IF NOT EXISTS public.bot_flows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  flow_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de blocos de atendimento
CREATE TABLE IF NOT EXISTS public.bot_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  flow_id UUID REFERENCES public.bot_flows(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('message', 'question', 'condition', 'action', 'ai_analysis')),
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conexões entre blocos
CREATE TABLE IF NOT EXISTS public.bot_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  flow_id UUID REFERENCES public.bot_flows(id) ON DELETE CASCADE,
  from_block_id UUID REFERENCES public.bot_blocks(id) ON DELETE CASCADE,
  to_block_id UUID REFERENCES public.bot_blocks(id) ON DELETE CASCADE,
  condition_key TEXT,
  condition_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de bot (conversas ativas)
CREATE TABLE IF NOT EXISTS public.bot_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id),
  lead_id UUID REFERENCES public.leads(id),
  channel TEXT NOT NULL,
  channel_user_id TEXT NOT NULL,
  current_block_id UUID REFERENCES public.bot_blocks(id),
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens do bot
CREATE TABLE IF NOT EXISTS public.bot_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.bot_sessions(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.bot_blocks(id),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'audio', 'image', 'document', 'button')),
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABELAS DO WHATSAPP
-- =====================================================

-- Tabela de configurações do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  session_data JSONB,
  is_connected BOOLEAN DEFAULT FALSE,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELAS DE BILLING (PREPARADAS)
-- =====================================================

-- Tabela de planos
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL NOT NULL,
  features JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  plan_id UUID REFERENCES public.plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de consumo de tokens
CREATE TABLE IF NOT EXISTS public.token_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  cost DECIMAL NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FUNÇÃO PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
