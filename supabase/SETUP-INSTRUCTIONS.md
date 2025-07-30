# 🚀 ImmoFlow - Instruções de Setup do Supabase

## 📋 Pré-requisitos
- Projeto Supabase criado
- Acesso ao SQL Editor do Supabase
- Permissões de administrador no projeto

## 🔧 Passo a Passo

### 1. Execute os Scripts SQL na Ordem

#### **Passo 1: Setup Completo**
```sql
-- Copie e cole o conteúdo de: supabase/setup-complete.sql
-- Este script cria todas as tabelas principais
```

#### **Passo 2: Triggers e RLS**
```sql
-- Copie e cole o conteúdo de: supabase/setup-triggers-rls.sql
-- Este script configura triggers, índices e Row Level Security
```

#### **Passo 3: Dados Iniciais**
```sql
-- Copie e cole o conteúdo de: supabase/setup-initial-data.sql
-- Este script insere planos e configurações iniciais
```

### 2. Configurar Storage Buckets

No **Supabase Dashboard > Storage**, crie os seguintes buckets:

1. **interactions** (privado)
   - Para arquivos de interações (áudio, imagem, PDF)
   
2. **avatars** (público)
   - Para fotos de perfil dos usuários
   
3. **documents** (privado)
   - Para documentos gerais do sistema

### 3. Configurar Políticas de Storage

Execute no SQL Editor:

```sql
-- Políticas para interactions
CREATE POLICY "Authenticated users can upload interaction files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'interactions' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can view interaction files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'interactions' AND
    auth.role() = 'authenticated'
  );

-- Políticas para avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Políticas para documents
CREATE POLICY "Authenticated users can manage documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );
```

### 4. Configurar Autenticação

No **Supabase Dashboard > Authentication > Settings**:

1. **Email Templates**: Personalize os templates de email
2. **URL Configuration**: Configure as URLs de redirecionamento
3. **Auth Providers**: Configure provedores se necessário

### 5. Obter Credenciais

No **Supabase Dashboard > Settings > API**:

1. **Project URL**: `https://your-project.supabase.co`
2. **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (mantenha seguro!)

## 🔐 Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend (.env no apps/web/)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001
```

## ✅ Verificação

Execute no SQL Editor para verificar se tudo foi criado:

```sql
-- Verificar tabelas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;

-- Verificar planos
SELECT * FROM public.plans;

-- Verificar buckets
SELECT * FROM storage.buckets;
```

## 🚀 Executar o Sistema

Após configurar tudo:

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

## 🔧 Troubleshooting

### Erro: "relation does not exist"
- Verifique se todos os scripts SQL foram executados na ordem correta
- Confirme se as extensões foram criadas

### Erro: "RLS policy violation"
- Verifique se as políticas RLS foram criadas
- Confirme se o usuário está autenticado

### Erro: "Storage bucket not found"
- Crie os buckets manualmente no Dashboard
- Configure as políticas de storage

### Erro: "JWT secret not configured"
- Configure a variável JWT_SECRET no .env
- Reinicie o servidor

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do Supabase Dashboard
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste a conexão com o banco via SQL Editor

---

**🎉 Parabéns! Seu ImmoFlow está pronto para uso!**
