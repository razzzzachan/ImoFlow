import { FastifyInstance } from 'fastify'
import { OpenAI } from 'openai'
import { supabase } from '../auth/supabase'
import { processAudio, processImage, processPDF } from './processors'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export default async function aiRoutes(fastify: FastifyInstance) {
  // Processar áudio (transcrição)
  fastify.post('/process-audio', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const data = await request.file()
      if (!data) {
        return reply.fail({ message: 'Arquivo de áudio não fornecido' }, 400)
      }

      const { leadId } = request.body as any
      const buffer = await data.toBuffer()

      // Fazer upload para Supabase Storage
      const fileName = `audio_${Date.now()}_${data.filename}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('interactions')
        .upload(fileName, buffer, {
          contentType: data.mimetype
        })

      if (uploadError) {
        return reply.fail({ message: 'Erro ao fazer upload do arquivo' }, 500)
      }

      // Transcrever áudio com Whisper
      const transcription = await processAudio(buffer, data.mimetype)

      // Analisar conteúdo com GPT
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em análise de conversas imobiliárias. 
            Analise a transcrição e extraia informações relevantes como:
            - Tipo de imóvel de interesse
            - Localização desejada
            - Orçamento mencionado
            - Urgência da compra/venda
            - Sentimento geral (interessado, apenas pesquisando, pronto para comprar)
            
            Retorne um JSON com essas informações estruturadas.`
          },
          {
            role: 'user',
            content: `Transcrição: ${transcription}`
          }
        ],
        temperature: 0.3
      })

      const aiAnalysis = analysis.choices[0]?.message?.content

      // Salvar interação no banco
      const { data: interaction, error: dbError } = await supabase
        .from('interactions')
        .insert([{
          lead_id: leadId,
          user_id: (request as any).user.id,
          type: 'audio',
          content: transcription,
          file_url: uploadData.path,
          ai_processed: true,
          ai_summary: aiAnalysis,
          metadata: {
            original_filename: data.filename,
            file_size: buffer.length,
            duration: null // Pode ser calculado se necessário
          }
        }])
        .select()
        .single()

      if (dbError) {
        return reply.fail({ message: 'Erro ao salvar no banco de dados' }, 500)
      }

      return reply.success({
        interaction,
        transcription,
        analysis: aiAnalysis
      })
    } catch (error) {
      console.error('Erro ao processar áudio:', error)
      return reply.fail({ message: 'Erro interno do servidor' }, 500)
    }
  })

  // Processar imagem
  fastify.post('/process-image', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const data = await request.file()
      if (!data) {
        return reply.fail({ message: 'Arquivo de imagem não fornecido' }, 400)
      }

      const { leadId } = request.body as any
      const buffer = await data.toBuffer()

      // Fazer upload para Supabase Storage
      const fileName = `image_${Date.now()}_${data.filename}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('interactions')
        .upload(fileName, buffer, {
          contentType: data.mimetype
        })

      if (uploadError) {
        return reply.fail({ message: 'Erro ao fazer upload do arquivo' }, 500)
      }

      // Analisar imagem com GPT-4 Vision
      const base64Image = buffer.toString('base64')
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de imagens imobiliárias. 
            Analise a imagem e extraia informações relevantes como:
            - Tipo de imóvel (casa, apartamento, terreno, comercial)
            - Características visíveis (quartos, banheiros, área externa, etc.)
            - Estado de conservação
            - Estilo arquitetônico
            - Pontos positivos e negativos
            
            Se for um documento (contrato, escritura, etc.), extraia as informações principais.
            
            Retorne um JSON estruturado com essas informações.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${data.mimetype};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const aiAnalysis = analysis.choices[0]?.message?.content

      // Salvar interação no banco
      const { data: interaction, error: dbError } = await supabase
        .from('interactions')
        .insert([{
          lead_id: leadId,
          user_id: (request as any).user.id,
          type: 'image',
          content: 'Imagem analisada por IA',
          file_url: uploadData.path,
          ai_processed: true,
          ai_summary: aiAnalysis,
          metadata: {
            original_filename: data.filename,
            file_size: buffer.length,
            image_dimensions: null // Pode ser calculado se necessário
          }
        }])
        .select()
        .single()

      if (dbError) {
        return reply.fail({ message: 'Erro ao salvar no banco de dados' }, 500)
      }

      return reply.success({
        interaction,
        analysis: aiAnalysis
      })
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      return reply.fail({ message: 'Erro interno do servidor' }, 500)
    }
  })

  // Processar PDF
  fastify.post('/process-pdf', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const data = await request.file()
      if (!data) {
        return reply.fail({ message: 'Arquivo PDF não fornecido' }, 400)
      }

      const { leadId } = request.body as any
      const buffer = await data.toBuffer()

      // Fazer upload para Supabase Storage
      const fileName = `pdf_${Date.now()}_${data.filename}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('interactions')
        .upload(fileName, buffer, {
          contentType: data.mimetype
        })

      if (uploadError) {
        return reply.fail({ message: 'Erro ao fazer upload do arquivo' }, 500)
      }

      // Extrair texto do PDF
      const extractedText = await processPDF(buffer)

      // Analisar conteúdo com GPT
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de documentos imobiliários. 
            Analise o texto extraído do PDF e identifique:
            - Tipo de documento (contrato, escritura, certidão, etc.)
            - Informações do imóvel (endereço, área, valor, etc.)
            - Partes envolvidas
            - Datas importantes
            - Cláusulas relevantes
            - Resumo executivo
            
            Retorne um JSON estruturado com essas informações.`
          },
          {
            role: 'user',
            content: `Texto extraído do PDF: ${extractedText}`
          }
        ],
        temperature: 0.3
      })

      const aiAnalysis = analysis.choices[0]?.message?.content

      // Salvar interação no banco
      const { data: interaction, error: dbError } = await supabase
        .from('interactions')
        .insert([{
          lead_id: leadId,
          user_id: (request as any).user.id,
          type: 'pdf',
          content: extractedText.substring(0, 1000) + '...', // Limitar tamanho
          file_url: uploadData.path,
          ai_processed: true,
          ai_summary: aiAnalysis,
          metadata: {
            original_filename: data.filename,
            file_size: buffer.length,
            pages: null // Pode ser calculado se necessário
          }
        }])
        .select()
        .single()

      if (dbError) {
        return reply.fail({ message: 'Erro ao salvar no banco de dados' }, 500)
      }

      return reply.success({
        interaction,
        extractedText: extractedText.substring(0, 500) + '...', // Retornar apenas uma prévia
        analysis: aiAnalysis
      })
    } catch (error) {
      console.error('Erro ao processar PDF:', error)
      return reply.fail({ message: 'Erro interno do servidor' }, 500)
    }
  })

  // Classificar lead automaticamente
  fastify.post('/classify-lead', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { message, leadId } = request.body as { message: string; leadId?: string }

    try {
      const classification = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em classificação de leads imobiliários.
            Analise a mensagem e extraia/classifique:
            
            1. Intenção (comprar, vender, alugar, investir)
            2. Tipo de imóvel (casa, apartamento, terreno, comercial)
            3. Localização mencionada
            4. Faixa de orçamento (se mencionado)
            5. Urgência (baixa, média, alta)
            6. Qualidade do lead (frio, morno, quente)
            7. Próximos passos sugeridos
            
            Retorne um JSON estruturado com essas classificações.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3
      })

      const result = classification.choices[0]?.message?.content

      // Se um leadId foi fornecido, atualizar o lead com as informações
      if (leadId && result) {
        try {
          const parsedResult = JSON.parse(result)
          
          const updateData: any = {}
          if (parsedResult.tipo_imovel) updateData.property_type = parsedResult.tipo_imovel
          if (parsedResult.localizacao) updateData.location = parsedResult.localizacao
          if (parsedResult.orcamento_min) updateData.budget_min = parsedResult.orcamento_min
          if (parsedResult.orcamento_max) updateData.budget_max = parsedResult.orcamento_max
          
          // Atualizar status baseado na qualidade do lead
          if (parsedResult.qualidade_lead === 'quente') {
            updateData.status = 'qualificado'
          } else if (parsedResult.qualidade_lead === 'morno') {
            updateData.status = 'contato_inicial'
          }

          await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
        } catch (parseError) {
          console.error('Erro ao parsear resultado da IA:', parseError)
        }
      }

      return reply.success({ classification: result })
    } catch (error) {
      console.error('Erro ao classificar lead:', error)
      return reply.fail({ message: 'Erro interno do servidor' }, 500)
    }
  })
}
