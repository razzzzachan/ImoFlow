import axios from 'axios'
import { supabase } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirecionar para login
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Tipos
export interface Lead {
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
  assigned_user?: {
    name: string
    email: string
    avatar_url?: string
  }
  interactions?: Interaction[]
  tasks?: Task[]
}

export interface Interaction {
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
  user?: {
    name: string
    avatar_url?: string
  }
}

export interface Task {
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
  lead?: {
    name: string
    phone?: string
  }
  assigned_user?: {
    name: string
    email: string
  }
}

export interface Stats {
  leads: {
    total: number
    byStatus: Record<string, number>
  }
  tasks: {
    pending: number
  }
  interactions: {
    today: number
  }
}

// API Functions
export const leadApi = {
  // Listar leads
  list: async (params?: {
    status?: string
    assigned_to?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/api/crm/leads', { params })
    return response.data
  },

  // Obter lead específico
  get: async (id: string) => {
    const response = await api.get(`/api/crm/leads/${id}`)
    return response.data
  },

  // Criar lead
  create: async (data: Partial<Lead>) => {
    const response = await api.post('/api/crm/leads', data)
    return response.data
  },

  // Atualizar lead
  update: async (id: string, data: Partial<Lead>) => {
    const response = await api.put(`/api/crm/leads/${id}`, data)
    return response.data
  },

  // Listar interações do lead
  getInteractions: async (id: string) => {
    const response = await api.get(`/api/crm/leads/${id}/interactions`)
    return response.data
  },

  // Criar interação
  createInteraction: async (id: string, data: Partial<Interaction>) => {
    const response = await api.post(`/api/crm/leads/${id}/interactions`, data)
    return response.data
  }
}

export const taskApi = {
  // Listar tarefas
  list: async (params?: {
    assigned_to?: string
    completed?: boolean
    lead_id?: string
  }) => {
    const response = await api.get('/api/crm/tasks', { params })
    return response.data
  },

  // Criar tarefa
  create: async (data: Partial<Task>) => {
    const response = await api.post('/api/crm/tasks', data)
    return response.data
  },

  // Atualizar tarefa
  update: async (id: string, data: Partial<Task>) => {
    const response = await api.put(`/api/crm/tasks/${id}`, data)
    return response.data
  }
}

export const statsApi = {
  // Obter estatísticas
  get: async (): Promise<Stats> => {
    const response = await api.get('/api/crm/stats')
    return response.data
  }
}

export const aiApi = {
  // Processar áudio
  processAudio: async (file: File, leadId: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('leadId', leadId)
    
    const response = await api.post('/api/ai/process-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Processar imagem
  processImage: async (file: File, leadId: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('leadId', leadId)
    
    const response = await api.post('/api/ai/process-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Processar PDF
  processPDF: async (file: File, leadId: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('leadId', leadId)
    
    const response = await api.post('/api/ai/process-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Classificar lead
  classifyLead: async (message: string, leadId?: string) => {
    const response = await api.post('/api/ai/classify-lead', {
      message,
      leadId
    })
    return response.data
  }
}

export const whatsappApi = {
  // Inicializar WhatsApp
  initialize: async () => {
    const response = await api.post('/api/whatsapp/initialize')
    return response.data
  },

  // Obter status
  getStatus: async () => {
    const response = await api.get('/api/whatsapp/status')
    return response.data
  },

  // Desconectar
  disconnect: async () => {
    const response = await api.post('/api/whatsapp/disconnect')
    return response.data
  },

  // Enviar mensagem
  sendMessage: async (phone: string, message: string, leadId?: string) => {
    const response = await api.post('/api/whatsapp/send-message', {
      phone,
      message,
      leadId
    })
    return response.data
  },

  // Obter métricas
  getMetrics: async () => {
    const response = await api.get('/api/whatsapp/metrics')
    return response.data
  },

  // Configurar resposta automática
  setAutoResponse: async (config: {
    enabled: boolean
    message: string
    keywords?: string[]
  }) => {
    const response = await api.post('/api/whatsapp/auto-response', config)
    return response.data
  }
}

export default api
