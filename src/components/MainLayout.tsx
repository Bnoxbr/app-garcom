import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom'; 

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuthContext();
    const [scrolled, setScrolled] = useState(false);

    const logoUrl = "https://rtcafnmyuybhxkcxkrzz.supabase.co/storage/v1/object/public/imagens%20diversas/StafferWork2.png"; 
    
    // Função para gerar iniciais (Fallback do Avatar)
    const getInitials = (name: string | undefined): string => {
        if (!name) return 'SW';
        const parts = name?.split(' ').filter(p => p.length > 0);
        if (parts && parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts && parts.length > 0 ? parts[0][0].toUpperCase() : 'SW';
    };
    
    const isActive = (path: string) => {
        const currentPath = location.pathname;
        if (path === '/home') {
            return currentPath === '/' || currentPath === '/home';
        }
        if (path === '/profile') {
            return currentPath.startsWith('/profile') || currentPath.startsWith('/client/profile') || currentPath.startsWith('/professional/profile');
        }
        return currentPath.startsWith(path);
    };

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => document.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProfileClick = () => {
        // Usa a rota inteligente /profile que resolve o ID
        navigate('/profile');
    };

    // Determina o nome para saudação e avatar (usando user.email como fallback final)
    const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilizador';
    const avatarFallback = getInitials(profile?.nome_fantasia || profile?.full_name);
    const avatarUrl = profile?.avatar_url;
    const mockLogoImage = "https://placehold.co/150x150/2563EB/FFFFFF?text=LOGO";
    
    return (
        <div className="relative min-h-screen bg-[#FAF9F6] pb-32">
            
            <header className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-sw-blue-primary'}`}>
                <div className="w-full px-4 sm:px-8 py-2 flex justify-between items-center overflow-x-hidden">
                    <div className="flex items-center">
                        <img src={logoUrl} alt="StafferWork Logo" className="h-14 max-w-[150px] w-auto object-contain" />
                    </div>
                    <div>
                        {/* Renderiza se houver usuário (user é mais estável que profile) */}
                        {user ? ( 
                            <button onClick={handleProfileClick} className="flex items-center space-x-2">
                                <span className={`text-sm font-medium hidden sm:block transition-colors ${scrolled ? 'text-sw-blue-primary' : 'text-white font-semibold'}`}>
                                    Olá, {userName}
                                </span>
                                
                                <div className={`h-8 w-8 rounded-full object-cover border-2 transition-colors ${scrolled ? 'border-sw-blue-primary' : 'border-white'} overflow-hidden bg-gray-200`}>
                                    {avatarUrl ? (
                                        <img 
                                            src={avatarUrl} 
                                            alt="Avatar" 
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.currentTarget.src = mockLogoImage; }} // Fallback simples
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-700 bg-gray-200">
                                            {avatarFallback}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/auth/register')} 
                                className="bg-sw-blue-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                            >
                                Cadastrar
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-20">
                <Outlet />
            </main>

            {/* NAV BAR (Rodapé) */}
            <div className="fixed bottom-6 inset-x-0 max-w-full sm:max-w-xl sm:mx-auto px-4 bg-white rounded-2xl shadow-lg z-20 border border-gray-100">
                <div className="grid grid-cols-5 h-16">
                    <button onClick={() => navigate('/home')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/home') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-home text-lg"></i>
                        <span className="text-xs mt-1">Início</span>
                    </button>
                    <button onClick={() => navigate('/search')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/search') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-search text-lg"></i>
                        <span className="text-xs mt-1">Buscar</span>
                    </button>
                    <button onClick={() => navigate('/auctions')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/auctions') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-gavel text-lg"></i>
                        <span className="text-xs mt-1">Leilão</span>
                    </button>
                    <button onClick={() => navigate('/chat')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/chat') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-comment-alt text-lg"></i>
                        <span className="text-xs mt-1">Mensagens</span>
                    </button>
                    <button onClick={handleProfileClick} className={`flex flex-col items-center justify-center transition-colors ${isActive('/profile') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-user-circle text-lg"></i>
                        <span className="text-xs mt-1">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;