#!/bin/bash

# =====================================================
# IMMOFLOW - CRIAR REPOSITÓRIO NO GITHUB
# =====================================================

echo "🐙 Criando repositório ImmoFlow no GitHub..."

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

# Verificar se GitHub CLI está instalado
check_gh_cli() {
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI encontrado"
        return 0
    else
        print_warning "GitHub CLI não encontrado"
        return 1
    fi
}

# Verificar se está logado no GitHub CLI
check_gh_auth() {
    if gh auth status &> /dev/null; then
        print_success "Autenticado no GitHub CLI"
        return 0
    else
        print_warning "Não autenticado no GitHub CLI"
        return 1
    fi
}

# Criar repositório via GitHub CLI
create_repo_gh_cli() {
    print_status "Criando repositório via GitHub CLI..."
    
    gh repo create ImmoFlow \
        --description "🏠 Plataforma SaaS completa para imobiliárias com IA multimodal, CRM avançado, bots inteligentes e integração WhatsApp" \
        --public \
        --source=. \
        --remote=origin \
        --push
    
    if [ $? -eq 0 ]; then
        print_success "Repositório criado e código enviado com sucesso!"
        return 0
    else
        print_error "Falha ao criar repositório via GitHub CLI"
        return 1
    fi
}

# Instruções manuais
show_manual_instructions() {
    echo ""
    echo "📋 Instruções para criar manualmente:"
    echo "===================================="
    echo ""
    echo "1. 🌐 Acesse: https://github.com/new"
    echo ""
    echo "2. 📝 Configure o repositório:"
    echo "   - Nome: ImmoFlow"
    echo "   - Descrição: 🏠 Plataforma SaaS completa para imobiliárias com IA multimodal, CRM avançado, bots inteligentes e integração WhatsApp"
    echo "   - Visibilidade: Público"
    echo "   - ❌ NÃO marque 'Add a README file'"
    echo "   - ❌ NÃO marque 'Add .gitignore'"
    echo "   - ❌ NÃO marque 'Choose a license'"
    echo ""
    echo "3. 🚀 Após criar, execute:"
    echo "   git push -u origin main"
    echo ""
    echo "4. 🏷️ Crie uma tag de versão:"
    echo "   git tag -a v1.0.0 -m '🎉 ImmoFlow v1.0.0 - MVP Complete'"
    echo "   git push origin v1.0.0"
    echo ""
    echo "5. 📋 Configure o repositório:"
    echo "   - Adicione topics: saas, imobiliaria, ai, crm, whatsapp, react, typescript"
    echo "   - Configure branch protection"
    echo "   - Adicione colaboradores se necessário"
    echo ""
}

# Função principal
main() {
    echo "🏠 ImmoFlow - Criação do Repositório GitHub"
    echo "==========================================="
    echo ""
    
    # Verificar se o Git está configurado
    if ! git remote get-url origin &> /dev/null; then
        print_error "Remote origin não configurado. Execute primeiro:"
        echo "git remote add origin https://github.com/razzzzachan/ImmoFlow.git"
        exit 1
    fi
    
    print_status "Remote origin configurado: $(git remote get-url origin)"
    
    # Tentar via GitHub CLI primeiro
    if check_gh_cli && check_gh_auth; then
        if create_repo_gh_cli; then
            echo ""
            print_success "🎉 Repositório criado com sucesso via GitHub CLI!"
            echo ""
            echo "🔗 URL: https://github.com/razzzzachan/ImmoFlow"
            echo ""
            echo "📋 Próximos passos:"
            echo "- Configure topics no GitHub"
            echo "- Crie uma release v1.0.0"
            echo "- Configure branch protection"
            exit 0
        fi
    fi
    
    # Se falhou ou não tem GitHub CLI, mostrar instruções manuais
    print_warning "Criação automática não disponível"
    show_manual_instructions
}

# Executar
main
