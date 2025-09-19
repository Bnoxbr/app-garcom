import React, { useState, useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Booking } from '../types';

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  is_advance_payment: boolean;
  funds_status: string;
  service_confirmed_at?: string;
}

const AdvancePaymentExample: React.FC = () => {
  const { user } = useAuth();
  const { 
    processPayment, 
    registerProviderCheckIn, 
    registerClientCheckIn, 
    checkServiceConfirmation,
    loading 
  } = usePayments();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<{
    confirmed: boolean;
    provider_checked_in: boolean;
    client_checked_in: boolean;
  } | null>(null);

  // Carregar reserva ativa do usuário
  useEffect(() => {
    if (!user) return;

    const fetchBooking = async () => {
      // Buscar a reserva mais recente do usuário (como cliente ou prestador)
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar reserva:', error);
        return;
      }

      setBooking(data);

      // Buscar pagamento associado
      if (data) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('booking_id', data.id)
          .single();

        if (paymentError) {
          console.error('Erro ao buscar pagamento:', paymentError);
          return;
        }

        setPayment(paymentData);

        // Verificar status de confirmação
        if (data.id) {
          const status = await checkServiceConfirmation(data.id);
          setConfirmationStatus(status);
        }
      }
    };

    fetchBooking();
  }, [user, checkServiceConfirmation]);

  // Realizar pagamento antecipado
  const handleAdvancePayment = async () => {
    if (!booking || !user) return;

    const paymentData = {
      amount: booking.valor,
      method: 'pix' as const,
      description: `Pagamento para ${booking.job_description} em ${new Date(booking.data_servico).toLocaleDateString()}`,
      customerEmail: user.email || '',
      customerName: user.user_metadata?.full_name || 'Cliente',
      customerDocument: user.user_metadata?.document || '',
      booking_id: booking.id,
      provider_id: booking.id_profissional,
      client_id: booking.id_contratante,
      is_advance_payment: true // Marca como pagamento antecipado
    };

    const result = await processPayment(paymentData);

    if (result.success) {
      alert('Pagamento processado com sucesso! Os fundos serão liberados após confirmação do serviço.');
      window.location.reload(); // Recarregar para atualizar os dados
    } else {
      alert(`Erro no pagamento: ${result.error}`);
    }
  };

  // Registrar check-in do prestador
  const handleProviderCheckIn = async () => {
    if (!booking) return;
    
    const result = await registerProviderCheckIn(booking.id);
    
    if (result.success) {
      alert('Check-in do prestador registrado com sucesso!');
      window.location.reload();
    } else {
      alert(`Erro no check-in: ${result.error}`);
    }
  };

  // Registrar check-in do cliente
  const handleClientCheckIn = async () => {
    if (!booking) return;
    
    const result = await registerClientCheckIn(booking.id);
    
    if (result.success) {
      alert('Check-in do cliente registrado com sucesso!');
      window.location.reload();
    } else {
      alert(`Erro no check-in: ${result.error}`);
    }
  };

  // Verificar se o usuário atual é o cliente ou o prestador
  const isClient = user && booking?.client_id === user.id;
  const isProvider = user && booking?.provider_id === user.id;

  if (loading) {
    return <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  if (!booking) {
    return <p className="text-gray-700">Nenhuma reserva encontrada.</p>;
  }

  return (
    <div className="p-5 m-4 bg-white rounded-lg shadow-md">
      <p className="text-xl font-bold mb-3">
        Reserva: {booking.job_description}
      </p>
      
      <p className="mb-1">Data: {new Date(booking.data_servico).toLocaleString()}</p>
      <p className="mb-3">Valor: R$ {booking.valor.toFixed(2)}</p>
      
      <div className="flex mt-3 mb-3">
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mr-2 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          Status: {booking.status}
        </span>
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
          Pagamento: {booking.payment_status}
        </span>
      </div>

      {payment && (
        <div className="mt-3 p-3 bg-gray-100 rounded-md">
          <p className="font-bold">Informações de Pagamento:</p>
          <p>Status: {payment.status}</p>
          <p>
            Fundos: {payment.funds_status === 'held' ? 'Retidos' : 'Liberados'}
            {payment.service_confirmed_at && ` (Confirmado em ${new Date(payment.service_confirmed_at).toLocaleString()})`}
          </p>
        </div>
      )}

      {confirmationStatus && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="font-bold">Status de Confirmação:</p>
          <p>
            Prestador: {confirmationStatus.provider_checked_in ? '✅ Check-in realizado' : '❌ Aguardando check-in'}
            {booking.provider_checkin_time && ` (${new Date(booking.provider_checkin_time).toLocaleTimeString()})`}
          </p>
          <p>
            Cliente: {confirmationStatus.client_checked_in ? '✅ Check-in realizado' : '❌ Aguardando check-in'}
            {booking.client_checkin_time && ` (${new Date(booking.client_checkin_time).toLocaleTimeString()})`}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {/* Mostrar botão de pagamento apenas para o cliente e se ainda não pagou */}
        {isClient && booking.payment_status === 'unpaid' && (
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={handleAdvancePayment}>
            Realizar Pagamento Antecipado
          </button>
        )}

        {/* Botão de check-in do prestador */}
        {isProvider && !booking.provider_checked_in && booking.payment_status === 'paid' && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleProviderCheckIn}>
            Registrar Chegada (Prestador)
          </button>
        )}

        {/* Botão de check-in do cliente */}
        {isClient && !booking.client_checked_in && booking.payment_status === 'paid' && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleClientCheckIn}>
            Confirmar Prestador no Local
          </button>
        )}

        {/* Mensagem quando o serviço foi confirmado */}
        {confirmationStatus?.confirmed && (
          <div className="p-3 bg-green-100 rounded-md mt-2">
            <p className="font-bold text-green-700">
              ✅ Serviço confirmado! Os fundos foram liberados para o prestador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancePaymentExample;