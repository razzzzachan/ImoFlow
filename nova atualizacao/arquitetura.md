# arquitetura.md

## Estrutura Técnica
- /frontend: React (Tailwind, shadcn, Zustand)
- /backend: Fastify (Node.js, OpenAPI, Swagger)
- /database: Supabase (PostgreSQL + Edge Functions)
- /ai: Módulos OpenAI (Chat + Function Calling + Embeddings)

## Comunicação
- Front comunica via REST com o backend
- Backend faz chamadas à IA e Supabase
- Supabase armazena leads, usuários, imóveis, agendamentos
