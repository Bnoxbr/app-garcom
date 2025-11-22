import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuthContext } from './hooks/useAuth';
import { ProtectedRoute } from './components'; 
import { TooltipProvider } from './components/ui/tooltip';
import ChangePassword from './pages/auth/ChangePassword';

// Layout Principal (Contém Header e Footer do App)
import MainLayout from './components/MainLayout';

const PWAUpdatePrompt = React.lazy(() => import('./components/PWAUpdatePrompt'));
const OfflineNotification = React.lazy(() => import('./components/OfflineNotification'));

// Importa as páginas
import Home from './pages/Home';
import Login from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserProfile from './pages/profile/UserProfile';
import ClientProfile from './pages/client/ClientProfile';
import AdvancedSearch from './pages/shared/AdvancedSearch';
import ClientDashboard from './pages/client/ClientDashboard';
import AguardandoAceitePage from './pages/shared/AguardandoAceitePage';
import PaymentPage from './pages/client/PaymentPage';
import CreateAuction from './pages/auctions/CreateAuction';
import MyAuctions from './pages/auctions/MyAuctions';
import AuctionDetails from './pages/auctions/AuctionDetails';
import Chat from './pages/shared/Chat';
import AuctionServices from './pages/shared/AuctionServices';

// [1] COMPONENTE DE REDIRECIONAMENTO DE PERFIL
const ProfileRedirect: React.FC = () => {
    const { profile, loading } = useAuthContext();
    
    if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;

    if (!profile) return <Navigate to="/" replace />;

    const roleRedirects: { [key: string]: string } = {
        contratante: `/client/profile/${profile.id}`,
        profissional: `/professional/profile/${profile.id}`, 
        admin: '/admin/dashboard',
    };

    if (profile.role && roleRedirects[profile.role]) {
        return <Navigate to={roleRedirects[profile.role]} replace />;
    }
    
    return <Navigate to="/client/dashboard" replace />;
};

// [2] COMPONENTE DE REDIRECIONAMENTO DA RAIZ (ROOT)
// Usado APENAS no path="/" para decidir a página inicial do usuário logado
const RootRedirect: React.FC = () => {
    const { profile, loading } = useAuthContext();
    
    if (loading) return <div className="flex h-screen items-center justify-center">Iniciando...</div>;
    
    // Se for contratante, a "Raiz" dele é o Dashboard (Pedidos)
    if (profile?.role === 'contratante') {
        return <Navigate to="/client/dashboard" replace />;
    }
    
    // Para outros (ou deslogados), a Raiz é a Home (Vitrine)
    return <Home />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <TooltipProvider>
                <div className="min-h-screen">
                    {import.meta.env.PROD && <React.Suspense fallback={<div />}><OfflineNotification /></React.Suspense>}
                    <Toaster />
                    <Routes>
                        {/* --- ROTAS DENTRO DO LAYOUT PRINCIPAL (COM FOOTER) --- */}
                        <Route path="/" element={<MainLayout />}>
                            {/* CORREÇÃO: A raiz '/' tenta redirecionar inteligentemente */}
                            <Route index element={<RootRedirect />} />
                            
                            {/* CORREÇÃO: A rota '/home' SEMPRE mostra a Home, sem redirecionar. 
                                Isso permite que o botão "Voltar" funcione e mostre a vitrine. */}
                            <Route path="home" element={<Home />} />
                            
                            <Route path="search" element={<AdvancedSearch />} />
                            <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="client/dashboard" element={<ProtectedRoute requiredRoles={['contratante']}><ClientDashboard /></ProtectedRoute>} />
                            
                            {/* Leilão (Auctions) */}
                            <Route path="/auctions" element={<AuctionServices />} />
                            <Route path="/auctions/create" element={<ProtectedRoute requiredRoles={['contratante']}><CreateAuction /></ProtectedRoute>} />
                            <Route path="/auctions/my" element={<ProtectedRoute requiredRoles={['contratante']}><MyAuctions /></ProtectedRoute>} />
                            <Route path="/auctions/:id" element={<ProtectedRoute><AuctionDetails /></ProtectedRoute>} />
                        </Route>

                        {/* --- ROTAS DE TELA CHEIA (SEM HEADER/FOOTER PADRÃO) --- */}
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

                        {/* Perfis - Nota: Estão fora do MainLayout, por isso não têm Footer */}
                        <Route path="/professional/profile/:id" element={<UserProfile />} />
                        <Route path="/client/profile/:id" element={<ProtectedRoute requiredRoles={['contratante']}><ClientProfile /></ProtectedRoute>} />
                        
                        {/* Redirecionador inteligente /profile */}
                        <Route path="/profile" element={<ProtectedRoute><ProfileRedirect /></ProtectedRoute>} />
                        
                        {/* Fluxo de Contratação */}
                        <Route path="/aguardando-aceite/:servicoId" element={<ProtectedRoute><AguardandoAceitePage /></ProtectedRoute>} />
                        <Route path="/pagamento/:servicoId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                        
                        {/* Rota 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    {import.meta.env.PROD && <React.Suspense fallback={<div />}><PWAUpdatePrompt /></React.Suspense>}
                </div>
            </TooltipProvider>
        </AuthProvider>
    );
};

export default App;