import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuthContext } from './hooks/useAuth';
import { ProtectedRoute, PWAUpdatePrompt, OfflineNotification } from './components';
import { TooltipProvider } from './components/ui/tooltip';

// Importa o novo Layout
import MainLayout from './components/MainLayout';

// Importa as páginas
import Home from './pages/Home';
import Login from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserProfile from './pages/profile/UserProfile';
import ClientProfile from './pages/client/ClientProfile';
import AdvancedSearch from './pages/shared/AdvancedSearch';
import ClientDashboard from './pages/client/ClientDashboard';
import PolicyPage from './pages/shared/PoliticaDeAvaliacao';
import AguardandoAceitePage from './pages/shared/AguardandoAceitePage';
import PaymentPage from './pages/client/PaymentPage';
import CreateAuction from './pages/auctions/CreateAuction';
import MyAuctions from './pages/auctions/MyAuctions';
import AuctionDetails from './pages/auctions/AuctionDetails';
import Chat from './pages/shared/Chat';
import AuctionServices from './pages/shared/AuctionServices';


const ProfileRedirect: React.FC = () => {
    const { profile } = useAuthContext();
    if (!profile) return <div>Carregando...</div>;
    const roleRedirects: { [key: string]: string } = {
        contratante: `/client/profile/${profile.id}`,
        profissional: `/professional/profile/${profile.id}`, 
        admin: '/admin/dashboard',
    };
    if (profile.role && roleRedirects[profile.role]) {
        return <Navigate to={roleRedirects[profile.role]} replace />;
    }
    return <Navigate to="/" replace />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <TooltipProvider>
                <div className="min-h-screen">
                    <OfflineNotification />
                    <Toaster />
                    <Routes>
                        {/* --- ROTAS DENTRO DO LAYOUT PRINCIPAL --- */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="home" element={<Home />} />
                            <Route path="search" element={<AdvancedSearch />} />
                            <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="client/dashboard" element={<ProtectedRoute requiredRoles={['contratante']}><ClientDashboard /></ProtectedRoute>} />
                        </Route>

                        {/* --- ROTAS DE TELA CHEIA (SEM LAYOUT) --- */}
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                        <Route path="/politica-de-avaliacoes" element={<PolicyPage />} />
                        
                        {/* Perfis */}
                        <Route path="/professional/profile/:id" element={<UserProfile />} />
                        <Route path="/client/profile/:id" element={<ProtectedRoute requiredRoles={['contratante']}><ClientProfile /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfileRedirect /></ProtectedRoute>} />
                        
                        {/* Fluxo de Contratação */}
                        <Route path="/aguardando-aceite/:servicoId" element={<ProtectedRoute><AguardandoAceitePage /></ProtectedRoute>} />
                        <Route path="/pagamento/:servicoId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                        
                        {/* Leilão (Auctions) */}
                        <Route path="/auctions" element={<AuctionServices />} />
                        <Route path="/auctions/create" element={<ProtectedRoute requiredRoles={['contratante']}><CreateAuction /></ProtectedRoute>} />
                        <Route path="/auctions/my" element={<ProtectedRoute requiredRoles={['contratante']}><MyAuctions /></ProtectedRoute>} />
                        <Route path="/auctions/:id" element={<ProtectedRoute><AuctionDetails /></ProtectedRoute>} />

                        {/* Rota 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <PWAUpdatePrompt />
                </div>
            </TooltipProvider>
        </AuthProvider>
    );
};

export default App;