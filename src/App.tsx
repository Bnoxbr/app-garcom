import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuthContext } from './hooks/useAuth';
import { ProtectedRoute, PWAUpdatePrompt, OfflineNotification } from './components';
import { TooltipProvider } from './components/ui/tooltip';
import UserProfile from './pages/provider/UserProfile';
import ClientProfile from './pages/client/ClientProfile';
import ProviderDashboard from './pages/provider/Dashboard';
import ClientDashboard from './pages/client/Dashboard';
import Chat from './pages/shared/Chat';
import AdvancedSearch from './pages/shared/AdvancedSearch';
import AuctionServices from './pages/shared/AuctionServices';

// Importar a página principal (Home)
import Home from './pages/Home';

// Importar páginas de autenticação
import Login from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Componente para redirecionar baseado no role do usuário
const ProfileRedirect: React.FC = () => {
  const { profile } = useAuthContext()
  
  if (!profile) {
    return <div>Carregando...</div>
  }
  
  const roleRedirects = {
    contratante: `/client/profile/${profile.id}`,
    prestador: `/provider/profile/${profile.id}`,
    admin: '/admin/dashboard'
  }
  
  return <Navigate to={roleRedirects[profile.role] || '/'} replace />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <OfflineNotification />
          <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<AdvancedSearch />} />
              <Route path="/advanced-search" element={<AdvancedSearch />} />
              
              {/* Rotas de autenticação */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* Rotas de perfil unificadas */}
              <Route path="/provider/profile/:id" element={<ProtectedRoute requiredRoles={['prestador']}><UserProfile userType='prestador' /></ProtectedRoute>} />
              <Route path="/client/profile/:id" element={<ProtectedRoute requiredRoles={['contratante']}><ClientProfile /></ProtectedRoute>} />
              <Route path="/professional/profile/:id" element={<UserProfile userType='prestador' />} />
              
              {/* Rotas protegidas - Provider */}
              <Route 
                path="/provider/dashboard" 
                element={
                  <ProtectedRoute requiredRoles={['prestador']}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas - Client */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileRedirect />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/dashboard" 
                element={
                  <ProtectedRoute requiredRoles={['contratante']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas - Admin */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <div>Admin Dashboard</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas - Establishment */}
              <Route 
                path="/establishment/dashboard" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <div>Establishment Dashboard</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas - Gerais (qualquer usuário autenticado) */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auctions" 
                element={<AuctionServices />} 
              />
              <Route 
                path="/leilao" 
                element={<AuctionServices />} 
              />
              
              {/* Rotas de desenvolvimento/placeholder protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/preferences" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reviews" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/social/*" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas de fallback */}
              <Route path="/back" element={<Navigate to="/" replace />} />
              <Route path="/menu" element={<Navigate to="/" replace />} />
              
              {/* Rota 404 - redireciona para home */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PWAUpdatePrompt />
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default App;
