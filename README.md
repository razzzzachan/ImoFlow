
# ImmoFlow - O Sistema Definitivo para Imobiliárias

> **"O sistema definitivo para imobiliárias e corretores independentes que querem vender mais com menos esforço, automatizando todo o atendimento e gestão com Inteligência Artificial nativa."**

ImmoFlow é uma **plataforma SaaS plug-and-play** que automatiza atendimento, vendas e gestão de processos imobiliários usando **IA especializada no setor imobiliário**.

## 🧠 Diferenciais Únicos

- 🤖 **IA especializada em imóveis** (não generalista) - entende bairro, valor, tipo, financiamento
- 📱 **Integração nativa WhatsApp** sem APIs externas
- 🎯 **Atendimento automatizado** com inteligência de vendas
- 🔌 **API aberta** para integrações plug-and-play
- 📊 **Dados centralizados** com robotização imobiliária
- ⚡ **Setup plug-and-play** ou assistido

---

## 🎯 Posicionamento Estratégico

**Não somos "mais um CRM" ou "chatbot para WhatsApp".**

Somos uma **"plataforma plug-and-play com IA especializada no setor imobiliário"** que oferece:
- **Atendimento automatizado**
- **Inteligência de vendas**
- **Robotização imobiliária**
- **API aberta**
- **Dados centralizados**

## 🧪 MVP Estratégico (Fase 1)

### 🎯 Funcionalidades Essenciais do MVP

#### 🤖 Bot de WhatsApp Inteligente
- ✅ Captura automática de leads
- ✅ IA especializada em contexto imobiliário
- ✅ Qualificação inteligente de interessados
- ✅ Encaminhamento automático para corretores

#### 📊 Mini-CRM Interno
- ✅ Gestão de leads com histórico completo
- ✅ Sistema de etiquetas e categorização
- ✅ Funil visual de vendas
- ✅ Operações em lote

#### ⚙️ Automações Básicas
- ✅ Lembretes automáticos
- ✅ Follow-ups inteligentes
- ✅ Agendamento de visitas
- ✅ Notificações em tempo real

#### 🔌 API Aberta
- ✅ Integração com sites e portais
- ✅ Webhooks para ERPs externos
- ✅ Endpoints REST documentados
- ✅ Sistema de autenticação por tokens

#### 🧠 IA de Respostas Rápidas
- ✅ FAQ inteligente sobre imóveis
- ✅ Processamento de linguagem natural
- ✅ Contexto imobiliário especializado
- ✅ Aprendizado contínuo

### 💰 Modelo de Monetização MVP

- **💵 Taxa de Implementação**: R$ 297 (setup inicial)
- **📅 Plano Mensal**: R$ 97/mês (até X leads)
- **🎯 Créditos Adicionais**: Mensagens, IA, OCR, chamadas

---

## 🚀 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação Completo
- Login/registro com validação
- Sistema de convites para novos usuários
- Recuperação de senha com tokens seguros
- Gestão de usuários por roles (admin, gestor, corretor, atendente)
- Middleware de proteção por tipo de usuário

### 🤖 Bots Inteligentes com IA
- **Modo Assistido**: Templates prontos para uso rápido
- **Modo Avançado**: Edição completa de fluxos personalizados
- Blocos configuráveis: mensagem, pergunta, condição, ação, análise IA
- Processamento multimodal (texto, áudio, imagem)
- Criação automática de leads no CRM
- Sessões de conversas ativas
- Integração com OpenAI GPT-4 e Whisper

### 📊 CRM Avançado
- **Funil Visual Kanban**: Captado → Em Atendimento → Visita Marcada → Proposta → Negociação → Fechado/Perdido
- Sistema de pontuação automática de leads (Lead Score)
- Histórico completo de mudanças de status
- Interações multimodais (texto, áudio, imagem, PDF, chamadas)
- Sistema de tarefas e follow-ups
- Atribuição automática e manual de leads
- Operações em lote para produtividade
- Página de detalhes completa para cada lead

### 📱 WhatsApp Business Integrado
- Conexão via QR Code com WhatsApp Web.js
- Recepção automática de mensagens
- Processamento inteligente com IA
- Respostas automáticas configuráveis
- Métricas de mensagens e conversões
- Integração direta com bots e CRM

### 📈 Dashboard e Relatórios
- Métricas em tempo real de leads, tarefas e interações
- Gráficos de conversão por status
- Atividades recentes do sistema
- Estatísticas de performance dos bots
- Relatórios de uso e produtividade

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** + Shadcn/ui para interface
- **React Query** para gerenciamento de estado
- **React Router** para navegação

### Backend
- **Fastify** como framework web
- **TypeScript** para tipagem
- Arquitetura modular e escalável

### Banco de Dados
- **Supabase** (PostgreSQL)
- Row Level Security (RLS)
- Storage para arquivos de mídia
- Autenticação integrada

### IA e Integrações
- **OpenAI** (GPT-4, Whisper, GPT-4 Vision)
- **LangChain** para processamento de documentos
- **WhatsApp Web.js** para integração WhatsApp

## 📂 Estrutura do Projeto

```
/immo-saas/
├── arquitetura.md          # Arquitetura geral do sistema
├── roadmap.augment.md      # Roadmap de desenvolvimento
├── README.md               # Você está aqui 😄
├── apps/
│   ├── web/               # Frontend React com TypeScript
│   └── api/               # Backend Fastify com TypeScript
├── modules/
│   ├── auth/              # Sistema de autenticação
│   ├── bots/              # Bots IA configuráveis
│   ├── crm/               # CRM e gestão de leads
│   ├── ai/                # Processamento IA multimodal
│   └── whatsapp/          # Integração WhatsApp
├── supabase/
│   └── schema.sql         # Schema do banco de dados
├── augment-modules/       # Arquivos .augment.md
├── docs/                  # Documentação e análises
└── package.json           # Configuração do monorepo
```

---

## ✅ Tarefas Prioritárias (Augment)

1. ✅ Criar estrutura base do frontend (React + TypeScript + Tailwind)
2. ✅ Criar estrutura base do backend (Fastify + TypeScript)
3. ✅ Definir tipagem global de entidades (User, Lead, Bot, Interaction)
4. ✅ Implementar modelo do banco de dados com Supabase
5. ✅ Preparar endpoints REST para:
   - ✅ Autenticação e gestão de usuários
   - ✅ Criação e gestão de bots
   - ✅ Cadastro e gestão de leads
   - ✅ Processamento IA multimodal
   - ✅ Integração WhatsApp
6. ✅ Criar estrutura para os assistentes de IA
7. ✅ Implementar integração com WhatsApp
8. ✅ Criar dashboard com login e visualização completa
9. ✅ Criar painel de configuração de bots funcional

---

## 📦 Como usar este repositório

### Pré-requisitos
- Node.js 18+
- npm 9+
- Conta Supabase
- Chave API OpenAI

### 🚀 Setup Automatizado

```bash
# Clone o repositório
git clone <seu-repositorio>
cd ImmoFlow

# Execute o setup automatizado
npm run setup          # Linux/Mac
npm run setup:windows  # Windows

# Configure suas credenciais nos arquivos .env
# Execute o sistema
npm run dev
```

### 📋 Setup Manual (Alternativo)

#### 1. Configure o Supabase
```bash
# 1. Crie um projeto no Supabase
# 2. Execute os scripts SQL em ordem:
#    - supabase/setup-complete.sql
#    - supabase/setup-triggers-rls.sql
#    - supabase/setup-initial-data.sql
# 3. Crie os buckets de storage
# 4. Configure as variáveis de ambiente
```

#### 2. Instale e Execute
```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Configure suas credenciais no .env

# Execute o sistema
npm run dev
```

### 3. Teste o Sistema
- ✅ Autenticação e gestão de usuários
- ✅ Criação e configuração de bots
- ✅ Gestão de leads no CRM
- ✅ Processamento IA multimodal
- ✅ Integração WhatsApp (opcional)

### Configuração das Variáveis de Ambiente
Edite o arquivo `.env` com suas credenciais:
```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# JWT
JWT_SECRET=your_jwt_secret_key

# Frontend
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

## 📋 Configuração do Supabase

### Tabelas Principais
- `users` - Usuários do sistema
- `leads` - Leads e oportunidades
- `interactions` - Histórico de interações
- `tasks` - Tarefas e follow-ups
- `whatsapp_config` - Configurações WhatsApp

### Storage Buckets
Crie um bucket chamado `interactions` para armazenar arquivos de mídia.

### RLS (Row Level Security)
As políticas RLS estão configuradas para garantir que usuários só acessem seus próprios dados.

## 🤖 Configuração da IA

### OpenAI
- GPT-4 para análise de texto e classificação
- Whisper para transcrição de áudio
- GPT-4 Vision para análise de imagens

### Funcionalidades IA
- Classificação automática de leads
- Extração de informações estruturadas
- Análise de sentimento
- Geração de respostas automáticas
- Processamento multimodal

## 📱 Configuração WhatsApp

### WhatsApp Web.js
O sistema usa WhatsApp Web.js para integração. Para usar:

1. Execute o sistema
2. Acesse a página WhatsApp
3. Clique em "Conectar WhatsApp"
4. Escaneie o QR Code com seu celular
5. Configure respostas automáticas

### Recursos WhatsApp
- Recepção de mensagens texto, áudio e imagem
- Envio de mensagens automáticas
- Criação automática de leads
- Histórico completo de conversas

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build --workspace=apps/web
```

### Backend (Railway/Heroku)
```bash
npm run build --workspace=apps/api
npm run start --workspace=apps/api
```

### Variáveis de Ambiente
Configure todas as variáveis de ambiente no seu provedor de deploy.

## 📊 Uso do Sistema

### 1. Dashboard
- Visão geral de leads, tarefas e interações
- Métricas de conversão e performance
- Atividades recentes

### 2. CRM
- Funil visual Kanban
- Gestão de leads por status
- Histórico completo de interações
- Sistema de tarefas

### 3. WhatsApp
- Status da conexão
- Métricas de mensagens
- Configuração de respostas automáticas
- Histórico de conversas

### 4. Configurações
- Perfil do usuário
- Preferências de notificação
- Configurações de IA
- Integrações

## 🔧 Desenvolvimento

### Estrutura Modular
Cada módulo é independente e pode ser desenvolvido separadamente:

```bash
# Desenvolver módulo específico
cd modules/crm
npm run dev

# Adicionar nova funcionalidade
cd modules/ai
# Implementar nova feature
```

### Testes
```bash
# Executar testes
npm test

# Testes específicos
npm test --workspace=apps/api
npm test --workspace=apps/web
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação
- Entre em contato com a equipe

---

## 📌 Notas importantes

- ✅ **Sistema 100% Funcional**: Todos os módulos principais implementados
- ✅ **Arquitetura Moderna**: React + Fastify + Supabase + OpenAI
- ✅ **IA Multimodal**: Processamento de texto, áudio, imagem e PDF
- ✅ **CRM Proprietário**: Funil visual, leads, interações e histórico
- ✅ **Bots Configuráveis**: Modo assistido e avançado com IA
- 🔄 **Sistema de Billing**: Estrutura preparada para implementação
- 📋 **API Pública**: Planejada para integrações plug & play

---

## 🚀 Próximos Passos

1. **Finalizar Billing**: Interface de planos e cobrança automatizada
2. **API Pública**: Endpoints para integrações externas
3. **Funcionalidades Avançadas**: Chamadas telefônicas, app mobile
4. **Integrações**: CRMs externos, portais imobiliários

---

Para detalhes técnicos, leia `arquitetura.md`. Para roadmap completo, veja `roadmap.augment.md`.

---

**Desenvolvido com ❤️ por Julio + Augment AI (engenharia assistida)**

**ImmoFlow** - Revolucionando o mercado imobiliário com IA 🏠🤖

## 🔧 Stack Tecnológica
- Frontend: React + Tailwind (via Shadcn)
- Backend: Node.js + Fastify ou tRPC
- Banco de dados: Supabase (PostgreSQL)
- IA: OpenAI (GPT-4o, Whisper), LangChain
- Armazenamento: Supabase Storage

## 📦 Estrutura do Projeto
```
/apps
  /web                → Frontend React
  /api                → Backend Fastify ou tRPC
/modules
  /auth               → Login, permissões
  /crm                → CRM imobiliário (funil de vendas)
  /whatsapp           → Atendimento IA via WhatsApp
  /ai                 → Processamento de áudio, imagem, PDF
  /dashboard          → Painel de controle e métricas
  /integrations       → Integrações externas (RD, OLX, etc)
```

## 🚀 Como usar com Augment
- Abra este projeto no VS Code com Augment ativado
- Navegue até a pasta `augment-modules/`
- Execute os arquivos `.augment.md` conforme necessário
