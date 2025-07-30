# Módulo IA Multimodal

## Objetivo
Processar entradas em áudio, imagem e PDF para extrair dados relevantes e alimentar o CRM.

## Funcionalidades
- Transcrever áudios com Whisper
- Ler imagens (contratos, imóveis) com GPT-4o Vision
- Resumir PDFs com LangChain
- Salvar dados em "interactions" e associar a um lead

## Estrutura sugerida
- Backend: /modules/ai
- Dependências: OpenAI, LangChain, Supabase