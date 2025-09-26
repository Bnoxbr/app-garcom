import { useState, useCallback } from 'react'; // Importa useCallback e remove useEffect
import { supabase } from '../lib/supabase';
import type { Auction, AuctionBid } from '../types/auction'; // Caminho corrigido
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
    getAuctionById: (auctionId: string) => Promise<{ data: Auction | null; error: any }>; // Corrigido para 'any'
    getMyAuctions: () => Promise<{ data: Auction[] | null; error: Error | null }>;
    updateAuction: (auctionId: string, updates: Partial<Auction>) => Promise<{ data: Auction | null; error: Error | null }>;
    acceptBid: (bidId: string) => Promise<{ error: Error | null }>;
}

export const useAuctions = (): UseAuctionsReturn => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
    const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    const fetchAuctions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('auctions')
                .select('*, creator:profiles(*), category:categories(*)')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setAuctions(data || []);
            
            // Simplesmente para o exemplo, você pode querer lógicas diferentes
            setActiveAuctions(data.filter(a => new Date(a.end_date) > new Date()) || []);

        } catch (err: any) {
            setError(err.message || 'Erro ao buscar leilões');
            console.error('Erro ao buscar leilões:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(async () => {
        await fetchAuctions();
    }, [fetchAuctions]);


    // Buscar leilão por ID
    const getAuctionById = useCallback(async (auctionId: string) => {
        try {
            const { data, error } = await supabase
                .from('auctions')
                .select('*, creator:profiles(*), category:categories(*)')
                .eq('id', auctionId)
                .single();

            return { data, error };
        } catch (err: any) {
            console.error('Erro ao buscar leilão:', err);
            return { data: null, error: err };
        }
    }, []);

    // Buscar leilões do usuário logado
    const getMyAuctions = useCallback(async () => {
        if (!user) return { data: null, error: new Error('Usuário não autenticado') };

        const { data, error } = await supabase
            .from('auctions')
            .select('*, creator:profiles(*), category:categories(*)')
            .eq('creator_id', user.id);

        if (error) {
            console.error('Erro ao buscar meus leilões:', error);
            return { data: null, error };
        }
        
        setMyAuctions(data || []);
        return { data, error: null };
    }, [user]);

    // Função para criar um novo leilão
    const createAuction = useCallback(async (auctionData: Partial<Auction>) => {
        if (!user) return { data: null, error: new Error('Usuário não autenticado') };

        const newAuctionData = {
            ...auctionData,
            creator_id: user.id,
            status: 'open', // Definindo um status padrão
        };

        const { data, error } = await supabase
            .from('auctions')
            .insert([newAuctionData])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar leilão:", error);
            return { data: null, error };
        }

        await refetch();
        return { data, error: null };
    }, [user, refetch]);

    const placeBid = useCallback(async (auctionId: string, bidAmount: number) => {
        if (!user) return { data: null, error: new Error('Usuário não autenticado') };

        const { data, error } = await supabase
            .from('bids')
            .insert([{
                auction_id: auctionId,
                bidder_id: user.id,
                bid_amount: bidAmount
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao fazer lance:", error);
            return { data: null, error };
        }

        return { data, error: null };
    }, [user]);

    const getAuctionBids = useCallback(async (auctionId: string) => {
        const { data, error } = await supabase
            .from('bids')
            .select('*, bidder:profiles(*)')
            .eq('auction_id', auctionId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro ao buscar lances:", error);
            return { data: null, error };
        }

        return { data, error: null };
    }, []);

    const updateAuction = useCallback(async (auctionId: string, updates: Partial<Auction>) => {
        const { data, error } = await supabase
            .from('auctions')
            .update(updates)
            .eq('id', auctionId)
            .select()
            .single();

        if (error) {
            console.error("Erro ao atualizar leilão:", error);
            return { data: null, error };
        }

        await refetch();
        return { data, error: null };
    }, [refetch]);

    const acceptBid = useCallback(async (bidId: string) => {
        // Esta é uma implementação de exemplo. A lógica real pode ser mais complexa.
        // 1. Encontrar o lance
        const { data: bid, error: bidError } = await supabase
            .from('bids')
            .select('*')
            .eq('id', bidId)
            .single();

        if (bidError || !bid) {
            console.error("Erro ao buscar o lance para aceitar:", bidError);
            return { error: bidError || new Error("Lance não encontrado") };
        }

        // 2. Atualizar o status do leilão para 'closed'
        const { error: auctionUpdateError } = await supabase
            .from('auctions')
            .update({ status: 'closed', winner_id: bid.bidder_id })
            .eq('id', bid.auction_id);

        if (auctionUpdateError) {
            console.error("Erro ao fechar o leilão:", auctionUpdateError);
            return { error: auctionUpdateError };
        }
        
        // 3. (Opcional) Atualizar o status do lance para 'accepted'
        const { error: bidUpdateError } = await supabase
            .from('bids')
            .update({ status: 'accepted' })
            .eq('id', bidId);
            
        if (bidUpdateError) {
            console.error("Erro ao aceitar o lance:", bidUpdateError);
            // Pode-se decidir reverter a atualização do leilão aqui se necessário
            return { error: bidUpdateError };
        }

        await refetch();
        return { error: null };
    }, [refetch]);


    // Retorno do hook
    return {
        auctions,
        activeAuctions,
        myAuctions,
        loading,
        error,
        refetch,
        getAuctionById,
        getAuctionBids,
        placeBid,
        acceptBid,
        getMyAuctions,
        createAuction,
        updateAuction,
    };
};