#!/usr/bin/env node

/**
 * ImmoFlow MVP - Script de Setup Automatizado
 * Sistema definitivo para imobiliárias com IA especializada
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 ImmoFlow MVP - Setup Automatizado')
console.log('=====================================')

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkRequirements() {
  log('\n📋 Verificando requisitos...', 'blue')
  
  try {
    // Verificar Node.js
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
    log(`✅ Node.js: ${nodeVersion}`, 'green')
    
    // Verificar npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
    log(`✅ npm: ${npmVersion}`, 'green')
    
    return true
  } catch (error) {
    log('❌ Erro ao verificar requisitos:', 'red')
    log(error.message, 'red')
    return false
  }
}

function setupEnvironment() {
  log('\n🔧 Configurando ambiente...', 'blue')
  
  const envPath = path.join(process.cwd(), '.env')
  const envExamplePath = path.join(process.cwd(), '.env.example')
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath)
      log('✅ Arquivo .env criado a partir do .env.example', 'green')
    } else {
      log('❌ Arquivo .env.example não encontrado', 'red')
      return false
    }
  } else {
    log('✅ Arquivo .env já existe', 'green')
  }
  
  return true
}

function installDependencies() {
  log('\n📦 Instalando dependências...', 'blue')
  
  try {
    // Instalar dependências do root
    log('Instalando dependências do projeto principal...', 'yellow')
    execSync('npm install', { stdio: 'inherit' })
    
    // Instalar dependências dos workspaces
    log('Instalando dependências dos workspaces...', 'yellow')
    execSync('npm install --workspaces', { stdio: 'inherit' })
    
    log('✅ Dependências instaladas com sucesso', 'green')
    return true
  } catch (error) {
    log('❌ Erro ao instalar dependências:', 'red')
    log(error.message, 'red')
    return false
  }
}

function setupDatabase() {
  log('\n🗄️  Configurando banco de dados...', 'blue')
  
  const schemaPath = path.join(process.cwd(), 'supabase', 'mvp-schema.sql')
  
  if (fs.existsSync(schemaPath)) {
    log('✅ Schema MVP encontrado', 'green')
    log('📝 Execute o arquivo mvp-schema.sql no seu Supabase:', 'yellow')
    log(`   ${schemaPath}`, 'yellow')
  } else {
    log('❌ Schema MVP não encontrado', 'red')
    return false
  }
  
  return true
}

function createMVPStructure() {
  log('\n🏗️  Criando estrutura MVP...', 'blue')
  
  const directories = [
    'apps/api/src/routes',
    'apps/web/src/components/mvp',
    'apps/web/src/pages/mvp',
    'apps/web/src/hooks/mvp',
    'data/uploads',
    'logs'
  ]
  
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      log(`✅ Diretório criado: ${dir}`, 'green')
    } else {
      log(`✅ Diretório já existe: ${dir}`, 'green')
    }
  })
  
  return true
}

function generateAPIKey() {
  log('\n🔑 Gerando chaves de API...', 'blue')
  
  const crypto = require('crypto')
  
  // Gerar JWT Secret se não existir
  const envPath = path.join(process.cwd(), '.env')
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  if (envContent.includes('your_jwt_secret')) {
    const jwtSecret = crypto.randomBytes(64).toString('hex')
    envContent = envContent.replace('your_jwt_secret', jwtSecret)
    log('✅ JWT Secret gerado', 'green')
  }
  
  // Gerar Webhook Secret
  if (!envContent.includes('WEBHOOK_SECRET=')) {
    const webhookSecret = crypto.randomBytes(32).toString('hex')
    envContent += `\nWEBHOOK_SECRET=${webhookSecret}\n`
    log('✅ Webhook Secret gerado', 'green')
  }
  
  fs.writeFileSync(envPath, envContent)
  return true
}

function validateConfiguration() {
  log('\n✅ Validando configuração...', 'blue')
  
  const envPath = path.join(process.cwd(), '.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'JWT_SECRET'
  ]
  
  const missingVars = []
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
      missingVars.push(varName)
    }
  })
  
  if (missingVars.length > 0) {
    log('⚠️  Variáveis de ambiente pendentes:', 'yellow')
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'yellow')
    })
    log('\n📝 Configure essas variáveis no arquivo .env antes de continuar', 'yellow')
    return false
  }
  
  log('✅ Todas as variáveis obrigatórias estão configuradas', 'green')
  return true
}

function showNextSteps() {
  log('\n🎉 Setup MVP concluído com sucesso!', 'green')
  log('=====================================', 'green')
  
  log('\n📋 Próximos passos:', 'blue')
  log('1. Configure suas credenciais no arquivo .env:', 'yellow')
  log('   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY', 'yellow')
  log('   - OPENAI_API_KEY', 'yellow')
  
  log('\n2. Execute o schema no Supabase:', 'yellow')
  log('   - Abra o Supabase Dashboard', 'yellow')
  log('   - Vá em SQL Editor', 'yellow')
  log('   - Execute o arquivo supabase/mvp-schema.sql', 'yellow')
  
  log('\n3. Inicie o sistema:', 'yellow')
  log('   npm run dev', 'yellow')
  
  log('\n4. Acesse o sistema:', 'yellow')
  log('   Frontend: http://localhost:3000', 'yellow')
  log('   API: http://localhost:3001', 'yellow')
  
  log('\n🚀 ImmoFlow MVP está pronto para decolar!', 'green')
  log('\n📖 Documentação: README.md', 'blue')
  log('🏗️  Arquitetura: arquitetura-estrategica.md', 'blue')
  log('🗺️  Roadmap: nova atualizacao/roadmap.md', 'blue')
}

function showError(step, error) {
  log(`\n❌ Erro no passo: ${step}`, 'red')
  log(`Detalhes: ${error}`, 'red')
  log('\n🔧 Tente executar o setup manualmente ou verifique os logs', 'yellow')
  process.exit(1)
}

// Executar setup
async function runSetup() {
  try {
    log('🏠 ImmoFlow - Sistema Definitivo para Imobiliárias', 'blue')
    log('🤖 Com IA especializada no setor imobiliário', 'blue')
    
    if (!checkRequirements()) {
      showError('Verificação de requisitos', 'Requisitos não atendidos')
    }
    
    if (!setupEnvironment()) {
      showError('Configuração de ambiente', 'Falha ao configurar .env')
    }
    
    if (!installDependencies()) {
      showError('Instalação de dependências', 'Falha ao instalar pacotes')
    }
    
    if (!createMVPStructure()) {
      showError('Criação de estrutura', 'Falha ao criar diretórios')
    }
    
    if (!generateAPIKey()) {
      showError('Geração de chaves', 'Falha ao gerar chaves de API')
    }
    
    if (!setupDatabase()) {
      showError('Configuração de banco', 'Falha ao configurar banco')
    }
    
    const configValid = validateConfiguration()
    
    showNextSteps()
    
    if (!configValid) {
      log('\n⚠️  Lembre-se de configurar as variáveis de ambiente!', 'yellow')
    }
    
  } catch (error) {
    showError('Setup geral', error.message)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runSetup()
}

module.exports = { runSetup }
