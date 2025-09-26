import React, { useEffect, useState } from 'react';
import { useAuctions } from '@/hooks/useAuctions';
import type { Auction } from '@/types';
import { Loading } from '@/components';

const MyAuctions: React.FC = () => {
  const { getMyAuctions } = useAuctions();
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await getMyAuctions();
        if (fetchError) {
          throw fetchError;
        }
        setMyAuctions(data || []);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar seus leilões');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [getMyAuctions]);

  if (loading) {
    return <Loading message="Carregando seus leilões..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Leilões</h1>
      {myAuctions.length === 0 ? (
        <p>Você ainda não criou nenhum leilão.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myAuctions.map((auction) => (
            <div key={auction.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{auction.title}</h2>
              <p className="text-gray-600">Status: {auction.status}</p>
              <p className="text-gray-600">Encerra em: {new Date(auction.end_date).toLocaleDateString()}</p>
              {/* Adicionar mais detalhes e ações aqui */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;