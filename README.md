# ImmoFlow - Plataforma SaaS para Imobiliárias

Bem-vindo ao ImmoFlow: uma solução SaaS modular e escalável para digitalização completa de processos imobiliários. O sistema é voltado para corretores, imobiliárias e redes que desejam automatizar:

- Atendimento via WhatsApp, voz e OCR
- - Organização de leads e clientes
  - - Funil de vendas com IA estilo SDR
    - - CRM proprietário ou integração com CRMs externos via API
     
      - ---

      ## 🎯 Objetivo deste projeto

      Criar um sistema inteligente, com arquitetura moderna e API pública plug-and-play, que permita aos clientes configurar seus próprios bots de atendimento e funis comerciais.

      ---

      ## 🚀 Funcionalidades Implementadas

      ### 🔐 Sistema de Autenticação Completo
      - Login/registro com validação
      - - Sistema de convites para novos usuários
        - - Recuperação de senha com tokens seguros
          - - Gestão de usuários por roles (admin, gestor, corretor, atendente)
            - - Middleware de proteção por tipo de usuário
             
              - ### 🤖 Bots Inteligentes com IA
              - - **Modo Assistido**: Templates prontos para uso rápido
                - - **Modo Avançado**: Edição completa de fluxos personalizados
                  - - Blocos configuráveis: mensagem, pergunta, condição, ação, análise IA
                    - - Processamento multimodal (texto, áudio, imagem)
                      - - Criação automática de leads no CRM
                        - - Sessões de conversas ativas
                          - - Integração com OpenAI GPT-4 e Whisper
                           
                            - ### 📊 CRM Avançado
                            - - **Funil Visual Kanban**: Captado → Em Atendimento → Visita Marcada → Proposta → Negociação → Fechado/Perdido
                              - - Sistema de pontuação automática de leads (Lead Score)
                                - - Histórico completo de mudanças de status
                                  - - Interações multimodais (texto, áudio, imagem, PDF, chamadas)
                                    - - Sistema de tarefas e follow-ups
                                      - - Atribuição automática e manual de leads
                                        - - Operações em lote para produtividade
                                          - - Página de detalhes completa para cada lead
                                           
                                            - ### 📱 WhatsApp Business Integrado
                                            - - Conexão via QR Code com WhatsApp Web.js
                                              - - Recepção automática de mensagens
                                                - - Processamento inteligente com IA
                                                  - - Respostas automáticas configuráveis
                                                    - - Métricas de mensagens e conversões
                                                      - - Integração direta com bots e CRM
                                                       
                                                        - ### 📈 Dashboard e Relatórios
                                                        - - Métricas em tempo real de leads, tarefas e interações
                                                          - - Gráficos de conversão por status
                                                            - - Atividades recentes do sistema
                                                              - - Estatísticas de performance dos bots
                                                                - - Relatórios de uso e produtividade
                                                                 
                                                                  - ---

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
                                                                  2. 2. ✅ Criar estrutura base do backend (Fastify + TypeScript)
                                                                     3. 3. ✅ Definir tipagem global de entidades (User, Lead, Bot, Interaction)
                                                                        4. 4. ✅ Implementar modelo do banco de dados com Supabase
                                                                           5. 5. ✅ Preparar endpoints REST para:
                                                                              6.    - ✅ Autenticação e gestão de usuários
                                                                                    -    - ✅ Criação e gestão de bots
                                                                                         -    - ✅ Cadastro e gestão de leads
                                                                                              -    - ✅ Processamento IA multimodal
                                                                                                   -    - ✅ Integração WhatsApp
                                                                                                        - 6. ✅ Criar estrutura para os assistentes de IA
                                                                                                          7. 7. ✅ Implementar integração com WhatsApp
                                                                                                             8. 8. ✅ Criar dashboard com login e visualização completa
                                                                                                                9. 9. ✅ Criar painel de configuração de bots funcional
                                                                                                                  
                                                                                                                   10. ---
                                                                                                                  
                                                                                                                   11. ## 📦 Como usar este repositório
                                                                                                                  
                                                                                                                   12. ### Pré-requisitos
                                                                                                                   13. - Node.js 18+
                                                                                                                       - - npm 9+
                                                                                                                         - - Conta Supabase
                                                                                                                           - - Chave API OpenAI
                                                                                                                            
                                                                                                                             - ### 🚀 Setup Automatizado
                                                                                                                            
                                                                                                                             - ```bash
                                                                                                                               # Clone o repositório
                                                                                                                               git clone https://github.com/razzzzachan/ImoFlow.git
                                                                                                                               cd ImoFlow

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
                                                                                                                               - - ✅ Criação e configuração de bots
                                                                                                                                 - - ✅ Gestão de leads no CRM
                                                                                                                                   - - ✅ Processamento IA multimodal
                                                                                                                                     - - ✅ Integração WhatsApp (opcional)
                                                                                                                                      
                                                                                                                                       - ### Configuração das Variáveis de Ambiente
                                                                                                                                       - Edite o arquivo `.env` com suas credenciais:
                                                                                                                                       - ```env
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
                                                                                                                                         
                                                                                                                                         ---
                                                                                                                                         
                                                                                                                                         ## 🛠️ Tecnologias
                                                                                                                                         
                                                                                                                                         ### Frontend
                                                                                                                                         - **React 18** com TypeScript
                                                                                                                                         - - **Tailwind CSS** + Shadcn/ui
                                                                                                                                           - - **Vite** para build
                                                                                                                                             - - **React Router** para navegação
                                                                                                                                              
                                                                                                                                               - ### Backend
                                                                                                                                               - - **Fastify** com TypeScript
                                                                                                                                                 - - **Supabase** (PostgreSQL + Auth + Storage)
                                                                                                                                                   - - **OpenAI** (GPT-4, Whisper, Vision)
                                                                                                                                                     - - **WhatsApp Web.js**
                                                                                                                                                      
                                                                                                                                                       - ### Banco de Dados
                                                                                                                                                       - - **PostgreSQL** via Supabase
                                                                                                                                                         - - **Row Level Security (RLS)**
                                                                                                                                                           - - **Real-time subscriptions**
                                                                                                                                                             - - **Storage para arquivos**
                                                                                                                                                              
                                                                                                                                                               - ---
                                                                                                                                                               
                                                                                                                                                               ## 📌 Notas importantes
                                                                                                                                                               
                                                                                                                                                               - ✅ **Sistema 100% Funcional**: Todos os módulos principais implementados
                                                                                                                                                               - - ✅ **Arquitetura Moderna**: React + Fastify + Supabase + OpenAI
                                                                                                                                                                 - - ✅ **IA Multimodal**: Processamento de texto, áudio, imagem e PDF
                                                                                                                                                                   - - ✅ **CRM Proprietário**: Funil visual, leads, interações e histórico
                                                                                                                                                                     - - ✅ **Bots Configuráveis**: Modo assistido e avançado com IA
                                                                                                                                                                       - - 🔄 **Sistema de Billing**: Estrutura preparada para implementação
                                                                                                                                                                         - - 📋 **API Pública**: Planejada para integrações plug & play
                                                                                                                                                                          
                                                                                                                                                                           - ---
                                                                                                                                                                           
                                                                                                                                                                           ## 🚀 Próximos Passos
                                                                                                                                                                           
                                                                                                                                                                           1. **Finalizar Billing**: Interface de planos e cobrança automatizada
                                                                                                                                                                           2. 2. **API Pública**: Endpoints para integrações externas
                                                                                                                                                                              3. 3. **Funcionalidades Avançadas**: Chamadas telefônicas, app mobile
                                                                                                                                                                                 4. 4. **Integrações**: CRMs externos, portais imobiliários
                                                                                                                                                                                   
                                                                                                                                                                                    5. ---
                                                                                                                                                                                   
                                                                                                                                                                                    6. Para detalhes técnicos, leia `arquitetura.md`. Para roadmap completo, veja `roadmap.augment.md`.
                                                                                                                                                                                   
                                                                                                                                                                                    7. ---
                                                                                                                                                                                   
                                                                                                                                                                                    8. **Desenvolvido com ❤️ por Julio + Augment AI (engenharia assistida)**
                                                                                                                                                                                   
                                                                                                                                                                                    9. **ImmoFlow** - Revolucionando o mercado imobiliário com IA 🏠🤖
