@echo off
setlocal enabledelayedexpansion

REM =====================================================
REM IMMOFLOW - SETUP DO GIT PARA WINDOWS
REM =====================================================

echo 🔧 Configurando Git para o ImmoFlow...
echo.

REM Verificar se Git está instalado
echo [INFO] Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git não encontrado. Instale Git antes de continuar.
    pause
    exit /b 1
)

echo [SUCCESS] Git encontrado
git --version

REM Verificar se já é um repositório Git
if exist .git (
    echo [WARNING] Já é um repositório Git
    
    REM Verificar se tem remote origin
    git remote get-url origin >nul 2>&1
    if not errorlevel 1 (
        echo [INFO] Remote origin configurado:
        git remote get-url origin
        set NEED_SETUP=0
    ) else (
        echo [WARNING] Repositório local sem remote origin
        set NEED_SETUP=1
    )
) else (
    echo [INFO] Inicializando novo repositório Git
    set NEED_SETUP=1
)

if !NEED_SETUP!==1 (
    REM Inicializar repositório Git se necessário
    if not exist .git (
        git init
        echo [SUCCESS] Repositório Git inicializado
    )
    
    REM Criar .gitignore se não existir
    if not exist .gitignore (
        (
            echo # Dependencies
            echo node_modules/
            echo npm-debug.log*
            echo yarn-debug.log*
            echo yarn-error.log*
            echo.
            echo # Environment variables
            echo .env
            echo .env.local
            echo .env.development.local
            echo .env.test.local
            echo .env.production.local
            echo.
            echo # Build outputs
            echo dist/
            echo build/
            echo .next/
            echo out/
            echo.
            echo # IDE
            echo .vscode/
            echo .idea/
            echo *.swp
            echo *.swo
            echo.
            echo # OS
            echo .DS_Store
            echo Thumbs.db
            echo.
            echo # Logs
            echo logs/
            echo *.log
            echo.
            echo # Runtime data
            echo pids/
            echo *.pid
            echo *.seed
            echo *.pid.lock
            echo.
            echo # Coverage directory used by tools like istanbul
            echo coverage/
            echo.
            echo # Dependency directories
            echo jspm_packages/
            echo.
            echo # Optional npm cache directory
            echo .npm
            echo.
            echo # Optional REPL history
            echo .node_repl_history
            echo.
            echo # Output of 'npm pack'
            echo *.tgz
            echo.
            echo # Yarn Integrity file
            echo .yarn-integrity
            echo.
            echo # WhatsApp sessions
            echo whatsapp-sessions/
            echo .wwebjs_auth/
            echo .wwebjs_cache/
            echo.
            echo # Supabase
            echo .supabase/
            echo.
            echo # Temporary files
            echo tmp/
            echo temp/
        ) > .gitignore
        echo [SUCCESS] .gitignore criado
    )
    
    REM Adicionar arquivos ao Git
    echo [INFO] Adicionando arquivos ao Git...
    git add .
    echo [SUCCESS] Arquivos adicionados ao staging
    
    REM Fazer commit inicial se não existir
    git rev-parse --verify HEAD >nul 2>&1
    if errorlevel 1 (
        echo [INFO] Fazendo commit inicial...
        git commit -m "🎉 Initial commit: ImmoFlow SaaS Platform

✨ Features implemented:
- 🔐 Complete authentication system with roles
- 🤖 Intelligent bots with multimodal AI
- 📊 Advanced CRM with visual funnel
- 📱 WhatsApp Business integration
- 🎨 Modern React frontend with Tailwind
- 🚀 Fastify backend with TypeScript
- 🗄️ Supabase database with RLS
- 💰 Billing system structure
- 📖 Complete documentation

🏗️ Architecture:
- Monorepo with workspaces
- TypeScript throughout
- OpenAI GPT-4 + Whisper + Vision
- Row Level Security
- Automated setup scripts

🎯 Ready for production deployment!"
        echo [SUCCESS] Commit inicial realizado
    ) else (
        echo [WARNING] Já existe commit inicial
    )
)

REM Mostrar instruções para GitHub
echo.
echo 🐙 Próximos passos para GitHub:
echo ==============================
echo.
echo 1. 🌐 Crie um repositório no GitHub:
echo    - Acesse: https://github.com/new
echo    - Nome: ImmoFlow
echo    - Descrição: 🏠 Plataforma SaaS completa para imobiliárias com IA multimodal
echo    - Público ou Privado (sua escolha)
echo    - NÃO inicialize com README (já temos)
echo.
echo 2. 🔗 Conecte o repositório local:
echo    git remote add origin https://github.com/SEU_USUARIO/ImmoFlow.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. 🏷️ Crie uma tag de versão:
echo    git tag -a v1.0.0 -m "🎉 ImmoFlow v1.0.0 - MVP Complete"
echo    git push origin v1.0.0
echo.
echo 4. 📋 Configure o repositório:
echo    - Adicione topics: saas, imobiliaria, ai, crm, whatsapp, react, typescript
echo    - Configure branch protection rules
echo    - Adicione colaboradores se necessário
echo.

REM Mostrar status do repositório
echo 📊 Status do repositório:
echo ========================
if exist .git (
    echo [SUCCESS] Repositório Git: Inicializado
    
    git remote get-url origin >nul 2>&1
    if not errorlevel 1 (
        echo [SUCCESS] Remote origin:
        git remote get-url origin
    ) else (
        echo [WARNING] Remote origin: Não configurado
    )
    
    for /f %%i in ('git rev-list --count HEAD 2^>nul') do set COMMIT_COUNT=%%i
    if not defined COMMIT_COUNT set COMMIT_COUNT=0
    echo [INFO] Commits: !COMMIT_COUNT!
    
    for /f %%i in ('git branch --show-current 2^>nul') do set BRANCH=%%i
    if not defined BRANCH set BRANCH=main
    echo [INFO] Branch atual: !BRANCH!
) else (
    echo [ERROR] Repositório Git: Não inicializado
)

echo.
echo [SUCCESS] Setup do Git concluído!
echo.

pause
