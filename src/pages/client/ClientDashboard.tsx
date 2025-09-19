import React, { useState, useEffect } from "react";
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

// Componente para exibir o estado de carregamento
const Loading = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

// Componente para exibir mensagens de erro
const ErrorMessage = ({ message, onRetry }: { message: string | null; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <p className="text-red-500">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm"
    >
      Tentar Novamente
    </button>
  </div>
);

// Componente para navegação do dashboard
const DashboardNavigation = ({ activeTab }: { activeTab: string }) => {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
      <a href="#" className={`text-center hover:text-gray-800 cursor-pointer ${activeTab === 'home' ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="block text-xs">Início</span>
      </a>
      <a href="#" className={`text-center hover:text-gray-800 cursor-pointer ${activeTab === 'services' ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M8 21h8"/><path d="M12 12v9"/></svg>
        <span className="block text-xs">Serviços</span>
      </a>
      <a href="#" className={`text-center hover:text-gray-800 cursor-pointer ${activeTab === 'agenda' ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        <span className="block text-xs">Agenda</span>
      </a>
      <a href="#" className={`text-center hover:text-gray-800 cursor-pointer ${activeTab === 'dashboard' ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-6"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
        <span className="block text-xs">Dashboard</span>
      </a>
    </div>
  );
};

// --- Código do Dashboard do Cliente ---

interface ServiceWithProfessional {
  id: string;
  tipo_servico: string;
  valor: number;
  data_servico: string;
  status: string;
  profissionais: {
    nome_completo: string;
  } | null;
}

const ClientDashboard: React.FC = () => {
  const { user, profile: authProfile, loading: authLoading, error: authError } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'history' | 'payments'>('history');
  const [services, setServices] = useState<ServiceWithProfessional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('servicos_realizados')
          .select(`
            *,
            profissionais (nome_completo)
          `)
          .eq('id_contratante', user.id)
          .order('data_servico', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setServices(data as ServiceWithProfessional[]);
        }
      } catch (err: any) {
        console.error('Erro ao buscar serviços:', err);
        setError('Erro ao carregar o histórico de serviços. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [user]);

  const renderHistoryTab = () => {
    if (authLoading || loading) {
      return <Loading message="Carregando histórico de serviços..." />;
    }

    if (authError || error) {
      return <ErrorMessage message={authError || error || "Ocorreu um erro."} onRetry={() => window.location.reload()} />;
    }

    if (services.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg className="mx-auto text-gray-400 mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p className="text-gray-600">Você ainda não contratou nenhum serviço.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Serviços Contratados</h3>
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{service.tipo_servico || 'Serviço'}</p>
              <p className="text-sm text-gray-600">
                Profissional: {service.profissionais?.nome_completo || 'Não encontrado'}
              </p>
              <p className="text-xs text-gray-500">
                Data: {new Date(service.data_servico).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-green-600">R$ {service.valor.toFixed(2)}</p>
              <p className={`text-sm font-medium ${service.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {service.status || 'Em andamento'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentsTab = () => {
    if (authLoading || loading) {
      return <Loading message="Carregando histórico de pagamentos..." />;
    }

    if (authError || error) {
      return <ErrorMessage message={authError || error || "Ocorreu um erro."} onRetry={() => window.location.reload()} />;
    }

    if (services.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg className="mx-auto text-gray-400 mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="7" cy="15" r="2"/></svg>
          <p className="text-gray-600">Você ainda não realizou nenhum pagamento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Pagamento por {service.tipo_servico || 'Serviço'}</p>
              <p className="text-sm text-gray-600">
                Profissional: {service.profissionais?.nome_completo || 'Não encontrado'}
              </p>
              <p className="text-xs text-gray-500">
                Data: {new Date(service.data_servico).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-green-600">R$ {service.valor.toFixed(2)}</p>
              <p className={`text-sm font-medium ${service.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {service.status || 'Em andamento'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Dashboard do Cliente</h1>
          <p className="text-gray-600">Olá, {authProfile ? authProfile.nome_fantasia : 'Carregando...'}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs de navegação */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <svg className="inline mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            <svg className="inline mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="7" cy="15" r="2"/></svg>
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
