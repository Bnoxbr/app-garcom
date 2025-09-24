import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';

interface DashboardNavigationProps {
  activeTab?: string;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({ activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  const isProvider = profile?.role === 'profissional';
  const isClient = profile?.role === 'contratante';
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg z-10 border border-gray-100 smooth-transition">
      <div className="grid grid-cols-5 h-16">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
        >
          <i className="fas fa-home text-lg"></i>
          <span className="text-xs mt-1">Início</span>
        </button>
        
        <button 
          onClick={() => navigate('/search')}
          className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
        >
          <i className="fas fa-search text-lg"></i>
          <span className="text-xs mt-1">Buscar</span>
        </button>
        
        <button 
          onClick={() => {
            if (isProvider) {
              navigate('/provider/dashboard');
            } else if (isClient) {
              navigate('/client/dashboard');
            } else if (isAdmin) {
              navigate('/admin/dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center cursor-pointer rounded-2xl smooth-hover ${activeTab === 'dashboard' ? 'text-gray-800' : 'text-gray-500'}`}
        >
          <i className="fas fa-chart-line text-lg"></i>
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        
        <button 
          onClick={() => navigate('/chat')}
          className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
        >
          <i className="fas fa-comment-alt text-lg"></i>
          <span className="text-xs mt-1">Chat</span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
        >
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardNavigation;