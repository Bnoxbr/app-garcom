import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom'; 

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuthContext();
    const [scrolled, setScrolled] = useState(false);

    // [NOVO BRANDING] URL do logo da StafferWork
    const logoUrl = "https://rtcafnmyuybhxkcxkrzz.supabase.co/storage/v1/object/public/imagens%20diversas/StafferWork2.png"; 
    
    // Função isActive (Mantida para o menu)
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
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => document.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleProfileClick = () => {
        if (user && profile) {
            navigate('/profile');
        } else {
            navigate('/auth/login');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FAF9F6] pb-32">
            
            {/* HEADER: Fundo [mr-dark-blue] -> [sw-blue-primary] */}
            <header className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-sw-blue-primary'}`}>
                {/* Contêiner interno do header: Adicionado overflow-x-hidden e largura do logo corrigida */}
                <div className="w-full px-4 sm:px-8 py-2 flex justify-between items-center overflow-x-hidden">
                    <div className="flex items-center">
                        {/* LOGO: Limitado a largura máxima (max-w-[150px]) para responsividade */}
                        <img src={logoUrl} alt="StafferWork Logo" className="h-14 max-w-[150px] w-auto object-contain" />
                    </div>
                    <div>
                        {user ? (
                            <button onClick={handleProfileClick} className="flex items-center space-x-2">
                                <span className={`text-sm font-medium hidden sm:block transition-colors ${scrolled ? 'text-sw-blue-primary' : 'text-white font-semibold'}`}>
                                    Olá, {profile?.full_name?.split(' ')[0] || 'Utilizador'}
                                </span>
                                <img 
                                    src={profile?.avatar_url || 'https://placehold.co/40x40/E2E8F0/4A5568?text=AV'} 
                                    alt="Avatar" 
                                    className={`h-8 w-8 rounded-full object-cover border-2 transition-colors ${scrolled ? 'border-sw-blue-primary' : 'border-white'}`}
                                />
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

            {/* NAV BAR: flutuante, arredondada e cores migradas */}
            <div className="fixed bottom-6 inset-x-0 max-w-full sm:max-w-xl sm:mx-auto px-4 bg-white rounded-2xl shadow-lg z-20 border border-gray-100">
                <div className="grid grid-cols-5 h-16">
                    {/* Item 'Início' - ATIVO: text-sw-yellow-accent */}
                    <button onClick={() => navigate('/home')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/home') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-home text-lg"></i>
                        <span className="text-xs mt-1">Início</span>
                    </button>
                    {/* Item 'Buscar' */}
                    <button onClick={() => navigate('/search')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/search') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-search text-lg"></i>
                        <span className="text-xs mt-1">Buscar</span>
                    </button>
                    {/* Item 'Leilão' */}
                    <button onClick={() => navigate('/auctions')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/auctions') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-gavel text-lg"></i>
                        <span className="text-xs mt-1">Leilão</span>
                    </button>
                    {/* Item 'Mensagens' (Chat) */}
                    <button onClick={() => navigate('/chat')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/chat') ? 'text-sw-yellow-accent font-bold' : 'text-gray-500 hover:text-sw-blue-primary'}`}>
                        <i className="fas fa-comment-alt text-lg"></i>
                        <span className="text-xs mt-1">Mensagens</span>
                    </button>
                    {/* Item 'Perfil' */}
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