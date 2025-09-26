import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuctions } from '../../hooks/useAuctions';
import { useAuthContext } from '../../hooks/useAuth'; 
import type { Auction, AuctionBid } from '../../types/auction';
import { formatCurrency, formatDate } from '../../lib/utils';

const AuctionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getAuctionById, getAuctionBids, acceptBid } = useAuctions();
    const { user } = useAuthContext(); 

    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<AuctionBid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchAuctionDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const auctionResult = await getAuctionById(id);
                    if (auctionResult.error) throw auctionResult.error;
                    if (auctionResult.data) {
                        setAuction(auctionResult.data);
                    } else {
                        setError('Leilão não encontrado.');
                    }

                    const bidsResult = await getAuctionBids(id);
                    if (bidsResult.error) throw bidsResult.error;
                    if (bidsResult.data) {
                        setBids(bidsResult.data);
                    }
                } catch (err: any) {
                    setError(err.message || 'Falha ao buscar dados do leilão.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAuctionDetails();
        }
    }, [id, getAuctionById, getAuctionBids]);

    const handleAcceptBid = async (bidId: string) => {
        if (window.confirm('Tem certeza que deseja aceitar este lance? Esta ação não pode ser desfeita.')) {
            const { error } = await acceptBid(bidId);
            if (error) {
                alert(`Erro ao aceitar o lance: ${error.message}`);
            } else {
                alert('Lance aceito com sucesso! O leilão foi encerrado.');
                navigate('/my-auctions'); // Redireciona para a lista de leilões do usuário
            }
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Carregando...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

    if (!auction) {
        return <div className="container mx-auto p-4">Leilão não encontrado.</div>;
    }

    const isOwner = user?.id === auction.creator_id; 

    return (
        <div className="container mx-auto p-4">
            <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">&larr; Voltar</button>
            <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
            <p className="text-gray-600 mb-2">{auction.description}</p>
            <p className="text-lg font-semibold">Status: <span className={`capitalize ${auction.status === 'open' ? 'text-green-500' : 'text-red-500'}`}>{auction.status}</span></p>
            
            <p className="text-sm text-gray-500 mb-6">Encerra em: {formatDate(auction.end_date)}</p> 

            <h2 className="text-2xl font-bold mb-4">Lances Recebidos</h2>
            {bids.length > 0 ? (
                <ul className="space-y-4">
                    {bids.map((bid) => (
                        <li key={bid.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center">
                            <div>
                                <p className="text-xl font-semibold">{formatCurrency(bid.bid_amount)}</p> 
                                <p className="text-sm text-gray-500">
                                    Feito por: {bid.professional?.full_name || bid.bidder_id}
                                </p>
                            </div>
                            {isOwner && auction.status === 'open' && (
                                <button
                                    onClick={() => handleAcceptBid(bid.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Aceitar Lance
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum lance recebido ainda.</p>
            )}
        </div>
    );
};

export default AuctionDetails;