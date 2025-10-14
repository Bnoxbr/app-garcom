import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuthContext();
    const [scrolled, setScrolled] = useState(false);

    const logoUrl = "https://rtcafnmyuybhxkcxkrzz.supabase.co/storage/v1/object/public/imagens%20diversas/logo-mrstaffer.jpg";

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
        <div className="relative min-h-screen bg-gray-100 pb-24">
            <header className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                <div className="max-w-4xl mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={logoUrl} alt="Mr. Staffer Logo" className="h-14 w-auto" />
                    </div>
                    <div>
                        {user ? (
                             <button onClick={handleProfileClick} className="flex items-center space-x-2">
                                 <span className={`text-sm font-medium hidden sm:block transition-colors ${scrolled ? 'text-gray-700' : 'text-white font-semibold'}`}>
                                     Olá, {profile?.full_name?.split(' ')[0] || 'Utilizador'}
                                 </span>
                                 <img 
                                    src={profile?.avatar_url || 'https://placehold.co/40x40/E2E8F0/4A5568?text=AV'} 
                                    alt="Avatar" 
                                    className="h-8 w-8 rounded-full object-cover border-2 border-white"
                                />
                             </button>
                        ) : (
                            // --- ALTERAÇÃO FEITA AQUI ---
                            <button 
                                onClick={() => navigate('/auth/register')} 
                                className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
                <div className="max-w-4xl mx-auto grid grid-cols-5 h-16">
                    <button onClick={() => navigate('/home')} className="flex flex-col items-center justify-center text-blue-600 font-bold">
                        <i className="fas fa-home text-lg"></i>
                        <span className="text-xs mt-1">Início</span>
                    </button>
                    <button onClick={() => navigate('/search')} className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
                        <i className="fas fa-search text-lg"></i>
                        <span className="text-xs mt-1">Buscar</span>
                    </button>
                    <button onClick={() => navigate('/auctions')} className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
                        <i className="fas fa-gavel text-lg"></i>
                        <span className="text-xs mt-1">Leilão</span>
                    </button>
                    <button onClick={() => navigate('/chat')} className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
                        <i className="fas fa-comment-alt text-lg"></i>
                        <span className="text-xs mt-1">Mensagens</span>
                    </button>
                    <button onClick={handleProfileClick} className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
                        <i className="fas fa-user-circle text-lg"></i>
                        <span className="text-xs mt-1">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;