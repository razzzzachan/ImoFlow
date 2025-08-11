import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function ProductSelection() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🏠 ImmoFlow
        </h1>
        <p className="text-2xl text-gray-600 mb-2">
          Sistema definitivo para imobiliárias com IA especializada
        </p>
        <p className="text-lg text-gray-500">
          Escolha o produto ideal para sua necessidade
        </p>
      </div>

      {/* Produtos */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Produto 1 - Bot */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🤖</div>
              <CardTitle className="text-2xl text-blue-600">
                Atendimento com IA
              </CardTitle>
              <CardDescription className="text-lg">
                Automação inteligente de atendimento por voz e texto
              </CardDescription>
              <Badge className="bg-blue-100 text-blue-800 w-fit mx-auto">
                Produto 1
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Ideal para:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Corretores solo ou micro imobiliárias
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Automatizar respostas no WhatsApp
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Atendimento por voz com IA
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Capturar leads automaticamente
                  </li>
                </ul>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">Planos disponíveis:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <div>
                      <span className="font-medium">Essencial</span>
                      <p className="text-sm text-gray-600">Canal único</p>
                    </div>
                    <span className="font-bold text-blue-600">R$ 29/mês</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <div>
                      <span className="font-medium">Personalizável</span>
                      <p className="text-sm text-gray-600">Múltiplos canais</p>
                    </div>
                    <span className="font-bold text-blue-600">R$ 149/mês</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                🚀 Acessar Atendimento IA
              </Button>
            </CardContent>
          </Card>

          {/* Produto 2 - CRM */}
          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🏢</div>
              <CardTitle className="text-2xl text-green-600">
                CRM Imobiliário
              </CardTitle>
              <CardDescription className="text-lg">
                Gestão completa de leads, funil de vendas e equipe
              </CardDescription>
              <Badge className="bg-green-100 text-green-800 w-fit mx-auto">
                Produto 2
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Ideal para:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Imobiliárias com equipe estruturada
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Gestão profissional de leads
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Acompanhar funil de vendas
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Controle de múltiplas unidades
                  </li>
                </ul>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">Planos disponíveis:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <div>
                      <span className="font-medium">Gestão</span>
                      <p className="text-sm text-gray-600">Equipe + CRM</p>
                    </div>
                    <span className="font-bold text-green-600">R$ 600/mês</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <div>
                      <span className="font-medium">Rede</span>
                      <p className="text-sm text-gray-600">Multi-imobiliárias</p>
                    </div>
                    <span className="font-bold text-green-600">R$ 1.200/mês</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                🚀 Acessar CRM Imobiliário
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Combo - Dois Produtos */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🤖 + 🏢</div>
            <CardTitle className="text-2xl text-purple-600">
              Combo Completo
            </CardTitle>
            <CardDescription className="text-lg">
              Atendimento IA + CRM Imobiliário juntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Você recebe:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    Bot de atendimento completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    CRM profissional incluso
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    Integração automática entre produtos
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    Suporte prioritário
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Economia:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bot Personalizável:</span>
                    <span className="line-through text-gray-500">R$ 149</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CRM Gestão:</span>
                    <span className="line-through text-gray-500">R$ 600</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total separado:</span>
                    <span className="line-through text-gray-500">R$ 749</span>
                  </div>
                  <div className="flex justify-between font-bold text-purple-600 text-lg">
                    <span>Combo:</span>
                    <span>R$ 649/mês</span>
                  </div>
                  <p className="text-purple-600 font-medium">Economia de R$ 100/mês!</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3">
              🚀 Contratar Combo Completo - R$ 649/mês
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            💡 Não sabe qual escolher? Comece com o Atendimento IA e evolua para o CRM quando precisar!
          </p>
          <div className="space-x-4">
            <Button variant="outline">
              📞 Falar com Consultor
            </Button>
            <Button variant="outline">
              🎥 Ver Demonstração
            </Button>
            <Button variant="outline">
              📊 Comparar Planos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
