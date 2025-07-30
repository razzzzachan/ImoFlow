import { OpenAI } from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import pdfParse from 'pdf-parse'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// Processar áudio com Whisper
export async function processAudio(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    // Criar arquivo temporário
    const tempDir = os.tmpdir()
    const tempFileName = `audio_${Date.now()}.${getFileExtension(mimeType)}`
    const tempFilePath = path.join(tempDir, tempFileName)
    
    // Escrever buffer para arquivo temporário
    fs.writeFileSync(tempFilePath, buffer)
    
    // Transcrever com Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: 'pt'
    })
    
    // Limpar arquivo temporário
    fs.unlinkSync(tempFilePath)
    
    return transcription.text
  } catch (error) {
    console.error('Erro ao processar áudio:', error)
    throw new Error('Falha ao transcrever áudio')
  }
}

// Processar imagem (placeholder - a análise real é feita na rota)
export async function processImage(buffer: Buffer, mimeType: string): Promise<string> {
  // Esta função pode ser expandida para pré-processamento de imagem se necessário
  return 'Imagem processada'
}

// Processar PDF
export async function processPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('Erro ao processar PDF:', error)
    throw new Error('Falha ao extrair texto do PDF')
  }
}

// Função auxiliar para obter extensão do arquivo baseada no MIME type
function getFileExtension(mimeType: string): string {
  const mimeToExt: { [key: string]: string } = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'application/pdf': 'pdf'
  }
  
  return mimeToExt[mimeType] || 'bin'
}

// Função para analisar sentimento de texto
export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  keywords: string[]
}> {
  try {
    const analysis = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analise o sentimento do texto fornecido e retorne um JSON com:
          - sentiment: "positive", "negative" ou "neutral"
          - confidence: número entre 0 e 1 indicando a confiança
          - keywords: array com palavras-chave relevantes
          
          Foque em contexto imobiliário (interesse em comprar, vender, urgência, satisfação, etc.)`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3
    })

    const result = analysis.choices[0]?.message?.content
    if (result) {
      try {
        return JSON.parse(result)
      } catch {
        // Fallback se não conseguir parsear
        return {
          sentiment: 'neutral',
          confidence: 0.5,
          keywords: []
        }
      }
    }

    return {
      sentiment: 'neutral',
      confidence: 0.5,
      keywords: []
    }
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error)
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      keywords: []
    }
  }
}

// Função para extrair informações estruturadas de texto livre
export async function extractStructuredInfo(text: string): Promise<{
  name?: string
  phone?: string
  email?: string
  propertyType?: string
  location?: string
  budgetMin?: number
  budgetMax?: number
  urgency?: 'low' | 'medium' | 'high'
}> {
  try {
    const extraction = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Extraia informações estruturadas do texto fornecido e retorne um JSON com:
          - name: nome da pessoa (se mencionado)
          - phone: telefone (se mencionado)
          - email: email (se mencionado)
          - propertyType: tipo de imóvel (casa, apartamento, terreno, comercial)
          - location: localização desejada
          - budgetMin: orçamento mínimo em reais
          - budgetMax: orçamento máximo em reais
          - urgency: urgência (low, medium, high)
          
          Retorne apenas os campos que conseguir identificar com confiança.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3
    })

    const result = extraction.choices[0]?.message?.content
    if (result) {
      try {
        return JSON.parse(result)
      } catch {
        return {}
      }
    }

    return {}
  } catch (error) {
    console.error('Erro ao extrair informações:', error)
    return {}
  }
}

// Função para gerar resposta automática
export async function generateAutoResponse(
  leadMessage: string,
  leadContext?: any
): Promise<string> {
  try {
    const contextInfo = leadContext ? `
    Contexto do lead:
    - Nome: ${leadContext.name || 'Não informado'}
    - Tipo de imóvel: ${leadContext.property_type || 'Não especificado'}
    - Localização: ${leadContext.location || 'Não especificada'}
    - Orçamento: ${leadContext.budget_min && leadContext.budget_max 
        ? `R$ ${leadContext.budget_min} - R$ ${leadContext.budget_max}`
        : 'Não informado'}
    ` : ''

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente virtual especializado em atendimento imobiliário.
          Gere uma resposta profissional, amigável e útil para a mensagem do cliente.
          
          Diretrizes:
          - Seja cordial e profissional
          - Faça perguntas relevantes para qualificar melhor o lead
          - Ofereça ajuda específica baseada no contexto
          - Mantenha o tom conversacional mas informativo
          - Limite a resposta a 2-3 parágrafos
          
          ${contextInfo}`
        },
        {
          role: 'user',
          content: leadMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    return response.choices[0]?.message?.content || 'Obrigado pelo seu contato! Em breve um de nossos consultores entrará em contato.'
  } catch (error) {
    console.error('Erro ao gerar resposta automática:', error)
    return 'Obrigado pelo seu contato! Em breve um de nossos consultores entrará em contato.'
  }
}
