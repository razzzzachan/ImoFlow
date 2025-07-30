@echo off
setlocal enabledelayedexpansion

REM =====================================================
REM IMMOFLOW - SCRIPT DE INSTALAÇÃO PARA WINDOWS
REM =====================================================

echo 🚀 Iniciando setup do ImmoFlow...
echo.

REM Verificar se Node.js está instalado
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js não encontrado. Instale Node.js 18+ antes de continuar.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do set NODE_MAJOR=%%a
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 18 (
    echo [ERROR] Node.js versão 18+ é necessária. Versão atual: 
    node --version
    pause
    exit /b 1
)

echo [SUCCESS] Node.js encontrado: 
node --version

REM Verificar se npm está instalado
echo [INFO] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm não encontrado. Instale npm antes de continuar.
    pause
    exit /b 1
)

echo [SUCCESS] npm encontrado: 
npm --version

REM Instalar dependências
echo [INFO] Instalando dependências...
npm install
if errorlevel 1 (
    echo [ERROR] Falha ao instalar dependências
    pause
    exit /b 1
)
echo [SUCCESS] Dependências instaladas com sucesso

REM Configurar variáveis de ambiente
echo [INFO] Configurando variáveis de ambiente...

if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [SUCCESS] Arquivo .env criado a partir do .env.example
        echo [WARNING] IMPORTANTE: Configure suas credenciais no arquivo .env
    ) else (
        echo [ERROR] Arquivo .env.example não encontrado
        pause
        exit /b 1
    )
) else (
    echo [WARNING] Arquivo .env já existe, pulando...
)

REM Configurar .env para o frontend
if not exist apps\web\.env (
    (
        echo VITE_SUPABASE_URL=your_supabase_project_url
        echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        echo VITE_API_URL=http://localhost:3001
    ) > apps\web\.env
    echo [SUCCESS] Arquivo apps\web\.env criado
    echo [WARNING] IMPORTANTE: Configure as variáveis do frontend em apps\web\.env
) else (
    echo [WARNING] Arquivo apps\web\.env já existe, pulando...
)

REM Verificar configuração do Supabase
echo [INFO] Verificando configuração do Supabase...
findstr /C:"your_supabase" .env >nul
if not errorlevel 1 (
    echo [WARNING] Variáveis do Supabase não configuradas no .env
    echo [WARNING] Configure SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
    set SUPABASE_OK=0
) else (
    echo [SUCCESS] Configuração do Supabase parece estar OK
    set SUPABASE_OK=1
)

findstr /C:"your_supabase" apps\web\.env >nul
if not errorlevel 1 (
    echo [WARNING] Variáveis do Supabase não configuradas no apps\web\.env
    echo [WARNING] Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
    set SUPABASE_OK=0
)

REM Verificar configuração do OpenAI
echo [INFO] Verificando configuração do OpenAI...
findstr /C:"your_openai" .env >nul
if not errorlevel 1 (
    echo [WARNING] Chave da OpenAI não configurada no .env
    echo [WARNING] Configure OPENAI_API_KEY para usar funcionalidades de IA
    set OPENAI_OK=0
) else (
    echo [SUCCESS] Configuração da OpenAI parece estar OK
    set OPENAI_OK=1
)

REM Mostrar status final
echo.
echo 📊 Status da Configuração:
echo ==========================
if !SUPABASE_OK!==1 (
    echo [SUCCESS] Supabase: Configurado
) else (
    echo [WARNING] Supabase: Necessita configuração
)

if !OPENAI_OK!==1 (
    echo [SUCCESS] OpenAI: Configurado
) else (
    echo [WARNING] OpenAI: Necessita configuração
)

REM Próximos passos
echo.
echo 🎉 Setup básico concluído!
echo.
echo 📋 Próximos passos:
echo.
echo 1. 🔧 Configure o Supabase:
echo    - Execute os scripts SQL em supabase\setup-complete.sql
echo    - Execute supabase\setup-triggers-rls.sql
echo    - Execute supabase\setup-initial-data.sql
echo    - Crie os buckets de storage (interactions, avatars, documents)
echo.
echo 2. 🔑 Configure as credenciais:
echo    - Edite o arquivo .env com suas credenciais do Supabase
echo    - Edite o arquivo apps\web\.env com as variáveis do frontend
echo    - Configure sua chave da OpenAI no .env
echo.
echo 3. 🚀 Execute o sistema:
echo    npm run dev
echo.
echo 4. 📖 Leia a documentação:
echo    - README.md - Instruções gerais
echo    - arquitetura.md - Arquitetura do sistema
echo    - supabase\SETUP-INSTRUCTIONS.md - Setup detalhado do Supabase
echo.
echo 🌐 URLs após executar:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:3001
echo.

echo 🏠 ImmoFlow - Plataforma SaaS para Imobiliárias
echo Desenvolvido com ❤️ por Julio + Augment AI
echo.

pause
