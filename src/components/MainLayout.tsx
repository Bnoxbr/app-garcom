import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';

// Adicionado o useLocation APENAS para a lógica de cor do menu de rodapé, 
// pois sem ele, o destaque não muda. (Se continuar dando erro, remova esta linha 
// e mantenha a do arquivo estável.)
import { useLocation } from 'react-router-dom'; 

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Adicionado useLocation
    const { user, profile } = useAuthContext();
    const [scrolled, setScrolled] = useState(false);

    const logoUrl = "https://rtcafnmyuybhxkcxkrzz.supabase.co/storage/v1/object/public/imagens%20diversas/logo%20mrstaffer%20corel.png";
    
    // Função isActive (Recomendado manter para o menu)
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
        <div className="relative min-h-screen bg-gray-100 pb-32"> {/* pb-32 para o menu flutuante */}
            
            {/* CORREÇÃO NO HEADER: Aplica bg-mr-dark-blue quando não rolado (Topo da página = Testeira Azul) */}
            <header className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-mr-dark-blue'}`}>
                <div className="w-full px-4 sm:px-8 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={logoUrl} alt="Mr. Staffer Logo" className="h-20 w-auto" />
                    </div>
                    <div>
                        {user ? (
                            <button onClick={handleProfileClick} className="flex items-center space-x-2">
                                {/* CORREÇÃO NO TEXTO: Fica branco no topo (fundo mr-dark-blue) e mr-dark-blue quando rolado (fundo branco) */}
                                <span className={`text-sm font-medium hidden sm:block transition-colors ${scrolled ? 'text-mr-dark-blue' : 'text-white font-semibold'}`}>
                                    Olá, {profile?.full_name?.split(' ')[0] || 'Utilizador'}
                                </span>
                                <img 
                                    src={profile?.avatar_url || 'https://placehold.co/40x40/E2E8F0/4A5568?text=AV'} 
                                    alt="Avatar" 
                                    className={`h-8 w-8 rounded-full object-cover border-2 transition-colors ${scrolled ? 'border-mr-dark-blue' : 'border-white'}`}
                                />
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/auth/register')} 
                                className="bg-mr-dark-blue text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2c3e50] transition-colors"
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

            {/* NAV BAR: FLUTUANTE, ARREDONDADA E CORES MR STAFFR */}
            <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg z-20 border border-gray-100">
                <div className="max-w-4xl mx-auto grid grid-cols-5 h-16">
                    {/* Item 'Início' - ATIVO */}
                    <button onClick={() => navigate('/home')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/home') ? 'text-mr-highlight font-bold' : 'text-gray-500 hover:text-mr-dark-blue'}`}>
                        <i className="fas fa-home text-lg"></i>
                        <span className="text-xs mt-1">Início</span>
                    </button>
                    {/* Item 'Buscar' */}
                    <button onClick={() => navigate('/search')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/search') ? 'text-mr-highlight font-bold' : 'text-gray-500 hover:text-mr-dark-blue'}`}>
                        <i className="fas fa-search text-lg"></i>
                        <span className="text-xs mt-1">Buscar</span>
                    </button>
                    {/* Item 'Leilão' */}
                    <button onClick={() => navigate('/auctions')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/auctions') ? 'text-mr-highlight font-bold' : 'text-gray-500 hover:text-mr-dark-blue'}`}>
                        <i className="fas fa-gavel text-lg"></i>
                        <span className="text-xs mt-1">Leilão</span>
                    </button>
                    {/* Item 'Mensagens' (Chat) */}
                    <button onClick={() => navigate('/chat')} className={`flex flex-col items-center justify-center transition-colors ${isActive('/chat') ? 'text-mr-highlight font-bold' : 'text-gray-500 hover:text-mr-dark-blue'}`}>
                        <i className="fas fa-comment-alt text-lg"></i>
                        <span className="text-xs mt-1">Mensagens</span>
                    </button>
                    {/* Item 'Perfil' */}
                    <button onClick={handleProfileClick} className={`flex flex-col items-center justify-center transition-colors ${isActive('/profile') ? 'text-mr-highlight font-bold' : 'text-gray-500 hover:text-mr-dark-blue'}`}>
                        <i className="fas fa-user-circle text-lg"></i>
                        <span className="text-xs mt-1">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainLayout; 
