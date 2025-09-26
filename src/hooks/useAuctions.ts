import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Auction, AuctionBid } from '../types';
import { useAuthContext } from './useAuth';

interface UseAuctionsReturn {
  auctions: Auction[];
  activeAuctions: Auction[];
  myAuctions: Auction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createAuction: (auctionData: Partial<Auction>) => Promise<{ data: Auction | null; error: Error | null }>;
  placeBid: (auctionId: string, bidAmount: number) => Promise<{ data: AuctionBid | null; error: Error | null }>;
  getAuctionBids: (auctionId: string) => Promise<{ data: AuctionBid[] | null; error: Error | null }>;
  getAuctionById: (auctionId: string) => Promise<{ data: Auction | null; error: Error | null }>;
  getMyAuctions: () => Promise<{ data: Auction[] | null; error: Error | null }>; // Adiciona a nova função
  updateAuction: (auctionId: string, updates: Partial<Auction>) => Promise<{ data: Auction | null; error: Error | null }>;
  acceptBid: (bidId: string) => Promise<{ error: Error | null }>;
}

export const useAuctions = (): UseAuctionsReturn => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuthContext();

  // Calcular taxa de serviço (10%)
  const calculateServiceFee = (amount: number): number => {
    return parseFloat((amount * 0.1).toFixed(2));
  };

  // Buscar todos os leilões
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('auctions')
        .select('*, creator:contratantes(*)')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setAuctions(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar leilões');
      console.error('Erro ao buscar leilões:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar leilão por ID
  const getAuctionById = async (auctionId: string) => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*, creator:contratantes(*)')
        .eq('id', auctionId)
        .single();

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao buscar leilão:', err);
      return { data: null, error: err };
    }
  };

  // Buscar leilões do usuário logado
  const getMyAuctions = async () => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado para buscar seus leilões.');
      }

      const { data, error } = await supabase
        .from('auctions')
        .select('*, creator:contratantes(*)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao buscar meus leilões:', err);
      return { data: null, error: err };
    }
  };

  // Criar um novo leilão
  const createAuction = async (auctionData: { title: string; description: string; category_id: number; end_date: string; }) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado para criar um leilão.');
      }

      const newAuction = {
        client_id: user.id, // Chave estrangeira para o criador
        title: auctionData.title,
        description: auctionData.description,
        category_id: auctionData.category_id,
        end_date: auctionData.end_date,
        status: 'open', // Status inicial
      };

      const { data, error } = await supabase
        .from('auctions')
        .insert(newAuction)
        .select()
        .single();

      if (error) throw error;

      // Opcional: re-buscar leilões ou adicionar o novo localmente
      await fetchAuctions();

      return { data, error: null };
    } catch (err: any) {
      console.error('Erro ao criar leilão:', err);
      return { data: null, error: err };
    }
  };

  // Fazer um lance em um leilão
  const placeBid = async (auctionId: string, bidAmount: number) => {
    try {
      if (!user || !profile) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se o profissional tem avaliação mínima (3.5)
      if (profile.role === 'profissional') {
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('rating')
          .eq('profile_id', profile.id)
          .single();

        if (!professionalData || professionalData.rating < 3.5) {
          throw new Error('Apenas profissionais com avaliação mínima de 3.5 podem participar de leilões');
        }
      }

      // Calcular taxa de serviço
      const serviceFee = calculateServiceFee(bidAmount);
      const totalAmount = bidAmount + serviceFee;

      const newBid = {
        auction_id: auctionId,
        bidder_id: profile.id,
        amount: bidAmount,
        service_fee: serviceFee,
        total_amount: totalAmount,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('auction_bids')
        .insert([newBid])
        .select()
        .single();

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao fazer lance:', err);
      return { data: null, error: err };
    }
  };

  // Buscar lances de um leilão
  const getAuctionBids = async (auctionId: string) => {
    try {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('*, bidder:profissionais(*)')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: true });

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao buscar lances:', err);
      return { data: null, error: err };
    }
  };

  // Aceitar um lance
  const acceptBid = async (bidId: string) => {
    try {
      // Buscar informações do lance
      const { data: bidData, error: bidError } = await supabase
        .from('auction_bids')
        .select('*, auction:auctions(*)')
        .eq('id', bidId)
        .single();

      if (bidError || !bidData) {
        throw bidError || new Error('Lance não encontrado');
      }

      // Verificar se o usuário é o criador do leilão
      if (profile?.role !== 'contratante' || (bidData.auction && bidData.auction.creator_id !== profile?.id)) {
        throw new Error('Apenas o criador do leilão pode aceitar lances');
      }

      // Atualizar o status do lance para 'accepted'
      const { error: updateBidError } = await supabase
        .from('auction_bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (updateBidError) {
        throw updateBidError;
      }

      // Atualizar o status do leilão para 'completed'
      const { error: updateAuctionError } = await supabase
        .from('auctions')
        .update({
          status: 'completed',
          winning_bid_id: bidId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bidData.auction_id);

      if (updateAuctionError) {
        throw updateAuctionError;
      }

      // 3. Criar um novo booking a partir dos dados do leilão e do lance
      const { error: createBookingError } = await supabase.from('bookings').insert([
        {
          client_id: bidData.auction.creator_id,
          provider_id: bidData.bidder_id,
          service_type: bidData.auction.category_id || 'geral', // Usar category_id ou um valor padrão
          event_date: bidData.auction.event_date,
          duration_hours: bidData.auction.duration_hours,
          hourly_rate: bidData.amount / (bidData.auction.duration_hours || 1), // Calcular valor por hora
          total_amount: bidData.amount,
          event_address: JSON.parse(bidData.auction.location || '{}'), // Converter string JSON para objeto
          description: bidData.auction.description,
          status: 'confirmed',
          payment_status: 'unpaid',
        },
      ]);

      if (createBookingError) {
        // Idealmente, usar uma transação para reverter as alterações anteriores
        console.error('Erro ao criar booking, idealmente reverteria a transação:', createBookingError);
        throw createBookingError;
      }

      // Atualizar a lista de leilões
      await fetchAuctions();

      return { error: null };
    } catch (err: any) {
      console.error('Erro ao aceitar lance:', err);
      return { error: err };
    }
  };

  // Recarregar os leilões
  const refetch = async () => {
    await fetchAuctions();
  };

  // Carregar leilões ao montar o componente
  useEffect(() => {
    fetchAuctions();
  }, []);

  // Filtrar leilões ativos
  const activeAuctions = auctions.filter(auction => auction.status === 'open');

  // Filtrar meus leilões (criados pelo usuário atual, se for contratante)
  const myAuctions = profile?.role === 'contratante' 
    ? auctions.filter(auction => auction.creator_id === profile?.id)
    : [];

  return {
    auctions,
    activeAuctions: auctions.filter(a => a.status === 'open'),
    myAuctions: auctions.filter(a => a.client_id === user?.id),
    loading,
    error,
    refetch,
    createAuction,
    placeBid,
    getAuctionBids,
    getAuctionById,
    getMyAuctions, // Exporta a nova função
    updateAuction,
    acceptBid,
  };
};