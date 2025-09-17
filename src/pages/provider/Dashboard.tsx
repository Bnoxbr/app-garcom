import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import DashboardNavigation from '../../components/DashboardNavigation';
import { FaStar, FaHistory, FaMoneyBillWave } from 'react-icons/fa';

const ProviderDashboard: React.FC = () => {
  const { profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'history' | 'earnings' | 'ratings'>('history');

  // Componentes de renderização das abas
  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Histórico de Serviços</h3>
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FaHistory className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-600">Você ainda não possui histórico de serviços.</p>
      </div>
    </div>
  );

  const renderEarningsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Resumo de Ganhos</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Ganho</p>
          <p className="text-xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pendente</p>
          <p className="text-xl font-bold text-yellow-600">R$ 0,00</p>
        </div>
      </div>
    </div>
  );

  const renderRatingsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Avaliações</h3>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <div className="flex mr-2">
            {Array(5).fill(0).map((_, i) => (
              <FaStar 
                key={i} 
                className="text-gray-300" 
                size={24} 
              />
            ))}
          </div>
          <span className="text-xl font-bold">0.0</span>
        </div>
        <p className="text-center text-gray-600">0 avaliações recebidas</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Dashboard do Prestador</h1>
          <p className="text-gray-600">Olá, {profile?.name}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs de navegação */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <FaHistory className="inline mr-2" />
            Histórico
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'earnings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <FaMoneyBillWave className="inline mr-2" />
            Ganhos
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'ratings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <FaStar className="inline mr-2" />
            Avaliações
          </button>
        </div>

        {/* Conteúdo da tab ativa */}
        <div>
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'earnings' && renderEarningsTab()}
          {activeTab === 'ratings' && renderRatingsTab()}
        </div>
      </div>

      <DashboardNavigation activeTab="dashboard" />
    </div>
  );
};

export default ProviderDashboard;