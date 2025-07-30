import { supabase } from '../auth/supabase'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

interface BotConfig {
  welcome_message?: string
  variables?: string[]
  ai_enabled?: boolean
  fallback_message?: string
  max_retries?: number
}

interface BlockConfig {
  message?: string
  options?: string[]
  variable_name?: string
  condition?: {
    variable: string
    operator: string
    value: string
  }
  ai_prompt?: string
  action_type?: string
  action_params?: any
}

export class BotService {
  async createBot(userId: string, name: string, description?: string, mode: string = 'assistido') {
    // Verificar permissões baseadas no plano do usuário
    const canCreateAdvanced = await this.checkAdvancedPermissions(userId)
    
    if (mode === 'avancado' && !canCreateAdvanced) {
      throw new Error('Modo avançado não disponível no seu plano atual')
    }

    const { data: bot, error } = await supabase
      .from('bots')
      .insert([{
        user_id: userId,
        name,
        description,
        mode,
        config: {
          welcome_message: 'Olá! Como posso ajudá-lo?',
          variables: ['nome', 'imovel_interesse', 'urgencia', 'bairro'],
          ai_enabled: true,
          fallback_message: 'Desculpe, não entendi. Pode repetir?',
          max_retries: 3
        }
      }])
      .select()
      .single()

    if (error) {
      throw new Error('Erro ao criar bot')
    }

    // Criar fluxo padrão
    await this.createDefaultFlow(bot.id)

    return bot
  }

  async createDefaultFlow(botId: string) {
    // Criar fluxo padrão
    const { data: flow, error: flowError } = await supabase
      .from('bot_flows')
      .insert([{
        bot_id: botId,
        name: 'Fluxo Principal',
        is_default: true,
        flow_data: {
          description: 'Fluxo principal de atendimento'
        }
      }])
      .select()
      .single()

    if (flowError) {
      throw new Error('Erro ao criar fluxo padrão')
    }

    // Criar blocos padrão
    const blocks = [
      {
        flow_id: flow.id,
        block_type: 'message',
        name: 'Boas-vindas',
        config: {
          message: 'Olá! Sou o assistente virtual. Como posso ajudá-lo hoje?'
        },
        position_x: 100,
        position_y: 100
      },
      {
        flow_id: flow.id,
        block_type: 'question',
        name: 'Capturar Nome',
        config: {
          message: 'Qual é o seu nome?',
          variable_name: 'nome'
        },
        position_x: 100,
        position_y: 200
      },
      {
        flow_id: flow.id,
        block_type: 'question',
        name: 'Tipo de Imóvel',
        config: {
          message: 'Que tipo de imóvel você está procurando?',
          options: ['Casa', 'Apartamento', 'Terreno', 'Comercial'],
          variable_name: 'imovel_interesse'
        },
        position_x: 100,
        position_y: 300
      },
      {
        flow_id: flow.id,
        block_type: 'ai_analysis',
        name: 'Análise IA',
        config: {
          ai_prompt: 'Analise as informações coletadas e classifique o lead como: quente, morno ou frio. Considere o tipo de imóvel e urgência.',
          variable_name: 'classificacao_lead'
        },
        position_x: 100,
        position_y: 400
      },
      {
        flow_id: flow.id,
        block_type: 'action',
        name: 'Criar Lead',
        config: {
          action_type: 'create_lead',
          action_params: {
            source: 'bot',
            status: 'novo'
          }
        },
        position_x: 100,
        position_y: 500
      }
    ]

    const { data: createdBlocks, error: blocksError } = await supabase
      .from('bot_blocks')
      .insert(blocks)
      .select()

    if (blocksError) {
      throw new Error('Erro ao criar blocos padrão')
    }

    // Criar conexões entre blocos
    const connections = []
    for (let i = 0; i < createdBlocks.length - 1; i++) {
      connections.push({
        flow_id: flow.id,
        from_block_id: createdBlocks[i].id,
        to_block_id: createdBlocks[i + 1].id
      })
    }

    await supabase
      .from('bot_connections')
      .insert(connections)

    return flow
  }

  async processMessage(botId: string, channelUserId: string, message: string, channel: string = 'whatsapp') {
    // Buscar ou criar sessão
    let session = await this.getOrCreateSession(botId, channelUserId, channel)
    
    // Registrar mensagem recebida
    await this.logMessage(session.id, null, 'inbound', 'text', message)

    // Processar mensagem baseada no bloco atual
    const response = await this.processCurrentBlock(session, message)

    // Registrar resposta
    if (response.message) {
      await this.logMessage(session.id, session.current_block_id, 'outbound', 'text', response.message)
    }

    return response
  }

  private async getOrCreateSession(botId: string, channelUserId: string, channel: string) {
    // Buscar sessão ativa
    const { data: existingSession } = await supabase
      .from('bot_sessions')
      .select('*')
      .eq('bot_id', botId)
      .eq('channel_user_id', channelUserId)
      .eq('channel', channel)
      .eq('is_active', true)
      .single()

    if (existingSession) {
      return existingSession
    }

    // Buscar primeiro bloco do fluxo padrão
    const { data: firstBlock } = await supabase
      .from('bot_blocks')
      .select('*, bot_flows!inner(*)')
      .eq('bot_flows.bot_id', botId)
      .eq('bot_flows.is_default', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    // Criar nova sessão
    const { data: session, error } = await supabase
      .from('bot_sessions')
      .insert([{
        bot_id: botId,
        channel: channel,
        channel_user_id: channelUserId,
        current_block_id: firstBlock?.id,
        variables: {}
      }])
      .select()
      .single()

    if (error) {
      throw new Error('Erro ao criar sessão')
    }

    return session
  }

  private async processCurrentBlock(session: any, message: string) {
    if (!session.current_block_id) {
      return { message: 'Erro: Bloco não encontrado' }
    }

    // Buscar bloco atual
    const { data: block } = await supabase
      .from('bot_blocks')
      .select('*')
      .eq('id', session.current_block_id)
      .single()

    if (!block) {
      return { message: 'Erro: Bloco não encontrado' }
    }

    let response = { message: '', nextBlockId: null }
    const variables = { ...session.variables }

    switch (block.block_type) {
      case 'message':
        response.message = block.config.message || 'Mensagem não configurada'
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'question':
        if (block.config.variable_name) {
          variables[block.config.variable_name] = message
          
          // Atualizar variáveis na sessão
          await supabase
            .from('bot_sessions')
            .update({ variables })
            .eq('id', session.id)
        }
        
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        
        // Se há próximo bloco, buscar sua mensagem
        if (response.nextBlockId) {
          const { data: nextBlock } = await supabase
            .from('bot_blocks')
            .select('*')
            .eq('id', response.nextBlockId)
            .single()
          
          if (nextBlock && nextBlock.config.message) {
            response.message = this.replaceVariables(nextBlock.config.message, variables)
          }
        }
        break

      case 'ai_analysis':
        const aiResult = await this.processAIBlock(block, variables, message)
        if (block.config.variable_name) {
          variables[block.config.variable_name] = aiResult
          
          await supabase
            .from('bot_sessions')
            .update({ variables })
            .eq('id', session.id)
        }
        
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'action':
        await this.processActionBlock(block, variables, session)
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'condition':
        response.nextBlockId = await this.processConditionBlock(block, variables, session.id)
        break
    }

    // Atualizar bloco atual na sessão
    if (response.nextBlockId) {
      await supabase
        .from('bot_sessions')
        .update({ current_block_id: response.nextBlockId })
        .eq('id', session.id)
    }

    return response
  }

  private async processAIBlock(block: any, variables: any, message: string) {
    const prompt = `
    ${block.config.ai_prompt}
    
    Variáveis coletadas: ${JSON.stringify(variables)}
    Última mensagem: ${message}
    
    Responda de forma concisa e estruturada.
    `

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      })

      return completion.choices[0]?.message?.content || 'Análise não disponível'
    } catch (error) {
      console.error('Erro na análise IA:', error)
      return 'Erro na análise'
    }
  }

  private async processActionBlock(block: any, variables: any, session: any) {
    switch (block.config.action_type) {
      case 'create_lead':
        await this.createLeadFromBot(variables, session, block.config.action_params)
        break
      
      case 'send_notification':
        // Implementar notificação
        break
      
      case 'transfer_human':
        // Implementar transferência para humano
        break
    }
  }

  private async createLeadFromBot(variables: any, session: any, params: any) {
    const leadData = {
      name: variables.nome || 'Lead Bot',
      phone: variables.telefone,
      whatsapp: session.channel === 'whatsapp' ? session.channel_user_id : null,
      property_type: variables.imovel_interesse?.toLowerCase(),
      location: variables.bairro,
      status: params.status || 'novo',
      source: params.source || 'bot',
      notes: `Lead criado pelo bot. Classificação: ${variables.classificacao_lead || 'N/A'}`
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (!error && lead) {
      // Associar lead à sessão
      await supabase
        .from('bot_sessions')
        .update({ lead_id: lead.id })
        .eq('id', session.id)
    }

    return lead
  }

  private async getNextBlock(currentBlockId: string, sessionId: string) {
    const { data: connection } = await supabase
      .from('bot_connections')
      .select('to_block_id')
      .eq('from_block_id', currentBlockId)
      .single()

    return connection?.to_block_id || null
  }

  private async processConditionBlock(block: any, variables: any, sessionId: string) {
    const condition = block.config.condition
    if (!condition) return null

    const variableValue = variables[condition.variable]
    let conditionMet = false

    switch (condition.operator) {
      case 'equals':
        conditionMet = variableValue === condition.value
        break
      case 'contains':
        conditionMet = variableValue?.includes(condition.value)
        break
      case 'greater_than':
        conditionMet = parseFloat(variableValue) > parseFloat(condition.value)
        break
    }

    // Buscar conexão baseada na condição
    const { data: connection } = await supabase
      .from('bot_connections')
      .select('to_block_id')
      .eq('from_block_id', block.id)
      .eq('condition_value', conditionMet ? 'true' : 'false')
      .single()

    return connection?.to_block_id || null
  }

  private replaceVariables(message: string, variables: any) {
    let result = message
    Object.keys(variables).forEach(key => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), variables[key] || '')
    })
    return result
  }

  private async logMessage(sessionId: string, blockId: string | null, direction: string, type: string, content: string) {
    await supabase
      .from('bot_messages')
      .insert([{
        session_id: sessionId,
        block_id: blockId,
        direction,
        message_type: type,
        content
      }])
  }

  private async processCurrentBlock(session: any, message: string) {
    if (!session.current_block_id) {
      return { message: 'Erro: Bloco não encontrado' }
    }

    // Buscar bloco atual
    const { data: block } = await supabase
      .from('bot_blocks')
      .select('*')
      .eq('id', session.current_block_id)
      .single()

    if (!block) {
      return { message: 'Erro: Bloco não encontrado' }
    }

    let response = { message: '', nextBlockId: null }
    const variables = { ...session.variables }

    switch (block.block_type) {
      case 'message':
        response.message = block.config.message || 'Mensagem não configurada'
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'question':
        if (block.config.variable_name) {
          variables[block.config.variable_name] = message

          // Atualizar variáveis na sessão
          await supabase
            .from('bot_sessions')
            .update({ variables })
            .eq('id', session.id)
        }

        response.nextBlockId = await this.getNextBlock(block.id, session.id)

        // Se há próximo bloco, buscar sua mensagem
        if (response.nextBlockId) {
          const { data: nextBlock } = await supabase
            .from('bot_blocks')
            .select('*')
            .eq('id', response.nextBlockId)
            .single()

          if (nextBlock && nextBlock.config.message) {
            response.message = this.replaceVariables(nextBlock.config.message, variables)
          }
        }
        break

      case 'ai_analysis':
        const aiResult = await this.processAIBlock(block, variables, message)
        if (block.config.variable_name) {
          variables[block.config.variable_name] = aiResult

          await supabase
            .from('bot_sessions')
            .update({ variables })
            .eq('id', session.id)
        }

        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'action':
        await this.processActionBlock(block, variables, session)
        response.nextBlockId = await this.getNextBlock(block.id, session.id)
        break

      case 'condition':
        response.nextBlockId = await this.processConditionBlock(block, variables, session.id)
        break
    }

    // Atualizar bloco atual na sessão
    if (response.nextBlockId) {
      await supabase
        .from('bot_sessions')
        .update({ current_block_id: response.nextBlockId })
        .eq('id', session.id)
    }

    return response
  }

  private async processAIBlock(block: any, variables: any, message: string) {
    const prompt = `
    ${block.config.ai_prompt}

    Variáveis coletadas: ${JSON.stringify(variables)}
    Última mensagem: ${message}

    Responda de forma concisa e estruturada.
    `

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      })

      return completion.choices[0]?.message?.content || 'Análise não disponível'
    } catch (error) {
      console.error('Erro na análise IA:', error)
      return 'Erro na análise'
    }
  }

  private async processActionBlock(block: any, variables: any, session: any) {
    switch (block.config.action_type) {
      case 'create_lead':
        await this.createLeadFromBot(variables, session, block.config.action_params)
        break

      case 'send_notification':
        // Implementar notificação
        break

      case 'transfer_human':
        // Implementar transferência para humano
        break
    }
  }

  private async createLeadFromBot(variables: any, session: any, params: any) {
    const leadData = {
      name: variables.nome || 'Lead Bot',
      phone: variables.telefone,
      whatsapp: session.channel === 'whatsapp' ? session.channel_user_id : null,
      property_type: variables.imovel_interesse?.toLowerCase(),
      location: variables.bairro,
      status: params.status || 'novo',
      source: params.source || 'bot',
      notes: `Lead criado pelo bot. Classificação: ${variables.classificacao_lead || 'N/A'}`
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (!error && lead) {
      // Associar lead à sessão
      await supabase
        .from('bot_sessions')
        .update({ lead_id: lead.id })
        .eq('id', session.id)
    }

    return lead
  }

  private async getNextBlock(currentBlockId: string, sessionId: string) {
    const { data: connection } = await supabase
      .from('bot_connections')
      .select('to_block_id')
      .eq('from_block_id', currentBlockId)
      .single()

    return connection?.to_block_id || null
  }

  private async processConditionBlock(block: any, variables: any, sessionId: string) {
    const condition = block.config.condition
    if (!condition) return null

    const variableValue = variables[condition.variable]
    let conditionMet = false

    switch (condition.operator) {
      case 'equals':
        conditionMet = variableValue === condition.value
        break
      case 'contains':
        conditionMet = variableValue?.includes(condition.value)
        break
      case 'greater_than':
        conditionMet = parseFloat(variableValue) > parseFloat(condition.value)
        break
    }

    // Buscar conexão baseada na condição
    const { data: connection } = await supabase
      .from('bot_connections')
      .select('to_block_id')
      .eq('from_block_id', block.id)
      .eq('condition_value', conditionMet ? 'true' : 'false')
      .single()

    return connection?.to_block_id || null
  }

  private replaceVariables(message: string, variables: any) {
    let result = message
    Object.keys(variables).forEach(key => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), variables[key] || '')
    })
    return result
  }

  private async checkAdvancedPermissions(userId: string) {
    // Implementar verificação de plano
    // Por enquanto, retornar true
    return true
  }
}
