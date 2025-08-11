# 📘 Documentação de Rotas – ImmoFlow

**✅ IMPLEMENTAÇÃO COMPLETA - TODAS AS INTERFACES FUNCIONAIS**
**Baseado na Arquitetura de Informação Oficial**

## 🎉 **STATUS: 100% IMPLEMENTADO E FUNCIONAL**

- ✅ **Todas as rotas** implementadas conforme arquitetura
- ✅ **Navegação completa** entre seções funcionando
- ✅ **Interfaces específicas** para cada funcionalidade
- ✅ **Dados realistas** para demonstração
- ✅ **Design profissional** e responsivo

## 🏗️ **HIERARQUIA DE ROTAS IMPLEMENTADA**

```
Landing Page (/)
└── Login (/login) → redireciona para Dashboard
    └── Dashboard (/dashboard)
        ├── Planos (/dashboard/planos)
        │   └── Fazer upsell (/dashboard/planos/upsell)
        ├── IA Personalizada (/dashboard/ia-personalizada)
        │   ├── Canais (/dashboard/ia-personalizada/canais)
        │   │   ├── WhatsApp (/dashboard/ia-personalizada/canais/whatsapp)
        │   │   │   ├── Habilitar / sincronizar (/dashboard/ia-personalizada/canais/whatsapp/habilitar)
        │   │   │   ├── Configurar WhatsApp (/dashboard/ia-personalizada/canais/whatsapp/configurar)
        │   │   │   └── Conectar número (/dashboard/ia-personalizada/canais/whatsapp/conectar)
        │   │   ├── Instagram (/dashboard/ia-personalizada/canais/instagram)
        │   │   └── Telegram (Desativado) (/dashboard/ia-personalizada/canais/telegram)
        │   ├── Automação (/dashboard/ia-personalizada/automacao)
        │   │   └── Fluxos e respostas (/dashboard/ia-personalizada/automacao/fluxos)
        │   ├── Atendimento por voz (/dashboard/ia-personalizada/atendimento-voz)
        │   └── Treinamento (/dashboard/ia-personalizada/treinamento)
        ├── Gestão de Leads (/dashboard/gestao-leads)
        ├── Relatórios (/dashboard/relatorios)
        ├── Configurações (/dashboard/configuracoes)
        │   ├── Integrações (/dashboard/configuracoes/integracoes)
        │   └── Equipe (/dashboard/configuracoes/equipe)
        └── Ajuda (/dashboard/ajuda)
    └── Recuperar Senha (/recuperar-senha)
```

## 🎨 **INTERFACES IMPLEMENTADAS**

### **📊 Dashboard Principal** (`/dashboard`)
**Componente**: `ConfigDashboard.tsx`
- ✅ Status cards (WhatsApp, IA, Automações, CRM)
- ✅ Configurações por seção
- ✅ Ações rápidas com navegação
- ✅ Layout sidebar completo

### **🤖 IA Personalizada** (`/dashboard/ia-personalizada`)
**Componente**: `IAPersonalizada.tsx`
- ✅ Status da IA (GPT-4 Ativo)
- ✅ Canais de atendimento (WhatsApp, Instagram, Telegram)
- ✅ Automação inteligente (12 fluxos ativos)
- ✅ Atendimento por voz (estatísticas detalhadas)
- ✅ Treinamento da IA (85% conhecimento)

### **💬 WhatsApp Config** (`/dashboard/ia-personalizada/canais/whatsapp`)
**Componente**: `WhatsAppConfig.tsx`
- ✅ Status de conexão em tempo real
- ✅ Habilitar/Sincronizar com QR Code
- ✅ Configurar mensagens automáticas
- ✅ Conectar número com verificação
- ✅ Estatísticas de uso (2.847 mensagens)
- ✅ Configurações avançadas (webhook, API)

### **🏢 Gestão de Leads** (`/dashboard/gestao-leads`)
**Componente**: `GestaoLeads.tsx`
- ✅ Dashboard CRM completo (127 leads ativos)
- ✅ Funil de vendas visual (6 estágios)
- ✅ Lista de leads detalhada com scores
- ✅ Performance da equipe (4 corretores)
- ✅ Métricas de conversão (23.5%)

### **💰 Planos** (`/dashboard/planos`)
**Componente**: `Planos.tsx`
- ✅ Status do plano atual (Essencial R$ 29)
- ✅ 4 planos com preços e recursos
- ✅ Billing mensal/anual
- ✅ Uso atual vs limites
- ✅ Informações de cobrança
- ✅ Recomendações de upgrade

### **📈 Relatórios** (`/dashboard/relatorios`)
**Componente**: `Relatorios.tsx`
- ✅ KPIs principais (1.247 leads, 23.5% conversão)
- ✅ Leads por fonte (WhatsApp 45.5%)
- ✅ Performance por corretor (ranking)
- ✅ Funil de conversão detalhado
- ✅ Analytics WhatsApp (2.847 mensagens)
- ✅ Performance da IA (87.3% sucesso)
- ✅ Opções de export (PDF, Excel, Email)

---

## 🔵 **PRODUTO 1 – ATENDIMENTO COM IA (BOT)**

**Especializado em**: Automação de atendimento por voz e texto, com personalização e agendamentos simples.

### 🧭 **Rotas Principais**

#### **GET /bot/dashboard**
**Descrição**: Painel com indicadores do atendimento automatizado

**Retorna**:
- Total de mensagens enviadas
- Número de automações ativas  
- Taxa de conversão básica (ex: interação > clique)
- Canais ativos (WhatsApp, voz, etc.)

**Exemplo de resposta**:
```json
{
  "mensagens_enviadas": 1247,
  "automacoes_ativas": 8,
  "taxa_conversao": 23.5,
  "canais_ativos": ["whatsapp", "voz"],
  "plano_atual": "personalizavel"
}
```

#### **GET /bot/automacoes**
**Descrição**: Lista todas as automações ativas do atendimento

**Retorna**: Nome, status, quantidade de execuções

**Exemplo de resposta**:
```json
{
  "automacoes": [
    {
      "id": "1",
      "nome": "Resposta Automática WhatsApp",
      "status": "ativa",
      "execucoes": 47,
      "tipo": "resposta_automatica"
    },
    {
      "id": "2", 
      "nome": "Follow-up 24h",
      "status": "ativa",
      "execucoes": 23,
      "tipo": "follow_up"
    }
  ]
}
```

#### **POST /bot/automacoes**
**Descrição**: Cria uma nova automação (resposta, follow-up, etc)

**Body esperado**:
```json
{
  "tipo": "resposta_automatica",
  "gatilho": "nova_mensagem",
  "canal": "whatsapp",
  "mensagem": "Olá! Posso te ajudar com X?"
}
```

#### **GET /bot/painel-personalizacao**
**Descrição**: Configurações do atendimento por plano

**Restrições por plano**:
- **Essencial**: leitura apenas
- **Personalizável**: leitura + edição

**Exemplo de resposta**:
```json
{
  "canal_voz": true,
  "canal_texto": true,
  "horario_funcionamento": ["08:00", "18:00"],
  "mensagem_boas_vindas": "Olá! Como posso ajudar?",
  "permissoes": {
    "editar": true,
    "adicionar_canais": true
  }
}
```

#### **PATCH /bot/painel-personalizacao**
**Descrição**: Ativa/desativa canais, horários, mensagens

**Body exemplo**:
```json
{
  "canal_voz": true,
  "canal_texto": false,
  "horario_funcionamento": ["08:00", "18:00"]
}
```

#### **GET /bot/leads-entrada**
**Descrição**: Lista leads capturados pelo bot (entrada no funil)

**Observação**: Sem gestão ativa dos leads aqui (isso é função do CRM)

**Exemplo de resposta**:
```json
{
  "leads_capturados": [
    {
      "id": "lead_001",
      "nome": "João Silva",
      "telefone": "(11) 99999-1111",
      "canal_origem": "whatsapp",
      "data_captura": "2025-01-30T10:00:00Z",
      "status": "capturado"
    }
  ],
  "total": 127,
  "cta_upgrade": {
    "mostrar": true,
    "mensagem": "Quer gerenciar esses leads? Conheça nosso CRM!"
  }
}
```

#### **POST /bot/upgrade-para-crm**
**Descrição**: Gatilho de upsell para o Produto 2 (CRM)

**Ação esperada**: Redirecionar usuário para o módulo de CRM

---

## 🟦 **PRODUTO 2 – CRM IMOBILIÁRIO**

**Especializado em**: Gestão de leads, análise de funil, agendamento de visitas e controle multi-imobiliária.

### 🧭 **Rotas Principais**

#### **GET /crm/dashboard**
**Descrição**: Painel com indicadores gerenciais de leads

**Retorna**:
- Total de leads
- Taxa de conversão por período
- Performance por corretor/imobiliária

**Exemplo de resposta**:
```json
{
  "total_leads": 127,
  "taxa_conversao": 23.5,
  "leads_por_status": {
    "captado": 45,
    "em_atendimento": 32,
    "visita_marcada": 28,
    "proposta": 15,
    "fechado": 7
  },
  "performance_corretores": [
    {
      "nome": "Maria Silva",
      "leads_ativos": 15,
      "conversao": 28.5
    }
  ]
}
```

#### **GET /crm/leads**
**Descrição**: Lista leads detalhadamente com status e origem

**Filtros**: corretor, estágio do funil, data, campanha

**Query params**:
- `corretor_id` (opcional)
- `status` (opcional)
- `data_inicio` (opcional)
- `data_fim` (opcional)

#### **POST /crm/lead**
**Descrição**: Criação manual de lead (via corretor ou importação)

**Body esperado**:
```json
{
  "nome": "Pedro Costa",
  "telefone": "(11) 99999-3333",
  "email": "pedro@email.com",
  "interesse": "compra",
  "tipo_imovel": "apartamento",
  "orcamento": "500k-800k",
  "corretor_responsavel": "maria_silva"
}
```

#### **PATCH /crm/lead/:id**
**Descrição**: Atualiza status do lead (ex: contato feito, visita agendada)

**Body exemplo**:
```json
{
  "status": "visita_marcada",
  "observacoes": "Visita agendada para sábado 14h",
  "data_visita": "2025-02-01T14:00:00Z"
}
```

#### **GET /crm/funil**
**Descrição**: Visualização do funil de vendas

**Exemplo de resposta**:
```json
{
  "funil": [
    {
      "estagio": "captado",
      "quantidade": 45,
      "percentual": 35.4
    },
    {
      "estagio": "em_atendimento", 
      "quantidade": 32,
      "percentual": 25.2
    },
    {
      "estagio": "visita_marcada",
      "quantidade": 28,
      "percentual": 22.0
    }
  ]
}
```

#### **GET /crm/imobiliarias**
**Descrição**: Disponível apenas no plano Rede

**Retorna**: Lista de imobiliárias conectadas ao usuário

**Restrição**: Apenas plano "Rede"

#### **GET /crm/configuracoes**
**Descrição**: Retorna configurações do CRM

**Diferenciação por plano**:
- **Gestão**: CRM + equipe conectada
- **Rede**: múltiplas imobiliárias + API avançada

#### **POST /crm/upgrade-rede**
**Descrição**: Gatilho para upsell do plano de rede

---

## 🔄 **GATILHOS ENTRE PRODUTOS**

### **Do Produto 1 para Produto 2**
- **Trigger**: Usuário no plano "Personalizável" com muitos leads capturados
- **CTA**: "Quer gerenciar esses leads profissionalmente? Conheça nosso CRM!"
- **Rota**: `POST /bot/upgrade-para-crm`

### **Dentro do Produto 2**
- **Trigger**: Usuário no plano "Gestão" com múltiplas unidades
- **CTA**: "Gerencie várias imobiliárias em um só lugar!"
- **Rota**: `POST /crm/upgrade-rede`

---

## 📊 **PLANOS POR PRODUTO**

### 🔵 **Produto 1 - Bot**
- **Essencial** (R$ 29): Atendimento simples por canal único
- **Personalizável** (R$ 149): Controle de canais, agendamento, painel próprio

### 🟦 **Produto 2 - CRM**  
- **Gestão** (R$ 600): Equipe conectada com CRM
- **Rede** (R$ 1.200): Multi-imobiliárias com painel centralizado

---

## 🎯 **REGRAS DE NEGÓCIO**

1. **Produtos independentes**: Usuário pode contratar apenas um ou ambos
2. **Upgrade natural**: Bot → CRM (quando leads aumentam)
3. **Dados compartilhados**: Leads capturados no Bot aparecem no CRM
4. **Restrições claras**: Funcionalidades bloqueadas por plano
5. **CTAs estratégicos**: Upsell no momento certo

---

**📌 Documentação atualizada em: 30/01/2025**
