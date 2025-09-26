import React, { useEffect, useState } from 'react';
import { useAuctions } from '@/hooks/useAuctions';
import type { Auction } from '@/types';
import { Loading } from '@/components';

const MyAuctions: React.FC = () => {
  const { getMyAuctions } = useAuctions();
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await getMyAuctions();
        if (fetchError) {
          throw fetchError;
        }
        setMyAuctions(data || []);
        setFilteredAuctions(data || []);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar seus leilões');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [getMyAuctions]);

  useEffect(() => {
    let auctions = [...myAuctions];

    if (searchTerm) {
      auctions = auctions.filter((auction) =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      auctions = auctions.filter((auction) => auction.status === statusFilter);
    }

    setFilteredAuctions(auctions);
  }, [searchTerm, statusFilter, myAuctions]);

  if (loading) {
    return <Loading message="Carregando seus leilões..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Leilões</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por título..."
          className="border p-2 rounded-lg w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="open">Aberto</option>
          <option value="in_progress">Em Andamento</option>
          <option value="closed">Fechado</option>
        </select>
      </div>

      {filteredAuctions.length === 0 ? (
        <p>Nenhum leilão encontrado com os filtros aplicados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAuctions.map((auction) => (
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