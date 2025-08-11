import { Routes, Route } from 'react-router-dom'
import ProductSelection from './pages/ProductSelection'
import ConfigDashboard from './pages/ConfigDashboard'
import IAPersonalizada from './pages/IAPersonalizada'
import WhatsAppConfig from './pages/WhatsAppConfig'
import GestaoLeads from './pages/GestaoLeads'
import Planos from './pages/Planos'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<ProductSelection />} />

        {/* Login redirects to Dashboard */}
        <Route path="/login" element={<ProductSelection />} />

        {/* Main Dashboard - seguindo arquitetura definida */}
        <Route path="/dashboard" element={<ConfigDashboard />} />

        {/* Planos */}
        <Route path="/dashboard/planos" element={<Planos />} />
        <Route path="/dashboard/planos/upsell" element={<Planos />} />

        {/* IA Personalizada */}
        <Route path="/dashboard/ia-personalizada" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/canais" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/canais/whatsapp" element={<WhatsAppConfig />} />
        <Route path="/dashboard/ia-personalizada/canais/whatsapp/habilitar" element={<WhatsAppConfig />} />
        <Route path="/dashboard/ia-personalizada/canais/whatsapp/configurar" element={<WhatsAppConfig />} />
        <Route path="/dashboard/ia-personalizada/canais/whatsapp/conectar" element={<WhatsAppConfig />} />
        <Route path="/dashboard/ia-personalizada/canais/instagram" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/canais/telegram" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/automacao" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/automacao/fluxos" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/atendimento-voz" element={<IAPersonalizada />} />
        <Route path="/dashboard/ia-personalizada/treinamento" element={<IAPersonalizada />} />

        {/* Gestão de Leads */}
        <Route path="/dashboard/gestao-leads" element={<GestaoLeads />} />

        {/* Relatórios */}
        <Route path="/dashboard/relatorios" element={<Relatorios />} />

        {/* Configurações */}
        <Route path="/dashboard/configuracoes" element={<ConfigDashboard />} />
        <Route path="/dashboard/configuracoes/integracoes" element={<ConfigDashboard />} />
        <Route path="/dashboard/configuracoes/equipe" element={<ConfigDashboard />} />

        {/* Ajuda */}
        <Route path="/dashboard/ajuda" element={<ConfigDashboard />} />

        {/* Recuperar Senha */}
        <Route path="/recuperar-senha" element={<ProductSelection />} />

        {/* Fallback */}
        <Route path="*" element={<ProductSelection />} />
      </Routes>
    </div>
  )
}

export default App
