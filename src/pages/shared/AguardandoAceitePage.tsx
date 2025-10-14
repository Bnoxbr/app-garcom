import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase'; // Ajuste o caminho se necessário

import { Loading } from '@/components'; // Ajuste o caminho se necessário



const AguardandoAceitePage: React.FC = () => {

    const { servicoId } = useParams<{ servicoId: string }>();

    const navigate = useNavigate();

    const [statusVisualizacao, setStatusVisualizacao] = useState('ENVIADA');

    const [tempoRestante, setTempoRestante] = useState(300); // 5 minutos em segundos



    // Efeito para o cronômetro regressivo

    useEffect(() => {

        if (tempoRestante <= 0) {

            navigate('/'); // Ou para uma página de "oferta expirada"

            return;

        }



        const timer = setInterval(() => {

            setTempoRestante(prev => prev - 1);

        }, 1000);



        return () => clearInterval(timer);

    }, [tempoRestante, navigate]);



    // Efeito para escutar as atualizações em tempo real do Supabase

    useEffect(() => {

        if (!servicoId) return;



        const channel = supabase

            .channel(`espera-servico-${servicoId}`)

            .on(

                'postgres_changes',

                {

                    event: 'UPDATE',

                    schema: 'public',

                    table: 'servicos_realizados',

                    filter: `id=eq.${servicoId}`,

                },

                (payload) => {

                    const novoStatusVisualizacao = payload.new.status_visualizacao_prestador;

                    const novoStatusPrincipal = payload.new.status;

                    

                    if (novoStatusVisualizacao) {

                        setStatusVisualizacao(novoStatusVisualizacao);

                    }



                    if (novoStatusPrincipal === 'aguardando_pagamento') {

                        // AQUI: Redirecionar para a página de pagamento

                        // Ex: navigate(`/pagamento/${servicoId}`);

                        alert('Oferta aceita! Redirecionando para pagamento...');

                    } else if (novoStatusPrincipal === 'recusado' || novoStatusPrincipal === 'expirado') {

                        // AQUI: Redirecionar para uma página de oferta recusada/expirada

                        // Ex: navigate(`/oferta-recusada/${servicoId}`);

                        alert('Sua oferta foi recusada ou expirou.');

                        navigate('/');

                    }

                }

            )

            .subscribe();



        return () => {

            supabase.removeChannel(channel);

        };

    }, [servicoId, navigate]);



    const formatarTempo = (segundos: number) => {

        const min = Math.floor(segundos / 60);

        const seg = segundos % 60;

        return `${min}:${seg < 10 ? '0' : ''}${seg}`;

    };



    const renderStatusMessage = () => {

        switch (statusVisualizacao) {

            case 'ENVIADA':

                return "✔️ Oferta enviada! Contatando o profissional...";

            case 'VISUALIZADA':

                return "👀 O profissional está analisando sua oferta agora mesmo!";

            default:

                return "Aguardando resposta do profissional...";

        }

    };



    return (

        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">

            <Loading message="" size="lg" />

            <h1 className="text-3xl font-bold text-gray-800 mt-6">Aguardando o aceite...</h1>

            <p className="text-lg text-gray-600 mt-2">{renderStatusMessage()}</p>



            <div className="mt-8">

                <p className="text-sm text-gray-500">Tempo restante para o profissional responder:</p>

                <p className="text-6xl font-mono font-bold text-gray-900 mt-2">{formatarTempo(tempoRestante)}</p>

            </div>

            

            <button 

                onClick={() => navigate('/')}

                className="mt-12 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"

            >

                Cancelar e voltar ao início

            </button>

        </div>

    );

};



export default AguardandoAceitePage;

