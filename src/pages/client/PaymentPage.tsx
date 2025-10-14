import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loading } from '../../components';
import { toast } from 'sonner';

type ServiceDetails = any;

const PaymentPage: React.FC = () => {
    const { servicoId } = useParams<{ servicoId: string }>();
    const navigate = useNavigate();
    const [servico, setServico] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!servicoId) {
            toast.error("ID do serviço não encontrado.");
            navigate('/client/dashboard');
            return;
        }

        const fetchServiceDetails = async () => {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_service_details_for_payment', {
                p_servico_id: servicoId
            });

            if (error || !data || data.length === 0) {
                toast.error("Não foi possível carregar os detalhes do serviço.");
                console.error(error);
                navigate('/client/dashboard');
            } else {
                setServico(data[0]);
            }
            setLoading(false);
        };

        fetchServiceDetails();
    }, [servicoId, navigate]);

    const handleConfirmPayment = async () => {
        if (!servicoId) return;
        setProcessing(true);
        const toastId = toast.loading("A processar pagamento...");

        // Simulação de pagamento bem-sucedido
        // No futuro, aqui entraria a lógica do gateway de pagamento
        const { error } = await supabase
            .from('servicos_realizados')
            .update({ status: 'aceito' }) // Atualiza o status para 'aceito' (confirmado)
            .eq('id', servicoId);

        if (error) {
            toast.error("Ocorreu um erro ao confirmar o pagamento.", { id: toastId });
            console.error(error);
        } else {
            toast.success("Pagamento confirmado! O seu serviço está agendado.", { id: toastId, duration: 4000 });
            navigate('/client/dashboard'); // Volta para o painel do cliente
        }
        setProcessing(false);
    };

    if (loading) {
        return <Loading message="A carregar detalhes do pagamento..." />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Confirmar Pagamento</h1>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">Profissional:</span><span className="font-semibold">{servico?.nome_profissional}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Data:</span><span className="font-semibold">{new Date(servico?.data_servico).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span></div>
                    <div className="flex justify-between text-lg border-t pt-2 mt-2"><span className="text-gray-600 font-bold">Total a Pagar:</span><span className="font-bold text-green-600">R$ {Number(servico?.valor || 0).toFixed(2).replace('.', ',')}</span></div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 rounded-md text-sm mb-6">
                    <p><i className="fas fa-shield-alt mr-2"></i>Lembre-se: o seu pagamento fica retido com segurança e só é libertado para o profissional após a conclusão do serviço.</p>
                </div>

                <button
                    onClick={handleConfirmPayment}
                    disabled={processing}
                    className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                    {processing ? 'A processar...' : 'Confirmar Pagamento e Agendar'}
                </button>
                 <button onClick={() => navigate('/client/dashboard')} className="w-full mt-3 text-center text-sm text-gray-600 hover:underline">
                    Cancelar e Voltar
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;