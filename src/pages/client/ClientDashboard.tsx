import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loading } from '../../components';
import { toast } from 'sonner';

type ServicoContratado = any;

const ClientDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuthContext();
    const navigate = useNavigate();
    const [meusServicos, setMeusServicos] = useState<ServicoContratado[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'em_analise' | 'historico'>('em_analise');

    useEffect(() => {
        if (!user) return;
        const fetchMeusServicos = async () => {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_my_hired_services', { c_id: user.id });
            if (error) {
                toast.error("Não foi possível carregar os seus pedidos.");
                console.error(error);
            } else {
                setMeusServicos(data || []);
            }
            setLoading(false);
        };
        fetchMeusServicos();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const channel = supabase
            .channel(`client-dashboard-updates-for-${user.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'servicos_realizados', filter: `id_contratante=eq.${user.id}`},
                (payload) => {
                    if (payload.new.status === 'aguardando_pagamento') {
                         toast.success('Boas notícias! A sua oferta foi aceite.');
                    } else {
                         toast.info('O estado de um dos seus pedidos foi atualizado.');
                    }
                    setMeusServicos(servicosAtuais => 
                        servicosAtuais.map(servico => 
                            servico.servico_id === payload.new.id ? { ...servico, status: payload.new.status } : servico
                        )
                    );
                }
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user]);

    if (authLoading || loading) {
        return <Loading message="A carregar o seu painel de ações..." />;
    }
    
    const servicosEmAnalise = meusServicos.filter(s => ['aguardando_aceite', 'aguardando_pagamento', 'aceito', 'em_andamento'].includes(s.status));
    const servicosHistorico = meusServicos.filter(s => ['concluido', 'recusado', 'cancelado'].includes(s.status));
    
    const renderStatus = (status: string) => {
        switch (status) {
            case 'aguardando_aceite': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">A Aguardar Aceite</span>;
            case 'aguardando_pagamento': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 animate-pulse">Pagamento Pendente</span>;
            case 'aceito': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Confirmado</span>;
            case 'recusado': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">Recusado</span>;
            case 'concluido': return <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">Concluído</span>;
            default: return <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };
    
    const renderServiceList = (listaDeServicos: ServicoContratado[]) => {
        if (listaDeServicos.length === 0) {
            return (
                <div className="text-center border-2 border-dashed rounded-lg p-12 mt-6">
                    <p className="text-gray-500">Nenhum pedido encontrado nesta categoria.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4 mt-6">
                {listaDeServicos.map(servico => (
                    <div key={servico.servico_id} className={`bg-white p-4 rounded-lg shadow-md border-l-4 transition-colors ${servico.status === 'aguardando_pagamento' ? 'border-yellow-400' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800">Profissional: {servico.nome_profissional || 'N/A'}</p>
                                <p className="text-sm text-gray-500">
                                    Data: {new Date(servico.data_servico).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </p>
                            </div>
                            {renderStatus(servico.status)}
                        </div>
                        {servico.status === 'aguardando_pagamento' && (
                            <div className="mt-4 pt-4 border-t border-dashed">
                                <p className="text-sm text-green-700 font-semibold mb-3">✅ O profissional aceitou a sua oferta! Finalize a contratação para garantir a data.</p>
                                <button 
                                    onClick={() => navigate(`/pagamento/${servico.servico_id}`)}
                                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    Pagar Agora e Confirmar Agendamento
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('em_analise')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'em_analise'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Pedidos em Análise
                            {servicosEmAnalise.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {servicosEmAnalise.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('historico')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'historico'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Histórico
                        </button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'em_analise' && renderServiceList(servicosEmAnalise)}
                    {activeTab === 'historico' && renderServiceList(servicosHistorico)}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;