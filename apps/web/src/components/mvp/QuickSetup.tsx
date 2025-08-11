import React, { useState, ChangeEvent } from 'react'
// Substituição temporária de UI custom por HTML nativo para destravar build
const Card = ({ children }: any) => <div className="border rounded-lg p-4">{children}</div>
const CardContent = ({ children, className = '' }: any) => <div className={className}>{children}</div>
const CardHeader = ({ children }: any) => <div className="mb-2">{children}</div>
const CardTitle = ({ children, className = '' }: any) => <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
const CardDescription = ({ children }: any) => <p className="text-gray-600 text-sm">{children}</p>
const Button = ({ children, ...props }: any) => <button {...props} className={"px-3 py-2 rounded border " + (props.className || '')}>{children}</button>
const Input = (props: any) => <input {...props} className={"border rounded px-3 py-2 w-full " + (props.className || '')} />
const Label = (props: any) => <label {...props} className={"block mb-1 " + (props.className || '')} />
const Textarea = (props: any) => <textarea {...props} className={"border rounded px-3 py-2 w-full " + (props.className || '')} />
const Select = ({ children, onValueChange, defaultValue }: any) => <select defaultValue={defaultValue} onChange={(e) => onValueChange && onValueChange(e.target.value)} className="border rounded px-3 py-2 w-full">{children}</select>
const SelectTrigger = ({ children }: any) => <>{children}</>
const SelectValue = ({ placeholder }: any) => <option value="">{placeholder}</option>
const SelectContent = ({ children }: any) => <>{children}</>
const SelectItem = ({ children, value }: any) => <option value={value}>{children}</option>
const Badge = ({ children, variant = 'default' }: any) => <span className={`px-2 py-1 text-xs rounded ${variant === 'default' ? 'bg-gray-200' : 'bg-gray-100'}`}>{children}</span>
const Progress = ({ value, className = '' }: any) => <div className={className}><div className="bg-blue-600 h-2 rounded" style={{ width: `${value}%` }} /></div>
import { 
  CheckCircle, 
  Circle, 
  MessageSquare, 
  Building, 
  Zap, 
  Settings,
  Rocket,
  QrCode
} from 'lucide-react'

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  icon: React.ReactNode
}

export default function QuickSetup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState({
    companyName: '',
    businessType: '',
    whatsappNumber: '',
    specialization: '',
    automationLevel: 'basic'
  })

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'company',
      title: 'Dados da Empresa',
      description: 'Configure informações básicas da sua imobiliária',
      completed: false,
      icon: <Building className="w-5 h-5" />
    },
    {
      id: 'whatsapp',
      title: 'Conectar WhatsApp',
      description: 'Integre seu WhatsApp Business com IA especializada',
      completed: false,
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 'ai-config',
      title: 'Configurar IA',
      description: 'Personalize a IA para seu contexto imobiliário',
      completed: false,
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'automations',
      title: 'Automações Básicas',
      description: 'Configure automações essenciais para leads',
      completed: false,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'launch',
      title: 'Lançar Sistema',
      description: 'Ative o ImmoFlow e comece a receber leads',
      completed: false,
      icon: <Rocket className="w-5 h-5" />
    }
  ])

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      completeStep(steps[currentStep].id)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'company':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={setupData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSetupData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Ex: Imobiliária Silva & Associados"
              />
            </div>
            <div>
              <Label htmlFor="businessType">Tipo de Negócio</Label>
              <Select onValueChange={(value: string) => setSetupData(prev => ({ ...prev, businessType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                  <SelectItem value="corretor-autonomo">Corretor Autônomo</SelectItem>
                  <SelectItem value="construtora">Construtora</SelectItem>
                  <SelectItem value="rede-franquias">Rede de Franquias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specialization">Especialização</Label>
              <Select onValueChange={(value: string) => setSetupData(prev => ({ ...prev, specialization: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Área de atuação principal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="alto-padrao">Alto Padrão</SelectItem>
                  <SelectItem value="lancamentos">Lançamentos</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <QrCode className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Conectar WhatsApp Business</h3>
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code com seu WhatsApp Business para conectar
              </p>
            </div>
            <div>
              <Label htmlFor="whatsappNumber">Número do WhatsApp Business</Label>
              <Input
                id="whatsappNumber"
                value={setupData.whatsappNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSetupData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">✨ IA Especializada Ativada</h4>
              <p className="text-blue-700 text-sm">
                Seu bot já entende contexto imobiliário: tipos de imóveis, bairros, 
                financiamentos e qualificação de leads automaticamente.
              </p>
            </div>
          </div>
        )

      case 'ai-config':
        return (
          <div className="space-y-4">
            <div>
              <Label>Personalização da IA</Label>
              <p className="text-sm text-gray-600 mb-3">
                Configure como a IA deve se comportar com seus clientes
              </p>
            </div>
            <div>
              <Label htmlFor="aiPersonality">Tom de Voz</Label>
              <Select defaultValue="profissional">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                  <SelectItem value="direto">Direto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specialKnowledge">Conhecimento Específico</Label>
              <Textarea
                id="specialKnowledge"
                placeholder="Ex: Especialista em apartamentos na Zona Sul, conhece bem financiamentos da Caixa..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">🏠 Tipos de Imóveis</h4>
                <p className="text-sm text-gray-600">IA reconhece automaticamente</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">💰 Faixas de Preço</h4>
                <p className="text-sm text-gray-600">Qualificação inteligente</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">📍 Localização</h4>
                <p className="text-sm text-gray-600">Entende bairros e regiões</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">⚡ Urgência</h4>
                <p className="text-sm text-gray-600">Prioriza leads quentes</p>
              </div>
            </div>
          </div>
        )

      case 'automations':
        return (
          <div className="space-y-4">
            <div>
              <Label>Automações Essenciais</Label>
              <p className="text-sm text-gray-600 mb-4">
                Selecione as automações que deseja ativar
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  name: 'Resposta Automática',
                  description: 'Responde imediatamente novos contatos',
                  enabled: true
                },
                {
                  name: 'Qualificação de Leads',
                  description: 'Faz perguntas para qualificar interesse',
                  enabled: true
                },
                {
                  name: 'Follow-up Inteligente',
                  description: 'Envia lembretes baseados no comportamento',
                  enabled: true
                },
                {
                  name: 'Agendamento de Visitas',
                  description: 'Oferece horários disponíveis automaticamente',
                  enabled: false
                },
                {
                  name: 'Notificação para Corretor',
                  description: 'Avisa quando lead está pronto para atendimento',
                  enabled: true
                }
              ].map((automation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{automation.name}</h4>
                    <p className="text-sm text-gray-600">{automation.description}</p>
                  </div>
                  <Badge variant={automation.enabled ? "default" : "secondary"}>
                    {automation.enabled ? "Ativada" : "Desativada"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )

      case 'launch':
        return (
          <div className="space-y-4 text-center">
            <Rocket className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-bold">🎉 ImmoFlow Configurado!</h3>
            <p className="text-gray-600 mb-6">
              Seu sistema está pronto para automatizar vendas com IA especializada
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium">Bot WhatsApp</h4>
                <p className="text-sm text-gray-600">Conectado e funcionando</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium">IA Especializada</h4>
                <p className="text-sm text-gray-600">Configurada para imóveis</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium">Automações</h4>
                <p className="text-sm text-gray-600">Ativas e funcionando</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">🚀 Próximos Passos</h4>
              <ul className="text-sm text-yellow-800 text-left space-y-1">
                <li>• Teste o bot enviando uma mensagem</li>
                <li>• Configure integrações com seu site</li>
                <li>• Treine sua equipe no novo sistema</li>
                <li>• Monitore métricas no dashboard</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Setup Plug-and-Play do ImmoFlow
        </h1>
        <p className="text-gray-600">
          Configure seu sistema em minutos, não horas
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progresso do Setup</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : index === currentStep 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                </div>
                <span className="text-xs text-center max-w-16">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {steps[currentStep].icon}
            <span>{steps[currentStep].title}</span>
          </CardTitle>
          <CardDescription>
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
        </Button>
      </div>
    </div>
  )
}
