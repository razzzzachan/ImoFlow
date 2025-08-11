import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface ConfigLayoutProps {
  children: React.ReactNode
}

export default function ConfigLayout({ children }: ConfigLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleNavigation = (route: string, id: string) => {
    navigate(route)
    setActiveSection(id)
  }

  const menuItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      description: 'Visão geral do sistema',
      route: '/dashboard'
    },
    {
      id: 'planos',
      icon: '💰',
      label: 'Planos',
      description: 'Assinatura e upsell',
      route: '/dashboard/planos',
      children: [
        { id: 'upsell', label: 'Fazer upsell', route: '/dashboard/planos/upsell' }
      ]
    },
    {
      id: 'ia-personalizada',
      icon: '🤖',
      label: 'IA Personalizada',
      description: 'Configurar assistente',
      route: '/dashboard/ia-personalizada',
      children: [
        {
          id: 'canais',
          label: 'Canais',
          route: '/dashboard/ia-personalizada/canais',
          children: [
            {
              id: 'whatsapp',
              label: 'WhatsApp',
              route: '/dashboard/ia-personalizada/canais/whatsapp',
              children: [
                { id: 'habilitar', label: 'Habilitar / sincronizar', route: '/dashboard/ia-personalizada/canais/whatsapp/habilitar' },
                { id: 'configurar', label: 'Configurar WhatsApp', route: '/dashboard/ia-personalizada/canais/whatsapp/configurar' },
                { id: 'conectar', label: 'Conectar número', route: '/dashboard/ia-personalizada/canais/whatsapp/conectar' }
              ]
            },
            { id: 'instagram', label: 'Instagram', route: '/dashboard/ia-personalizada/canais/instagram' },
            { id: 'telegram', label: 'Telegram (Desativado)', route: '/dashboard/ia-personalizada/canais/telegram' }
          ]
        },
        {
          id: 'automacao',
          label: 'Automação',
          route: '/dashboard/ia-personalizada/automacao',
          children: [
            { id: 'fluxos', label: 'Fluxos e respostas', route: '/dashboard/ia-personalizada/automacao/fluxos' }
          ]
        },
        { id: 'atendimento-voz', label: 'Atendimento por voz', route: '/dashboard/ia-personalizada/atendimento-voz' },
        { id: 'treinamento', label: 'Treinamento', route: '/dashboard/ia-personalizada/treinamento' }
      ]
    },
    {
      id: 'gestao-leads',
      icon: '🏢',
      label: 'Gestão de Leads',
      description: 'CRM e funil de vendas',
      route: '/dashboard/gestao-leads'
    },
    {
      id: 'relatorios',
      icon: '📈',
      label: 'Relatórios',
      description: 'Analytics e métricas',
      route: '/dashboard/relatorios'
    },
    {
      id: 'configuracoes',
      icon: '⚙️',
      label: 'Configurações',
      description: 'Configurações gerais',
      route: '/dashboard/configuracoes',
      children: [
        { id: 'integracoes', label: 'Integrações', route: '/dashboard/configuracoes/integracoes' },
        { id: 'equipe', label: 'Equipe', route: '/dashboard/configuracoes/equipe' }
      ]
    },
    {
      id: 'ajuda',
      icon: '❓',
      label: 'Ajuda',
      description: 'Suporte e documentação',
      route: '/dashboard/ajuda'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">ImmoFlow</h1>
              <p className="text-sm text-gray-500">Painel de Controle</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.route, item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                location.pathname === item.route || location.pathname.startsWith(item.route + '/')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500 truncate">{item.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">João Silva</div>
              <div className="text-xs text-gray-500">Plano Essencial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
