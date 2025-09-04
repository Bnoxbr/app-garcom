import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components';

// Importar as páginas migradas
import ProviderProfile from './pages/provider/ProviderProfile';
import ClientProfile from './pages/client/ClientProfile';
import Chat from './pages/shared/Chat';
import AdvancedSearch from './pages/shared/AdvancedSearch';
import AuctionServices from './pages/shared/AuctionServices';

// Importar a página principal (Home)
import Home from './pages/Home';

// Importar páginas de autenticação
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
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
            
            {/* Rotas protegidas - Provider */}
            <Route 
              path="/provider/profile" 
              element={
                <ProtectedRoute requiredRoles={['provider']}>
                  <ProviderProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/provider/dashboard" 
              element={
                <ProtectedRoute requiredRoles={['provider']}>
                  <div>Provider Dashboard</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas - Client */}
            <Route 
              path="/client/profile" 
              element={
                <ProtectedRoute requiredRoles={['client']}>
                  <ClientProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requiredRoles={['client']}>
                  <ClientProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/dashboard" 
              element={
                <ProtectedRoute requiredRoles={['client']}>
                  <div>Client Dashboard</div>
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
                <ProtectedRoute requiredRoles={['establishment']}>
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
              element={
                <ProtectedRoute>
                  <AuctionServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leilao" 
              element={
                <ProtectedRoute>
                  <AuctionServices />
                </ProtectedRoute>
              } 
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
      </div>
    </AuthProvider>
  );
};

export default App;
