# ImmoFlow API Documentation

## Autenticação

Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer <token>
```

## Endpoints

### Autenticação (`/api/auth`)

#### POST `/api/auth/login`
Fazer login no sistema.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

#### POST `/api/auth/register`
Registrar novo usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nome do Usuário"
}
```

#### POST `/api/auth/logout`
Fazer logout (requer autenticação).

#### GET `/api/auth/profile`
Obter perfil do usuário (requer autenticação).

### CRM (`/api/crm`)

#### GET `/api/crm/leads`
Listar leads.

**Query Parameters:**
- `status` (opcional): Filtrar por status
- `assigned_to` (opcional): Filtrar por responsável
- `page` (opcional): Página (padrão: 1)
- `limit` (opcional): Limite por página (padrão: 20)

**Response:**
```json
{
  "leads": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### POST `/api/crm/leads`
Criar novo lead.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "property_type": "apartamento",
  "location": "São Paulo - SP",
  "budget_min": 300000,
  "budget_max": 500000
}
```

#### GET `/api/crm/leads/:id`
Obter lead específico.

#### PUT `/api/crm/leads/:id`
Atualizar lead.

#### GET `/api/crm/leads/:id/interactions`
Listar interações do lead.

#### POST `/api/crm/leads/:id/interactions`
Criar nova interação.

#### GET `/api/crm/tasks`
Listar tarefas.

**Query Parameters:**
- `assigned_to` (opcional): Filtrar por responsável
- `completed` (opcional): Filtrar por status de conclusão
- `lead_id` (opcional): Filtrar por lead

#### POST `/api/crm/tasks`
Criar nova tarefa.

#### PUT `/api/crm/tasks/:id`
Atualizar tarefa.

#### GET `/api/crm/stats`
Obter estatísticas do dashboard.

### IA (`/api/ai`)

#### POST `/api/ai/process-audio`
Processar arquivo de áudio.

**Body:** FormData
- `file`: Arquivo de áudio
- `leadId`: ID do lead

**Response:**
```json
{
  "interaction": { ... },
  "transcription": "Texto transcrito",
  "analysis": "Análise da IA"
}
```

#### POST `/api/ai/process-image`
Processar arquivo de imagem.

**Body:** FormData
- `file`: Arquivo de imagem
- `leadId`: ID do lead

#### POST `/api/ai/process-pdf`
Processar arquivo PDF.

**Body:** FormData
- `file`: Arquivo PDF
- `leadId`: ID do lead

#### POST `/api/ai/classify-lead`
Classificar lead automaticamente.

**Body:**
```json
{
  "message": "Mensagem do lead",
  "leadId": "uuid-do-lead"
}
```

### WhatsApp (`/api/whatsapp`)

#### POST `/api/whatsapp/initialize`
Inicializar conexão WhatsApp.

**Response:**
```json
{
  "qrCode": "data:image/png;base64,...",
  "message": "WhatsApp inicializado. Escaneie o QR Code."
}
```

#### GET `/api/whatsapp/status`
Obter status da conexão.

**Response:**
```json
{
  "status": {
    "connected": true,
    "qrCode": null
  }
}
```

#### POST `/api/whatsapp/disconnect`
Desconectar WhatsApp.

#### POST `/api/whatsapp/send-message`
Enviar mensagem.

**Body:**
```json
{
  "phone": "5511999999999",
  "message": "Olá! Como posso ajudar?",
  "leadId": "uuid-do-lead"
}
```

#### GET `/api/whatsapp/metrics`
Obter métricas do WhatsApp.

**Response:**
```json
{
  "messages": {
    "inbound": 45,
    "outbound": 32,
    "total": 77
  },
  "leads": {
    "total": 23,
    "thisWeek": 8
  }
}
```

#### POST `/api/whatsapp/auto-response`
Configurar resposta automática.

**Body:**
```json
{
  "enabled": true,
  "message": "Obrigado pelo contato!",
  "keywords": ["oi", "olá", "bom dia"]
}
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro na requisição
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Tipos de Dados

### Lead
```typescript
interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  property_type?: string
  location?: string
  budget_min?: number
  budget_max?: number
  status: string
  source: string
  assigned_to?: string
  tags?: string[]
  notes?: string
  created_at: string
  updated_at: string
}
```

### Interaction
```typescript
interface Interaction {
  id: string
  lead_id: string
  user_id?: string
  type: 'text' | 'audio' | 'image' | 'pdf' | 'call' | 'email' | 'meeting'
  content?: string
  metadata?: any
  file_url?: string
  ai_processed: boolean
  ai_summary?: string
  created_at: string
}
```

### Task
```typescript
interface Task {
  id: string
  lead_id: string
  assigned_to: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}
```
