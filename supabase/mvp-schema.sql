-- ============================================================================
-- IMMOFLOW MVP - SCHEMA DO BANCO DE DADOS
-- Sistema definitivo para imobiliárias com IA especializada
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABELAS PRINCIPAIS DO MVP
-- ============================================================================

-- Tabela de usuários (já existe, mas vamos garantir campos MVP)
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'essencial' CHECK (plan_type IN ('essencial', 'personalizavel', 'gestao', 'rede'));
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS plan_price DECIMAL(10,2) DEFAULT 29.00;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 100;

-- Tabela de leads (otimizada para MVP)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados básicos
  name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- Status e classificação
  status TEXT DEFAULT 'captado' CHECK (status IN (
    'captado', 'em_atendimento', 'visita_marcada', 
    'proposta', 'negociacao', 'fechado', 'perdido'
  )),
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  source TEXT DEFAULT 'whatsapp' CHECK (source IN (
    'whatsapp', 'website', 'portal', 'manual', 'referral'
  )),
  
  -- Dados imobiliários (IA especializada)
  interest_type TEXT CHECK (interest_type IN ('compra', 'venda', 'aluguel')),
  property_type TEXT CHECK (property_type IN (
    'apartamento', 'casa', 'comercial', 'terreno', 'rural'
  )),
  location_preference TEXT,
  budget_range TEXT,
  urgency_level TEXT DEFAULT 'media' CHECK (urgency_level IN ('baixa', 'media', 'alta')),
  
  -- Metadados
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para performance
  UNIQUE(user_id, phone)
);

-- Tabela de interações (histórico completo)
CREATE TABLE IF NOT EXISTS lead_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo e conteúdo
  type TEXT NOT NULL CHECK (type IN (
    'whatsapp_message', 'phone_call', 'email', 'visit', 
    'status_change', 'note', 'ai_analysis'
  )),
  content TEXT NOT NULL,
  direction TEXT DEFAULT 'inbound' CHECK (direction IN ('inbound', 'outbound')),
  
  -- Dados da IA
  ai_analysis JSONB,
  ai_confidence DECIMAL(3,2),
  
  -- Metadados
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de automações (MVP básico)
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Configuração básica
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  
  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'new_lead', 'status_change', 'time_based', 'score_threshold'
  )),
  trigger_conditions JSONB DEFAULT '{}',
  
  -- Ações
  actions JSONB NOT NULL DEFAULT '[]',
  
  -- Estatísticas
  executions_count INTEGER DEFAULT 0,
  last_execution TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de integrações API
CREATE TABLE IF NOT EXISTS api_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Configuração
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('webhook', 'api_key', 'oauth')),
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  
  -- Configurações específicas
  webhook_url TEXT,
  allowed_origins TEXT[] DEFAULT '{}',
  permissions JSONB DEFAULT '{"read": true, "write": false}',
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de billing (sistema de créditos)
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Evento
  event_type TEXT NOT NULL CHECK (event_type IN (
    'whatsapp_message', 'ai_processing', 'ocr_document', 
    'voice_call', 'email_sent', 'automation_execution'
  )),
  cost INTEGER NOT NULL DEFAULT 1, -- Custo em créditos
  
  -- Contexto
  lead_id UUID REFERENCES leads(id),
  automation_id UUID REFERENCES automations(id),
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos disponíveis
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificação do plano
  plan_code TEXT UNIQUE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_description TEXT,

  -- Preços
  monthly_price DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2) DEFAULT 0,

  -- Recursos incluídos
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',

  -- Configurações
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO subscription_plans (plan_code, plan_name, plan_description, monthly_price, features, limits) VALUES
('essencial', 'Plano Essencial', 'Ideal para corretor solo ou micro imobiliária', 29.00,
 '{"whatsapp_channels": 1, "voice_ai": true, "basic_flows": true, "basic_reports": true}',
 '{"voice_credits": 100, "leads_per_month": 500, "automations": 3}'),
('personalizavel', 'Plano Personalizável', 'Pequena imobiliária estruturada', 149.00,
 '{"whatsapp_channels": 2, "voice_ai": true, "custom_flows": true, "personalization": true, "own_number": true}',
 '{"voice_credits": 500, "leads_per_month": 2000, "automations": 10}'),
('gestao', 'Plano Gestão', 'Imobiliária com equipe e operação consolidada', 600.00,
 '{"multichannel": true, "voice_ai": true, "advanced_flows": true, "crm_included": true, "integrations": true, "team_reports": true}',
 '{"voice_credits": 2000, "leads_per_month": 10000, "automations": 50, "team_members": 10}'),
('rede', 'Plano Rede', 'Redes, franquias ou grupos de imobiliárias', 1200.00,
 '{"enterprise_features": true, "multi_unit": true, "advanced_permissions": true, "dedicated_support": true, "api_access": true}',
 '{"voice_credits": 10000, "leads_per_month": 50000, "automations": 200, "team_members": 100, "units": 10}');

-- Tabela de configurações da IA
CREATE TABLE IF NOT EXISTS ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personalização
  personality TEXT DEFAULT 'profissional',
  tone TEXT DEFAULT 'consultivo',
  specialization_context TEXT,
  
  -- Conhecimento específico
  custom_knowledge TEXT,
  property_types TEXT[] DEFAULT '{"apartamento", "casa", "comercial"}',
  locations TEXT[] DEFAULT '{}',
  price_ranges JSONB DEFAULT '{}',
  
  -- Configurações avançadas
  response_style JSONB DEFAULT '{"length": "medium", "formality": "professional"}',
  auto_qualification BOOLEAN DEFAULT TRUE,
  lead_scoring_weights JSONB DEFAULT '{"email": 10, "budget": 15, "location": 10, "urgency": 20}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Interações
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON lead_interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON lead_interactions(created_at DESC);

-- Automações
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_active ON automations(active);
CREATE INDEX IF NOT EXISTS idx_automations_trigger_type ON automations(trigger_type);

-- Billing
CREATE INDEX IF NOT EXISTS idx_billing_user_id ON billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_event_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_created_at ON billing_events(created_at DESC);

-- ============================================================================
-- TRIGGERS PARA AUTOMAÇÃO
-- ============================================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas necessárias
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automations_updated_at ON automations;
CREATE TRIGGER update_automations_updated_at 
  BEFORE UPDATE ON automations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contabilizar créditos automaticamente
CREATE OR REPLACE FUNCTION track_billing_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Descontar créditos do usuário
  UPDATE users 
  SET credits_balance = credits_balance - NEW.cost
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS track_billing_on_insert ON billing_events;
CREATE TRIGGER track_billing_on_insert
  AFTER INSERT ON billing_events
  FOR EACH ROW EXECUTE FUNCTION track_billing_event();

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para calcular lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_email TEXT,
  p_budget_range TEXT,
  p_location_preference TEXT,
  p_interest_type TEXT,
  p_urgency_level TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Email (+10)
  IF p_email IS NOT NULL AND p_email != '' THEN
    score := score + 10;
  END IF;
  
  -- Budget range (+15)
  IF p_budget_range IS NOT NULL AND p_budget_range != '' THEN
    score := score + 15;
  END IF;
  
  -- Location (+10)
  IF p_location_preference IS NOT NULL AND p_location_preference != '' THEN
    score := score + 10;
  END IF;
  
  -- Interest type
  CASE p_interest_type
    WHEN 'compra' THEN score := score + 20;
    WHEN 'venda' THEN score := score + 15;
    WHEN 'aluguel' THEN score := score + 10;
    ELSE score := score + 5;
  END CASE;
  
  -- Urgency
  CASE p_urgency_level
    WHEN 'alta' THEN score := score + 20;
    WHEN 'media' THEN score := score + 10;
    WHEN 'baixa' THEN score := score + 5;
    ELSE score := score + 5;
  END CASE;
  
  RETURN LEAST(score, 100); -- Máximo 100
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DADOS INICIAIS PARA MVP
-- ============================================================================

-- Automações padrão para novos usuários
INSERT INTO automations (user_id, name, description, trigger_type, trigger_conditions, actions) 
SELECT 
  id,
  'Resposta Automática WhatsApp',
  'Responde automaticamente novas mensagens no WhatsApp',
  'new_lead',
  '{"source": "whatsapp"}',
  '[{"type": "send_message", "template": "welcome_message", "delay": 0}]'
FROM users 
WHERE NOT EXISTS (
  SELECT 1 FROM automations 
  WHERE automations.user_id = users.id 
  AND automations.name = 'Resposta Automática WhatsApp'
);

-- Configuração padrão de IA para novos usuários
INSERT INTO ai_configurations (user_id, personality, specialization_context)
SELECT 
  id,
  'profissional',
  'Especialista em imóveis residenciais e comerciais, com foco em atendimento consultivo e qualificação de leads.'
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM ai_configurations 
  WHERE ai_configurations.user_id = users.id
);

-- ============================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas para leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own leads" ON leads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (user_id = auth.uid());

-- Políticas para interações
CREATE POLICY "Users can view own interactions" ON lead_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own interactions" ON lead_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas para automações
CREATE POLICY "Users can manage own automations" ON automations
  FOR ALL USING (user_id = auth.uid());

-- Políticas para integrações
CREATE POLICY "Users can manage own integrations" ON api_integrations
  FOR ALL USING (user_id = auth.uid());

-- Políticas para billing
CREATE POLICY "Users can view own billing" ON billing_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert billing events" ON billing_events
  FOR INSERT WITH CHECK (true);

-- Políticas para configurações IA
CREATE POLICY "Users can manage own AI config" ON ai_configurations
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- COMENTÁRIOS FINAIS
-- ============================================================================

COMMENT ON TABLE leads IS 'Leads capturados via WhatsApp, website e outras fontes com IA especializada';
COMMENT ON TABLE lead_interactions IS 'Histórico completo de interações com leads';
COMMENT ON TABLE automations IS 'Automações configuráveis para otimizar atendimento';
COMMENT ON TABLE api_integrations IS 'Integrações API para conectar sistemas externos';
COMMENT ON TABLE billing_events IS 'Sistema de créditos para monetização escalável';
COMMENT ON TABLE ai_configurations IS 'Configurações personalizadas da IA especializada';

-- Schema MVP criado com sucesso! 🚀
