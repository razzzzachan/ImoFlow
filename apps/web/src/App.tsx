import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { AcceptInvitePage } from './pages/AcceptInvitePage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { CRMPage } from './pages/CRMPage'
import { LeadDetailPage } from './pages/LeadDetailPage'
import { BotsPage } from './pages/BotsPage'
import { BotEditPage } from './pages/BotEditPage'
import { WhatsAppPage } from './pages/WhatsAppPage'
import { UsersPage } from './pages/UsersPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/crm" element={<CRMPage />} />
                  <Route path="/crm/leads/:id" element={<LeadDetailPage />} />
                  <Route path="/bots" element={<BotsPage />} />
                  <Route path="/bots/:id" element={<BotEditPage />} />
                  <Route path="/whatsapp" element={<WhatsAppPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
