#!/bin/bash

# =====================================================
# IMMOFLOW - SETUP DO GIT E GITHUB
# =====================================================

echo "🔧 Configurando Git para o ImmoFlow..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Git está instalado
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git não encontrado. Instale Git antes de continuar."
        exit 1
    fi
    
    print_success "Git $(git --version) encontrado"
}

# Verificar se já é um repositório Git
check_existing_repo() {
    if [ -d ".git" ]; then
        print_warning "Já é um repositório Git"
        
        # Verificar se tem remote origin
        if git remote get-url origin &> /dev/null; then
            ORIGIN_URL=$(git remote get-url origin)
            print_status "Remote origin: $ORIGIN_URL"
            return 1
        else
            print_warning "Repositório local sem remote origin"
            return 0
        fi
    else
        print_status "Inicializando novo repositório Git"
        return 0
    fi
}

# Inicializar repositório Git
init_git() {
    if [ ! -d ".git" ]; then
        git init
        print_success "Repositório Git inicializado"
    fi
    
    # Configurar .gitignore se não existir
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# WhatsApp sessions
whatsapp-sessions/
.wwebjs_auth/
.wwebjs_cache/

# Supabase
.supabase/

# Temporary files
tmp/
temp/
EOF
        print_success ".gitignore criado"
    fi
}

# Adicionar arquivos ao Git
add_files() {
    print_status "Adicionando arquivos ao Git..."
    
    git add .
    
    if git diff --cached --quiet; then
        print_warning "Nenhum arquivo novo para adicionar"
    else
        print_success "Arquivos adicionados ao staging"
    fi
}

# Fazer commit inicial
initial_commit() {
    if git rev-parse --verify HEAD &> /dev/null; then
        print_warning "Já existe commit inicial"
        return
    fi
    
    print_status "Fazendo commit inicial..."
    
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

    print_success "Commit inicial realizado"
}

# Mostrar instruções para GitHub
show_github_instructions() {
    echo ""
    echo "🐙 Próximos passos para GitHub:"
    echo "=============================="
    echo ""
    echo "1. 🌐 Crie um repositório no GitHub:"
    echo "   - Acesse: https://github.com/new"
    echo "   - Nome: ImmoFlow"
    echo "   - Descrição: 🏠 Plataforma SaaS completa para imobiliárias com IA multimodal"
    echo "   - Público ou Privado (sua escolha)"
    echo "   - NÃO inicialize com README (já temos)"
    echo ""
    echo "2. 🔗 Conecte o repositório local:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/ImmoFlow.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. 🏷️ Crie uma tag de versão:"
    echo "   git tag -a v1.0.0 -m \"🎉 ImmoFlow v1.0.0 - MVP Complete\""
    echo "   git push origin v1.0.0"
    echo ""
    echo "4. 📋 Configure o repositório:"
    echo "   - Adicione topics: saas, imobiliaria, ai, crm, whatsapp, react, typescript"
    echo "   - Configure branch protection rules"
    echo "   - Adicione colaboradores se necessário"
    echo ""
}

# Função principal
main() {
    echo "🏠 ImmoFlow - Setup do Git"
    echo "=========================="
    echo ""
    
    check_git
    
    NEED_SETUP=0
    if check_existing_repo; then
        NEED_SETUP=1
    fi
    
    if [ $NEED_SETUP -eq 1 ]; then
        init_git
        add_files
        initial_commit
    fi
    
    show_github_instructions
    
    echo ""
    echo "📊 Status do repositório:"
    echo "========================"
    
    if [ -d ".git" ]; then
        print_success "Repositório Git: Inicializado"
        
        if git remote get-url origin &> /dev/null; then
            ORIGIN_URL=$(git remote get-url origin)
            print_success "Remote origin: $ORIGIN_URL"
        else
            print_warning "Remote origin: Não configurado"
        fi
        
        COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
        print_status "Commits: $COMMIT_COUNT"
        
        BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
        print_status "Branch atual: $BRANCH"
    else
        print_error "Repositório Git: Não inicializado"
    fi
    
    echo ""
    print_success "Setup do Git concluído!"
}

# Executar
main
