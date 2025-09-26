import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuthContext } from '@/hooks/useAuth';
import { ProtectedRoute, PWAUpdatePrompt, OfflineNotification } from '@/components';
import { TooltipProvider } from '@/components/ui/tooltip';
import ClientDashboard from '@/pages/client/ClientDashboard';
import UserProfile from '@/pages/profile/UserProfile';
import ClientProfile from '@/pages/client/ClientProfile';
import CreateAuction from '@/pages/auctions/CreateAuction';
import MyAuctions from '@/pages/auctions/MyAuctions'; // Importa a nova página
import AuctionDetails from '@/pages/auctions/AuctionDetails'; // Importa a página de detalhes
import Chat from '@/pages/shared/Chat';
import AdvancedSearch from '@/pages/shared/AdvancedSearch';
import AuctionServices from '@/pages/shared/AuctionServices';

// Importar a página principal (Home)
import Home from '@/pages/Home';

// Importar páginas de autenticação
import Login from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Componente para redirecionar baseado no role do usuário
const ProfileRedirect: React.FC = () => {
    const { profile } = useAuthContext();
    
    if (!profile) {
        return <div>Carregando...</div>;
    }
    
    // Mapeamento de redirecionamento para cada papel
    const roleRedirects: { [key: string]: string } = {
        contratante: `/client/profile/${profile.id}`,
        // profissional: `/professional/profile/${profile.id}`, // Rota removida temporariamente
        admin: '/admin/dashboard',
        // Adicione outros papéis aqui se necessário
    };
    
    // CORREÇÃO: Verifique se o papel existe no mapeamento antes de tentar redirecionar
    if (profile.role && roleRedirects[profile.role]) {
        return <Navigate to={roleRedirects[profile.role]} replace />;
    }
    
    // Se o papel não for mapeado, redirecione para a Home (ou uma página de erro)
    return <Navigate to="/" replace />;
};

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
                        <Route path="/professional/profile/:id" element={<UserProfile />} />
                        <Route path="/client/profile/:id" element={<ProtectedRoute requiredRoles={['contratante']}><ClientProfile /></ProtectedRoute>} />

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

                        {/* Rotas de Leilão */}
                        <Route 
                            path="/auctions/create" 
                            element={
                                <ProtectedRoute requiredRoles={['contratante']}>
                                    <CreateAuction />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/auctions/my" 
                            element={
                                <ProtectedRoute requiredRoles={['contratante']}>
                                    <MyAuctions />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/auctions/:id" 
                            element={
                                <ProtectedRoute>
                                    <AuctionDetails />
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