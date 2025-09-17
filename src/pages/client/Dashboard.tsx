import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import DashboardNavigation from '../../components/DashboardNavigation';
import { FaHistory, FaCreditCard } from 'react-icons/fa';

const ClientDashboard: React.FC = () => {
  const { profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'history' | 'payments'>('history');

  // Componentes de renderização das abas
  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Serviços Contratados</h3>
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FaHistory className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-600">Você ainda não contratou nenhum serviço.</p>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FaCreditCard className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-600">Você ainda não realizou nenhum pagamento.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Dashboard do Cliente</h1>
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
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <FaCreditCard className="inline mr-2" />
            Pagamentos
          </button>
        </div>

        {/* Conteúdo da tab ativa */}
        <div>
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
        </div>
      </div>

      <DashboardNavigation activeTab="dashboard" />
    </div>
  );
};

export default ClientDashboard;