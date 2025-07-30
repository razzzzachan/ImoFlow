# Arquitetura do Sistema ImmoFlow

## 1. Visão Geral
Sistema SaaS completo voltado para corretores e imobiliárias, oferecendo automação de processos via IA com foco em:
- Atendimento automatizado por WhatsApp
- CRM interno com funil de vendas
- Integrações plug & play via API pública
- Cobrança por planos mensais + uso (tokens)
- Interface amigável com configuração assistida de bots

---

## 2. Componentes Principais

### 2.1 Frontend
- Framework: React 18 com TypeScript + TailwindCSS
- Painéis principais:
  - Dashboard geral com métricas em tempo real
  - Módulo CRM (leads, funil Kanban, histórico de interações)
  - Módulo IA/Bots (criação e configuração de fluxos inteligentes)
  - Módulo WhatsApp (conexão, mensagens, automação)
  - Módulo Usuários (gestão de equipes e permissões)
  - Módulo Configurações (perfil, notificações, integrações)

### 2.2 Backend
- Framework: Fastify com TypeScript
- Banco de dados: Supabase (PostgreSQL) com Row Level Security
- Serviços implementados:
  - Autenticação JWT com sistema de roles
  - Gerenciamento de bots com fluxos configuráveis
  - Sistema de leads com pontuação automática
  - Processamento IA multimodal (texto, áudio, imagem, PDF)
  - Integração WhatsApp com sessões ativas
  - API RESTful documentada

### 2.3 Bots IA
- Engine: OpenAI GPT-4 + Whisper + Vision
- Recursos implementados:
  - Fluxos configuráveis com blocos (mensagem, pergunta, condição, ação)
  - Modo Assistido (templates prontos) vs Modo Avançado (edição completa)
  - Processamento multimodal (áudio, imagem, texto)
  - Análise de sentimento e classificação automática
  - Criação automática de leads no CRM
  - Sessões de conversas com variáveis dinâmicas

### 2.4 Sistema de Autenticação
- Supabase Auth integrado
- Roles: admin, gestor, corretor, atendente
- Sistema de convites com tokens seguros
- Recuperação de senha
- Middleware de proteção por tipo de usuário

---

## 3. Infraestrutura Atual

### 3.1 Hospedagem
- Frontend: Vercel (recomendado)
- Backend: Railway / Heroku / Render
- Banco: Supabase (PostgreSQL gerenciado + Auth + Storage)

### 3.2 Integrações
- OpenAI: GPT-4, Whisper, Vision API
- WhatsApp: Web.js para conexão
- Storage: Supabase Storage para arquivos de mídia

### 3.3 Monorepo
```
ImmoFlow/
├── apps/
│   ├── web/              # Frontend React
│   └── api/              # Backend Fastify
├── modules/
│   ├── auth/             # Autenticação
│   ├── bots/             # Sistema de bots
│   ├── crm/              # CRM e leads
│   ├── ai/               # Processamento IA
│   └── whatsapp/         # WhatsApp integration
├── supabase/
│   └── schema.sql        # Schema do banco
└── docs/                 # Documentação
```

---

## 4. Estratégia de Cobrança (Preparada)

### 4.1 Estrutura de Planos
- **Básico**: Recursos limitados, ideal para corretores individuais
- **Pro**: Recursos avançados para pequenas imobiliárias
- **Avançado**: Recursos completos para grandes imobiliárias

### 4.2 Sistema de Tokens
- Mensagens WhatsApp
- Transcrições de áudio (Whisper)
- Análises de imagem (Vision)
- Processamento de documentos
- Chamadas de API IA

### 4.3 Cobrança
- Taxa de implementação (setup inicial)
- Mensalidade por plano
- Tokens por uso excedente
- Integração com Stripe/Gerencianet (preparada)

---

## 5. Funcionalidades Implementadas

### 5.1 Autenticação Completa
- ✅ Login/registro com validação
- ✅ Sistema de convites
- ✅ Recuperação de senha
- ✅ Gestão de usuários por roles
- ✅ Middleware de proteção

### 5.2 Bots Inteligentes
- ✅ Criação de bots (Assistido/Avançado)
- ✅ Fluxos com blocos configuráveis
- ✅ Processamento IA multimodal
- ✅ Sessões de conversas ativas
- ✅ Criação automática de leads

### 5.3 CRM Avançado
- ✅ Funil Kanban visual
- ✅ Sistema de pontuação de leads
- ✅ Histórico de interações
- ✅ Mudanças de status rastreadas
- ✅ Atribuição de responsáveis

### 5.4 WhatsApp Business
- ✅ Conexão via QR Code
- ✅ Recepção de mensagens
- ✅ Processamento com IA
- ✅ Respostas automáticas
- ✅ Métricas de conversão

---

## 6. Diferenciais Estratégicos

### 6.1 Técnicos
- Arquitetura modular e escalável
- IA multimodal avançada
- Interface intuitiva e responsiva
- Sistema de roles granular
- API RESTful documentada

### 6.2 Negócio
- CRM proprietário integrado
- Bots configuráveis sem código
- Processamento IA em tempo real
- Sistema de pontuação automática
- Métricas e relatórios avançados

---

## 7. Próximas Implementações

### 7.1 API Pública (Fase 2)
- Endpoints para integrações externas
- Webhooks para eventos
- SDK JavaScript
- Documentação interativa

### 7.2 Sistema de Billing (Fase 2)
- Cobrança automatizada
- Controle de consumo
- Relatórios de uso
- Recarga de créditos

### 7.3 Funcionalidades Avançadas
- Chamadas telefônicas com IA
- Integração com portais imobiliários
- App mobile
- Analytics avançados

---

## 8. Segurança e Compliance

### 8.1 Segurança
- Row Level Security (RLS) no Supabase
- Tokens JWT seguros
- Criptografia de dados sensíveis
- Logs de auditoria

### 8.2 Compliance
- LGPD ready
- Backup automático
- Controle de acesso granular
- Políticas de retenção de dados

---

## 9. Escalabilidade

### 9.1 Horizontal
- Arquitetura stateless
- Cache distribuído (Redis)
- CDN para assets estáticos
- Load balancing

### 9.2 Vertical
- Otimização de queries
- Índices de banco otimizados
- Compressão de dados
- Lazy loading

---

## 10. Monitoramento

### 10.1 Métricas
- Performance de APIs
- Uso de recursos
- Conversão de leads
- Satisfação do usuário

### 10.2 Alertas
- Erros críticos
- Uso excessivo de recursos
- Falhas de integração
- Problemas de conectividade

---

**ImmoFlow** - Arquitetura robusta para o futuro do mercado imobiliário 🏠🚀
