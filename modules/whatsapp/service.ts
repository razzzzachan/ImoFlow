import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import * as qrcode from 'qrcode'
import { supabase } from '../auth/supabase'
import { extractStructuredInfo, generateAutoResponse, analyzeSentiment } from '../ai/processors'

interface AutoResponseConfig {
  enabled: boolean
  message: string
  keywords: string[]
}

export class WhatsAppService {
  private clients: Map<string, Client> = new Map()
  private autoResponseConfigs: Map<string, AutoResponseConfig> = new Map()

  async initialize(userId: string): Promise<string> {
    try {
      // Verificar se já existe um cliente para este usuário
      if (this.clients.has(userId)) {
        await this.disconnect(userId)
      }

      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: userId,
          dataPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-sessions'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        }
      })

      this.clients.set(userId, client)

      return new Promise((resolve, reject) => {
        let qrCodeGenerated = false

        client.on('qr', async (qr) => {
          try {
            const qrCodeDataURL = await qrcode.toDataURL(qr)
            
            // Salvar QR code no banco
            await supabase
              .from('whatsapp_config')
              .upsert([{
                user_id: userId,
                qr_code: qrCodeDataURL,
                is_connected: false
              }])

            if (!qrCodeGenerated) {
              qrCodeGenerated = true
              resolve(qrCodeDataURL)
            }
          } catch (error) {
            reject(error)
          }
        })

        client.on('ready', async () => {
          console.log(`WhatsApp conectado para usuário ${userId}`)
          
          // Atualizar status no banco
          await supabase
            .from('whatsapp_config')
            .upsert([{
              user_id: userId,
              is_connected: true,
              qr_code: null
            }])

          // Configurar handlers de mensagem
          this.setupMessageHandlers(client, userId)
        })

        client.on('auth_failure', (msg) => {
          console.error('Falha na autenticação:', msg)
          reject(new Error('Falha na autenticação'))
        })

        client.on('disconnected', async (reason) => {
          console.log(`WhatsApp desconectado para usuário ${userId}:`, reason)
          
          await supabase
            .from('whatsapp_config')
            .upsert([{
              user_id: userId,
              is_connected: false
            }])

          this.clients.delete(userId)
        })

        client.initialize()

        // Timeout para QR code
        setTimeout(() => {
          if (!qrCodeGenerated) {
            reject(new Error('Timeout ao gerar QR code'))
          }
        }, 30000)
      })
    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error)
      throw error
    }
  }

  private setupMessageHandlers(client: Client, userId: string) {
    client.on('message', async (message: Message) => {
      try {
        await this.processIncomingMessage(message, userId)
      } catch (error) {
        console.error('Erro ao processar mensagem:', error)
      }
    })
  }

  async processIncomingMessage(message: any, userId?: string) {
    try {
      const phone = message.from || message.author
      const content = message.body || message.text?.body
      const messageType = message.type || 'text'

      if (!content && messageType === 'text') return

      // Buscar ou criar lead
      let lead = await this.findOrCreateLead(phone, content)

      // Registrar interação
      const interaction = await supabase
        .from('interactions')
        .insert([{
          lead_id: lead.id,
          user_id: userId,
          type: messageType,
          content: content,
          metadata: {
            direction: 'inbound',
            phone: phone,
            whatsapp_message_id: message.id
          }
        }])
        .select()
        .single()

      // Processar com IA se for texto
      if (messageType === 'text' && content) {
        // Extrair informações estruturadas
        const structuredInfo = await extractStructuredInfo(content)
        
        // Atualizar lead com novas informações
        if (Object.keys(structuredInfo).length > 0) {
          await supabase
            .from('leads')
            .update(structuredInfo)
            .eq('id', lead.id)
        }

        // Analisar sentimento
        const sentiment = await analyzeSentiment(content)
        
        // Atualizar interação com análise de IA
        await supabase
          .from('interactions')
          .update({
            ai_processed: true,
            ai_summary: JSON.stringify({
              structured_info: structuredInfo,
              sentiment: sentiment
            })
          })
          .eq('id', interaction.data.id)

        // Verificar se deve enviar resposta automática
        await this.checkAutoResponse(phone, content, lead, userId)
      }

      // Processar outros tipos de mídia
      if (messageType === 'image' || messageType === 'audio' || messageType === 'document') {
        // Aqui você pode implementar o download e processamento de mídia
        // Por enquanto, apenas registramos que foi recebido
        console.log(`Mídia recebida: ${messageType} de ${phone}`)
      }

    } catch (error) {
      console.error('Erro ao processar mensagem recebida:', error)
    }
  }

  private async findOrCreateLead(phone: string, firstMessage: string) {
    // Buscar lead existente
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .or(`phone.eq.${phone},whatsapp.eq.${phone}`)
      .single()

    if (existingLead) {
      return existingLead
    }

    // Extrair informações do primeiro contato
    const structuredInfo = await extractStructuredInfo(firstMessage)

    // Criar novo lead
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([{
        name: structuredInfo.name || 'Lead WhatsApp',
        phone: structuredInfo.phone || phone,
        whatsapp: phone,
        email: structuredInfo.email,
        property_type: structuredInfo.propertyType,
        location: structuredInfo.location,
        budget_min: structuredInfo.budgetMin,
        budget_max: structuredInfo.budgetMax,
        status: 'novo',
        source: 'whatsapp'
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return newLead
  }

  private async checkAutoResponse(phone: string, message: string, lead: any, userId?: string) {
    if (!userId) return

    const config = this.autoResponseConfigs.get(userId)
    if (!config || !config.enabled) return

    // Verificar se alguma palavra-chave foi mencionada
    const shouldRespond = config.keywords.length === 0 || 
      config.keywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      )

    if (shouldRespond) {
      // Gerar resposta personalizada ou usar a configurada
      let responseMessage = config.message

      if (config.message.includes('{{auto}}')) {
        // Gerar resposta automática com IA
        const autoResponse = await generateAutoResponse(message, lead)
        responseMessage = responseMessage.replace('{{auto}}', autoResponse)
      }

      // Enviar resposta
      await this.sendMessage(phone, responseMessage)

      // Registrar como interação
      await supabase
        .from('interactions')
        .insert([{
          lead_id: lead.id,
          user_id: userId,
          type: 'text',
          content: responseMessage,
          metadata: {
            direction: 'outbound',
            phone: phone,
            auto_response: true
          }
        }])
    }
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    try {
      // Encontrar cliente conectado (simplificado - em produção, você precisa saber qual cliente usar)
      const client = Array.from(this.clients.values()).find(c => c.info?.wid)
      
      if (!client) {
        throw new Error('Nenhum cliente WhatsApp conectado')
      }

      // Formatar número de telefone
      const formattedPhone = phone.includes('@') ? phone : `${phone}@c.us`
      
      await client.sendMessage(formattedPhone, message)
      return true
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return false
    }
  }

  async getConnectionStatus(userId: string): Promise<{
    connected: boolean
    qrCode?: string
  }> {
    const { data } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('user_id', userId)
      .single()

    return {
      connected: data?.is_connected || false,
      qrCode: data?.qr_code
    }
  }

  async disconnect(userId: string): Promise<void> {
    const client = this.clients.get(userId)
    if (client) {
      await client.destroy()
      this.clients.delete(userId)
    }

    await supabase
      .from('whatsapp_config')
      .upsert([{
        user_id: userId,
        is_connected: false,
        qr_code: null
      }])
  }

  async setAutoResponse(userId: string, config: AutoResponseConfig): Promise<void> {
    this.autoResponseConfigs.set(userId, config)
    
    // Salvar configuração no banco se necessário
    await supabase
      .from('whatsapp_config')
      .upsert([{
        user_id: userId,
        session_data: {
          auto_response: config
        }
      }])
  }

  async getRecentConversations(): Promise<any[]> {
    // Implementar lógica para obter conversas recentes
    // Por enquanto, retornar dados do banco
    const { data } = await supabase
      .from('interactions')
      .select(`
        *,
        lead:leads(name, phone, whatsapp)
      `)
      .eq('type', 'text')
      .order('created_at', { ascending: false })
      .limit(50)

    return data || []
  }
}
