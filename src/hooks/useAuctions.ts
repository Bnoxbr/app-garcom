import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Auction, AuctionBid, Profile } from '../types';
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
        .select('*, creator:profiles(*)')
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
        .select('*, creator:profiles(*)')
        .eq('id', auctionId)
        .single();

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao buscar leilão:', err);
      return { data: null, error: err };
    }
  };

  // Criar um novo leilão
  const createAuction = async (auctionData: Partial<Auction>) => {
    try {
      if (!user || !profile) {
        throw new Error('Usuário não autenticado');
      }

      const newAuction = {
        ...auctionData,
        creator_id: profile.id,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('auctions')
        .insert([newAuction])
        .select()
        .single();

      if (!error) {
        // Atualizar a lista de leilões
        await fetchAuctions();
      }

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao criar leilão:', err);
      return { data: null, error: err };
    }
  };

  // Atualizar um leilão existente
  const updateAuction = async (auctionId: string, updates: Partial<Auction>) => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', auctionId)
        .select()
        .single();

      if (!error) {
        // Atualizar a lista de leilões
        await fetchAuctions();
      }

      return { data, error };
    } catch (err: any) {
      console.error('Erro ao atualizar leilão:', err);
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
      if (profile.role === 'professional') {
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
        .select('*, bidder:profiles(*)')
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
      if (bidData.auction.creator_id !== profile?.id) {
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
  const activeAuctions = auctions.filter(auction => auction.status === 'active');

  // Filtrar meus leilões (criados pelo usuário atual)
  const myAuctions = auctions.filter(auction => auction.creator_id === profile?.id);

  return {
    auctions,
    activeAuctions,
    myAuctions,
    loading,
    error,
    refetch,
    createAuction,
    placeBid,
    getAuctionBids,
    getAuctionById,
    updateAuction,
    acceptBid,
  };
};