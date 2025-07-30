#!/bin/bash

# =====================================================
# IMMOFLOW - SCRIPT DE INSTALAÇÃO AUTOMATIZADA
# =====================================================

echo "🚀 Iniciando setup do ImmoFlow..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
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

# Verificar se Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Instale Node.js 18+ antes de continuar."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) encontrado"
}

# Verificar se npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado. Instale npm antes de continuar."
        exit 1
    fi
    
    print_success "npm $(npm -v) encontrado"
}

# Instalar dependências
install_dependencies() {
    print_status "Instalando dependências..."
    
    if npm install; then
        print_success "Dependências instaladas com sucesso"
    else
        print_error "Falha ao instalar dependências"
        exit 1
    fi
}

# Configurar variáveis de ambiente
setup_env() {
    print_status "Configurando variáveis de ambiente..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Arquivo .env criado a partir do .env.example"
            print_warning "IMPORTANTE: Configure suas credenciais no arquivo .env"
        else
            print_error "Arquivo .env.example não encontrado"
            exit 1
        fi
    else
        print_warning "Arquivo .env já existe, pulando..."
    fi
    
    # Configurar .env para o frontend
    if [ ! -f apps/web/.env ]; then
        cat > apps/web/.env << EOF
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
EOF
        print_success "Arquivo apps/web/.env criado"
        print_warning "IMPORTANTE: Configure as variáveis do frontend em apps/web/.env"
    else
        print_warning "Arquivo apps/web/.env já existe, pulando..."
    fi
}

# Verificar configuração do Supabase
check_supabase_config() {
    print_status "Verificando configuração do Supabase..."
    
    if grep -q "your_supabase" .env; then
        print_warning "Variáveis do Supabase não configuradas no .env"
        print_warning "Configure SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY"
        return 1
    fi
    
    if grep -q "your_supabase" apps/web/.env; then
        print_warning "Variáveis do Supabase não configuradas no apps/web/.env"
        print_warning "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY"
        return 1
    fi
    
    print_success "Configuração do Supabase parece estar OK"
    return 0
}

# Verificar configuração do OpenAI
check_openai_config() {
    print_status "Verificando configuração do OpenAI..."
    
    if grep -q "your_openai" .env; then
        print_warning "Chave da OpenAI não configurada no .env"
        print_warning "Configure OPENAI_API_KEY para usar funcionalidades de IA"
        return 1
    fi
    
    print_success "Configuração da OpenAI parece estar OK"
    return 0
}

# Mostrar próximos passos
show_next_steps() {
    echo ""
    echo "🎉 Setup básico concluído!"
    echo ""
    echo "📋 Próximos passos:"
    echo ""
    echo "1. 🔧 Configure o Supabase:"
    echo "   - Execute os scripts SQL em supabase/setup-complete.sql"
    echo "   - Execute supabase/setup-triggers-rls.sql"
    echo "   - Execute supabase/setup-initial-data.sql"
    echo "   - Crie os buckets de storage (interactions, avatars, documents)"
    echo ""
    echo "2. 🔑 Configure as credenciais:"
    echo "   - Edite o arquivo .env com suas credenciais do Supabase"
    echo "   - Edite o arquivo apps/web/.env com as variáveis do frontend"
    echo "   - Configure sua chave da OpenAI no .env"
    echo ""
    echo "3. 🚀 Execute o sistema:"
    echo "   npm run dev"
    echo ""
    echo "4. 📖 Leia a documentação:"
    echo "   - README.md - Instruções gerais"
    echo "   - arquitetura.md - Arquitetura do sistema"
    echo "   - supabase/SETUP-INSTRUCTIONS.md - Setup detalhado do Supabase"
    echo ""
    echo "🌐 URLs após executar:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:3001"
    echo ""
}

# Função principal
main() {
    echo "🏠 ImmoFlow - Plataforma SaaS para Imobiliárias"
    echo "================================================"
    echo ""
    
    # Verificações
    check_node
    check_npm
    
    # Instalação
    install_dependencies
    setup_env
    
    # Verificações de configuração
    SUPABASE_OK=0
    OPENAI_OK=0
    
    if check_supabase_config; then
        SUPABASE_OK=1
    fi
    
    if check_openai_config; then
        OPENAI_OK=1
    fi
    
    # Mostrar status final
    echo ""
    echo "📊 Status da Configuração:"
    echo "=========================="
    
    if [ $SUPABASE_OK -eq 1 ]; then
        print_success "Supabase: Configurado"
    else
        print_warning "Supabase: Necessita configuração"
    fi
    
    if [ $OPENAI_OK -eq 1 ]; then
        print_success "OpenAI: Configurado"
    else
        print_warning "OpenAI: Necessita configuração"
    fi
    
    # Próximos passos
    show_next_steps
}

# Executar função principal
main
