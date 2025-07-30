-- =====================================================
-- IMMOFLOW - DADOS INICIAIS
-- Execute este script APÓS setup-complete.sql e setup-triggers-rls.sql
-- =====================================================

-- =====================================================
-- 1. PLANOS INICIAIS
-- =====================================================

INSERT INTO public.plans (name, description, price_monthly, features, limits, is_active) VALUES
(
  'Básico',
  'Ideal para corretores individuais',
  99.90,
  '{"bots": true, "crm": true, "whatsapp": true, "ai_basic": true}',
  '{"leads_per_month": 100, "bots": 2, "users": 1, "ai_requests": 500}',
  true
),
(
  'Pro',
  'Perfeito para pequenas imobiliárias',
  299.90,
  '{"bots": true, "crm": true, "whatsapp": true, "ai_advanced": true, "reports": true}',
  '{"leads_per_month": 500, "bots": 10, "users": 5, "ai_requests": 2000}',
  true
),
(
  'Avançado',
  'Para grandes imobiliárias e redes',
  599.90,
  '{"bots": true, "crm": true, "whatsapp": true, "ai_advanced": true, "reports": true, "api": true, "white_label": true}',
  '{"leads_per_month": -1, "bots": -1, "users": -1, "ai_requests": 10000}',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. FUNIL PADRÃO
-- =====================================================

-- Inserir funil padrão (será criado automaticamente para novos usuários)
-- Este é apenas um exemplo, o funil real será criado via aplicação

-- =====================================================
-- 3. DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Descomente as seções abaixo se quiser dados de exemplo

/*
-- Usuário de exemplo (você precisará criar via Supabase Auth primeiro)
-- INSERT INTO public.users (id, name, email, role, company_name) VALUES
-- (
--   'user-uuid-here',
--   'João Silva',
--   'joao@imobiliaria.com',
--   'admin',
--   'Imobiliária Silva'
-- );

-- Lead de exemplo
-- INSERT INTO public.leads (name, email, phone, property_type, location, status, source, priority) VALUES
-- (
--   'Maria Santos',
--   'maria@email.com',
--   '(11) 99999-9999',
--   'apartamento',
--   'São Paulo - SP',
--   'captado',
--   'whatsapp',
--   'medium'
-- );

-- Bot de exemplo
-- INSERT INTO public.bots (user_id, name, description, mode) VALUES
-- (
--   'user-uuid-here',
--   'Assistente Imobiliário',
--   'Bot para atendimento inicial de leads',
--   'assistido'
-- );
*/

-- =====================================================
-- 4. CONFIGURAÇÕES DO SISTEMA
-- =====================================================

-- Criar uma view para estatísticas rápidas
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.leads) as total_leads,
  (SELECT COUNT(*) FROM public.leads WHERE status = 'captado') as leads_captados,
  (SELECT COUNT(*) FROM public.leads WHERE status = 'fechado') as leads_fechados,
  (SELECT COUNT(*) FROM public.tasks WHERE completed = false) as tasks_pendentes,
  (SELECT COUNT(*) FROM public.interactions WHERE created_at >= CURRENT_DATE) as interacoes_hoje,
  (SELECT COUNT(*) FROM public.bots WHERE is_active = true) as bots_ativos;

-- =====================================================
-- 5. FUNÇÕES ÚTEIS
-- =====================================================

-- Função para calcular score do lead
CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_email TEXT,
  p_phone TEXT,
  p_whatsapp TEXT,
  p_budget_min DECIMAL,
  p_budget_max DECIMAL,
  p_location TEXT,
  p_property_type TEXT,
  p_source TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50; -- Score base
BEGIN
  -- Pontuação por informações fornecidas
  IF p_email IS NOT NULL THEN score := score + 10; END IF;
  IF p_phone IS NOT NULL THEN score := score + 10; END IF;
  IF p_whatsapp IS NOT NULL THEN score := score + 15; END IF;
  IF p_budget_min IS NOT NULL AND p_budget_max IS NOT NULL THEN score := score + 20; END IF;
  IF p_location IS NOT NULL THEN score := score + 10; END IF;
  IF p_property_type IS NOT NULL THEN score := score + 10; END IF;
  
  -- Pontuação por fonte
  CASE p_source
    WHEN 'indicacao' THEN score := score + 25;
    WHEN 'site' THEN score := score + 15;
    WHEN 'whatsapp', 'bot' THEN score := score + 10;
    ELSE score := score + 5;
  END CASE;
  
  -- Máximo 100
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar score automaticamente
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lead_score := calculate_lead_score(
    NEW.email,
    NEW.phone,
    NEW.whatsapp,
    NEW.budget_min,
    NEW.budget_max,
    NEW.location,
    NEW.property_type,
    NEW.source
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar score automaticamente
CREATE TRIGGER trigger_update_lead_score
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_score();

-- =====================================================
-- 6. STORAGE BUCKETS (Execute no Supabase Dashboard)
-- =====================================================

-- Você precisa criar estes buckets manualmente no Supabase Dashboard:
-- 1. interactions (para arquivos de interações)
-- 2. avatars (para fotos de perfil)
-- 3. documents (para documentos gerais)

-- Ou execute via SQL (se tiver permissões):
/*
INSERT INTO storage.buckets (id, name, public) VALUES 
('interactions', 'interactions', false),
('avatars', 'avatars', true),
('documents', 'documents', false);
*/

-- =====================================================
-- 7. POLÍTICAS DE STORAGE
-- =====================================================

-- Políticas para o bucket interactions
/*
CREATE POLICY "Users can upload interaction files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'interactions' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view interaction files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'interactions' AND
    auth.role() = 'authenticated'
  );
*/

-- =====================================================
-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar dados inseridos
SELECT 'Planos criados:' as info, COUNT(*) as count FROM public.plans
UNION ALL
SELECT 'Funções criadas:', COUNT(*) FROM pg_proc WHERE proname LIKE '%lead%'
UNION ALL
SELECT 'Views criadas:', COUNT(*) FROM pg_views WHERE schemaname = 'public'
UNION ALL
SELECT 'Triggers criados:', COUNT(*) FROM pg_trigger WHERE tgname LIKE '%lead%';

-- Mostrar estrutura final
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- =====================================================
-- SETUP COMPLETO!
-- =====================================================

SELECT 'ImmoFlow database setup completed successfully!' as status;
