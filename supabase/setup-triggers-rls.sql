-- =====================================================
-- IMMOFLOW - TRIGGERS, ÍNDICES E RLS
-- Execute este script APÓS o setup-complete.sql
-- =====================================================

-- =====================================================
-- 7. TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Triggers para todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_funnel_updated_at 
  BEFORE UPDATE ON public.sales_funnel 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bots_updated_at 
  BEFORE UPDATE ON public.bots 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_flows_updated_at 
  BEFORE UPDATE ON public.bot_flows 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_blocks_updated_at 
  BEFORE UPDATE ON public.bot_blocks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_sessions_updated_at 
  BEFORE UPDATE ON public.bot_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_config_updated_at 
  BEFORE UPDATE ON public.whatsapp_config 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at 
  BEFORE UPDATE ON public.plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON public.subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

-- Índices para convites e tokens
CREATE INDEX IF NOT EXISTS idx_user_invites_email ON public.user_invites(email);
CREATE INDEX IF NOT EXISTS idx_user_invites_token ON public.user_invites(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON public.password_reset_tokens(email);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);

-- Índices para interactions
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON public.interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON public.interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.interactions(created_at);

-- Índices para tasks
CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- Índices para bots
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON public.bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_is_active ON public.bots(is_active);
CREATE INDEX IF NOT EXISTS idx_bot_flows_bot_id ON public.bot_flows(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_blocks_flow_id ON public.bot_blocks(flow_id);
CREATE INDEX IF NOT EXISTS idx_bot_sessions_bot_id ON public.bot_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_sessions_is_active ON public.bot_sessions(is_active);

-- Índices para billing
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON public.token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_type ON public.token_usage(type);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON public.token_usage(created_at);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. POLÍTICAS RLS - AUTENTICAÇÃO
-- =====================================================

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para convites (apenas admin/gestor)
CREATE POLICY "Admin/Gestor can manage invites" ON public.user_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'gestor')
    )
  );

-- Políticas para tokens de recuperação
CREATE POLICY "Users can manage own password tokens" ON public.password_reset_tokens
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- 11. POLÍTICAS RLS - CRM
-- =====================================================

-- Políticas para leads (todos podem ver e gerenciar)
CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update leads" ON public.leads
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para interactions
CREATE POLICY "Authenticated users can view interactions" ON public.interactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create interactions" ON public.interactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para tasks
CREATE POLICY "Authenticated users can manage tasks" ON public.tasks
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para lead_status_history
CREATE POLICY "Authenticated users can view status history" ON public.lead_status_history
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create status history" ON public.lead_status_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 12. POLÍTICAS RLS - BOTS
-- =====================================================

-- Políticas para bots (usuários podem gerenciar seus próprios bots)
CREATE POLICY "Users can manage own bots" ON public.bots
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own bot flows" ON public.bot_flows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE id = bot_flows.bot_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own bot flows" ON public.bot_flows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE id = bot_flows.bot_id 
      AND user_id = auth.uid()
    )
  );

-- Políticas similares para bot_blocks, bot_connections, etc.
CREATE POLICY "Users can manage own bot blocks" ON public.bot_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bot_flows bf
      JOIN public.bots b ON b.id = bf.bot_id
      WHERE bf.id = bot_blocks.flow_id 
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own bot sessions" ON public.bot_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE id = bot_sessions.bot_id 
      AND user_id = auth.uid()
    )
  );

-- =====================================================
-- 13. POLÍTICAS RLS - WHATSAPP E BILLING
-- =====================================================

-- Políticas para WhatsApp config
CREATE POLICY "Users can manage own whatsapp config" ON public.whatsapp_config
  FOR ALL USING (user_id = auth.uid());

-- Políticas para plans (todos podem ver)
CREATE POLICY "Everyone can view plans" ON public.plans
  FOR SELECT USING (is_active = true);

-- Políticas para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Políticas para token_usage
CREATE POLICY "Users can view own token usage" ON public.token_usage
  FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- 14. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
