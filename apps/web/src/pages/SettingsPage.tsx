import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Key, Bell, Database, Bot, Settings } from 'lucide-react'
import { PreferencesSection } from './settings/PreferencesSection'

export function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    role: 'agent'
  })
  const [notifications, setNotifications] = useState({
    newLeads: true,
    taskReminders: true,
    whatsappMessages: true,
    emailReports: false
  })
  const [aiSettings, setAiSettings] = useState({
    autoClassification: true,
    autoResponse: false,
    sentimentAnalysis: true,
    leadScoring: true
  })

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'ai', name: 'IA & Automação', icon: Bot },
    { id: 'integrations', name: 'Integrações', icon: Database },
    { id: 'preferences', name: 'Preferências', icon: Settings },
    { id: 'security', name: 'Segurança', icon: Key },
  ]

  const handleSaveProfile = async () => {
    try {
      // Integrar com API depois
      console.log('Salvando perfil:', profile)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      // Integrar com API depois
      console.log('Salvando notificações:', notifications)
    } catch (error) {
      console.error('Erro ao salvar notificações:', error)
    }
  }

  const handleSaveAISettings = async () => {
    try {
      // Integrar com API depois
      console.log('Salvando configurações de IA:', aiSettings)
    } catch (error) {
      console.error('Erro ao salvar configurações de IA:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de navegação */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Conteúdo das configurações */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {/* Perfil */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Perfil</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={profile.email}
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Função
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="agent">Corretor</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notificações */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Novos leads</h4>
                      <p className="text-sm text-gray-500">Receber notificação quando um novo lead for criado</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.newLeads}
                      onChange={(e) => setNotifications(prev => ({ ...prev, newLeads: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Lembretes de tarefas</h4>
                      <p className="text-sm text-gray-500">Receber lembretes de tarefas pendentes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.taskReminders}
                      onChange={(e) => setNotifications(prev => ({ ...prev, taskReminders: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Mensagens WhatsApp</h4>
                      <p className="text-sm text-gray-500">Notificar sobre novas mensagens no WhatsApp</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.whatsappMessages}
                      onChange={(e) => setNotifications(prev => ({ ...prev, whatsappMessages: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Relatórios por email</h4>
                      <p className="text-sm text-gray-500">Receber relatórios semanais por email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailReports}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailReports: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotifications}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Salvar Preferências
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* IA & Automação */}
            {activeTab === 'ai' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de IA e Automação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Classificação automática de leads</h4>
                      <p className="text-sm text-gray-500">Usar IA para classificar automaticamente novos leads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiSettings.autoClassification}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, autoClassification: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Respostas automáticas</h4>
                      <p className="text-sm text-gray-500">Gerar respostas automáticas inteligentes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiSettings.autoResponse}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, autoResponse: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Análise de sentimento</h4>
                      <p className="text-sm text-gray-500">Analisar o sentimento das mensagens recebidas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiSettings.sentimentAnalysis}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, sentimentAnalysis: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Pontuação de leads</h4>
                      <p className="text-sm text-gray-500">Calcular automaticamente a pontuação dos leads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiSettings.leadScoring}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, leadScoring: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveAISettings}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Outras abas podem ser implementadas aqui */}
            {activeTab === 'integrations' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Integrações</h3>
                <p className="text-gray-500">Configurações de integrações em desenvolvimento...</p>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências</h3>
                <PreferencesSection />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Segurança</h3>
                <p className="text-gray-500">Configurações de segurança em desenvolvimento...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
