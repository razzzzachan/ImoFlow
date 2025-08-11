import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ConfigLayout from '../components/ConfigLayout'

export default function WhatsAppConfig() {
  const [qrCode, setQrCode] = useState(false)

  return (
    <ConfigLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                💬 Configuração WhatsApp
              </h1>
              <p className="text-gray-600">
                Configure e gerencie sua conexão com o WhatsApp Business
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                Conectado
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                💾 Salvar Configurações
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status da Conexão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-green-600">Conectado</div>
                  <p className="text-xs text-gray-500">Última sync: 2 min atrás</p>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Número Conectado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">+55 11 99999-1111</div>
              <p className="text-xs text-gray-500">WhatsApp Business</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">247</div>
              <p className="text-xs text-green-600">+15% vs ontem</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Habilitar / Sincronizar */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">🔄</span>
                Habilitar / Sincronizar
              </CardTitle>
              <CardDescription>
                Gerencie a conexão e sincronização com WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-green-900">WhatsApp Conectado</h4>
                      <p className="text-sm text-green-700">Sincronização automática ativa</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Online</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Última sync:</span>
                      <span className="font-medium ml-2">2 min atrás</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium ml-2 text-green-600">Estável</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium ml-2">99.8%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Latência:</span>
                      <span className="font-medium ml-2">45ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    🔄 Forçar Sincronização
                  </Button>
                  <Button className="w-full" variant="outline">
                    🔌 Reconectar WhatsApp
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setQrCode(!qrCode)}>
                    📱 {qrCode ? 'Ocultar' : 'Mostrar'} QR Code
                  </Button>
                </div>

                {qrCode && (
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <div className="text-6xl">📱</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Escaneie este QR Code com seu WhatsApp para conectar
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configurar WhatsApp */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <span className="mr-2 text-2xl">⚙️</span>
                Configurar Mensagens
              </CardTitle>
              <CardDescription>
                Personalize mensagens automáticas e respostas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'Mensagem de Boas-vindas',
                    preview: 'Olá! Sou o assistente virtual da ImmoFlow...',
                    active: true
                  },
                  {
                    type: 'Resposta Fora do Horário',
                    preview: 'Obrigado pelo contato! Nosso horário de atendimento...',
                    active: true
                  },
                  {
                    type: 'Qualificação de Lead',
                    preview: 'Para te ajudar melhor, preciso de algumas informações...',
                    active: true
                  },
                  {
                    type: 'Agendamento de Visita',
                    preview: 'Vamos agendar sua visita! Qual o melhor dia...',
                    active: false
                  }
                ].map((message, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{message.type}</h4>
                      <Badge variant={message.active ? "default" : "secondary"}>
                        {message.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 italic">"{message.preview}"</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        ✏️ Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                ))}

                <Button className="w-full mt-4" variant="outline">
                  ➕ Nova Mensagem Automática
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conectar Número */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <span className="mr-2 text-2xl">📞</span>
                Conectar Número
              </CardTitle>
              <CardDescription>
                Gerencie números conectados ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-orange-900">Número Principal</h4>
                      <p className="text-lg font-bold text-orange-700">+55 11 99999-1111</p>
                    </div>
                    <Badge className="bg-orange-600 text-white">Ativo</Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">WhatsApp Business</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verificado:</span>
                      <span className="font-medium text-green-600">✓ Sim</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conectado em:</span>
                      <span className="font-medium">28/01/2025</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    📱 Adicionar Novo Número
                  </Button>
                  <Button className="w-full" variant="outline">
                    🔄 Trocar Número Principal
                  </Button>
                  <Button className="w-full" variant="outline">
                    ✅ Verificar Número
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">💡 Dica</h5>
                  <p className="text-sm text-blue-700">
                    Use um número WhatsApp Business para ter acesso a recursos avançados como catálogo e mensagens automáticas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <span className="mr-2 text-2xl">📊</span>
                Estatísticas WhatsApp
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho do seu WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Mensagens Enviadas', value: '1.247', change: '+15%' },
                    { label: 'Mensagens Recebidas', value: '892', change: '+8%' },
                    { label: 'Taxa de Resposta', value: '94.2%', change: '+2%' },
                    { label: 'Tempo Médio Resposta', value: '45s', change: '-12%' }
                  ].map((stat, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">{stat.label}</div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className={`text-xs ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} vs ontem
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    📈 Ver Relatório Completo
                  </Button>
                  <Button className="w-full" variant="outline">
                    📤 Exportar Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Settings */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Configurações Avançadas</CardTitle>
              <CardDescription>
                Configurações técnicas e avançadas do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Webhook</h4>
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-600 mb-1">URL:</div>
                    <div className="text-sm font-mono">https://api.immoflow.com/webhook</div>
                  </div>
                  <Button size="sm" variant="outline">🔗 Configurar</Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">API Token</h4>
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-600 mb-1">Token:</div>
                    <div className="text-sm font-mono">wapp_••••••••••••</div>
                  </div>
                  <Button size="sm" variant="outline">🔑 Renovar</Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Backup</h4>
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-600 mb-1">Último backup:</div>
                    <div className="text-sm">Hoje às 03:00</div>
                  </div>
                  <Button size="sm" variant="outline">💾 Fazer Backup</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ConfigLayout>
  )
}
