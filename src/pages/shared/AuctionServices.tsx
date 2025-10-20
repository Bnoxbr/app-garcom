import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import NavigationPlaceholder from '../../components/ui/NavigationPlaceholder';
import { useAuthContext } from '../../hooks/useAuth';

// Interfaces (mantidas)
interface Professional {
  name: string;
  photo: string;
  rating: number;
  reviews: number;
}

interface Auction {
  id: number;
  category: string;
  professional: Professional;
  initialPrice: number;
  currentBid: number;
  timeRemaining: number;
  participants: number;
  status: string;
}

interface BidHistory {
  id: number;
  auctionId: number;
  category: string;
  professional: string;
  bidAmount: number;
  date: string;
  status: 'vencendo' | 'perdendo' | 'finalizado';
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const AuctionServices: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ativos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - será substituído por hooks do Supabase (mantidos)
  const categories: Category[] = [
    { id: 0, name: 'Todos', icon: 'fas fa-th-large' },
    { id: 1, name: 'Garçom', icon: 'fas fa-user-tie' },
    { id: 2, name: 'Cozinheiro', icon: 'fas fa-utensils' },
    { id: 3, name: 'Barman', icon: 'fas fa-cocktail' },
    { id: 4, name: 'Auxiliar', icon: 'fas fa-hands-helping' },
    { id: 5, name: 'Gerente', icon: 'fas fa-user-cog' },
  ];

  const auctions: Auction[] = [
    {
      id: 1,
      category: 'Garçom',
      professional: {
        name: 'Mariana Silva',
        photo: '', // Placeholder será usado
        rating: 4.8,
        reviews: 156,
      },
      initialPrice: 120,
      currentBid: 145,
      timeRemaining: 3600,
      participants: 12,
      status: 'ativo',
    },
    {
      id: 2,
      category: 'Cozinheiro',
      professional: {
        name: 'Carlos Oliveira',
        photo: '', // Placeholder será usado
        rating: 4.9,
        reviews: 203,
      },
      initialPrice: 200,
      currentBid: 235,
      timeRemaining: 1800,
      participants: 18,
      status: 'ativo',
    },
    {
      id: 3,
      category: 'Garçom',
      professional: {
        name: 'Ana Paula',
        photo: '', // Placeholder será usado
        rating: 4.7,
        reviews: 98,
      },
      initialPrice: 110,
      currentBid: 130,
      timeRemaining: 5400,
      participants: 8,
      status: 'ativo',
    },
    {
      id: 4,
      category: 'Barman',
      professional: {
        name: 'Rafael Santos',
        photo: '', // Placeholder será usado
        rating: 4.6,
        reviews: 89,
      },
      initialPrice: 150,
      currentBid: 180,
      timeRemaining: 2700,
      participants: 9,
      status: 'ativo',
    },
    {
      id: 5,
      category: 'Auxiliar',
      professional: {
        name: 'Fernanda Costa',
        photo: '', // Placeholder será usado
        rating: 4.5,
        reviews: 28,
      },
      initialPrice: 90,
      currentBid: 105,
      timeRemaining: 4500,
      participants: 5,
      status: 'ativo',
    },
  ];

  const bidHistory: BidHistory[] = [
    {
      id: 1,
      auctionId: 2,
      category: 'Cozinheiro',
      professional: 'Carlos Oliveira',
      bidAmount: 220,
      date: '05/05/2025 14:30',
      status: 'perdendo',
    },
    {
      id: 2,
      auctionId: 1,
      category: 'Garçom',
      professional: 'Mariana Silva',
      bidAmount: 145,
      date: '05/05/2025 13:15',
      status: 'vencendo',
    },
    {
      id: 3,
      auctionId: 4,
      category: 'Barman',
      professional: 'Rafael Santos',
      bidAmount: 165,
      date: '04/05/2025 18:45',
      status: 'finalizado',
    },
  ];

  // Filtrar leilões por categoria e termo de busca (mantido)
  const filteredAuctions = auctions.filter(
    (auction) =>
      (selectedCategory === 'Todos' || auction.category === selectedCategory) &&
      (auction.professional.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        auction.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Formatar tempo restante (mantido)
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Formatar valor em reais (mantido)
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Abrir modal de lance (mantido)
  const handleOpenBidModal = (auction: Auction) => {
    // Verificar se o usuário está autenticado
    if (!user) {
      setToastMessage('Faça login para dar um lance');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/auth/login', { state: { from: '/auctions' } });
      }, 2000);
      return;
    }
    
    setSelectedAuction(auction);
    setBidAmount((auction.currentBid + 5).toString());
    setShowBidModal(true);
  };

  // Enviar lance (mantido)
  const handleSubmitBid = () => {
    // Verificar se o usuário está autenticado
    if (!user) {
      setToastMessage('Faça login para dar um lance');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/auth/login', { state: { from: '/auctions' } });
      }, 2000);
      return;
    }
    
    if (!selectedAuction || !bidAmount) return;

    const bidValue = Number(bidAmount);
    if (bidValue <= selectedAuction.currentBid) {
      setToastMessage('O lance deve ser maior que o lance atual');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Aqui será implementada a lógica de envio via Supabase
    console.log('Enviando lance:', bidValue);
    setToastMessage('Lance enviado com sucesso!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowBidModal(false);
  };

  // Atualizar contagem regressiva (mantido)
  useEffect(() => {
    const timer = setInterval(() => {
      // Aqui será implementada a lógica de atualização via Supabase
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Header */}
      {/* SUBSTITUÍDO: Fundo degradê cinza por bg-mr-dark-blue (Azul Profundo) */}
      <div className="fixed top-0 w-full bg-mr-dark-blue text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <NavigationPlaceholder to="/back" className="cursor-pointer">
            <i className="fas fa-arrow-left text-lg"></i>
          </NavigationPlaceholder>
          <h1 className="text-xl font-bold">Leilão de Serviços</h1>
          {/* ALTERAÇÃO: hover:bg-gray-800 (Fica muito escuro no mr-dark-blue) -> hover:bg-[#2c3e50] (tom mais claro de hover) */}
          <button className="p-2 rounded-full hover:bg-[#2c3e50] cursor-pointer">
            <i className="fas fa-bell text-lg"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16 px-4">
        {/* Search Bar (mantido) */}
        <div className="relative mb-6 mt-4">
          <input
            type="text"
            placeholder="Buscar leilões..."
            className="w-full py-3 px-4 pr-10 rounded-lg bg-white shadow-sm border-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer ${
                  // SUBSTITUÍDO: bg-gray-800 por bg-mr-dark-blue
                  selectedCategory === category.name
                    ? 'bg-mr-dark-blue text-white'
                    : 'bg-white shadow-sm'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <i className={`${category.icon} text-xl mb-1`}></i>
                <span className="text-xs whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs (mantido) */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'ativos' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => {
                if (activeTab === 'ativos') {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    setIsRefreshing(false);
                    setToastMessage('Lista de leilões atualizada');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }, 1000);
                } else {
                  setActiveTab('ativos');
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {isRefreshing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-gavel"></i>
                )}
                <span>Leilões Ativos</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'historico'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('historico')}
            >
              Histórico de Lances
            </button>
          </div>
        </div>

        {/* Active Auctions List */}
        {activeTab === 'ativos' && (
          <div className="space-y-4">
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <PlaceholderImage 
                            type="profile" 
                            size="48x48" 
                            className="w-full h-full object-cover" 
                            alt={auction.professional.name}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {auction.professional.name}
                          </h4>
                          <div className="flex items-center text-sm">
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                              {auction.category}
                            </span>
                            <div className="flex items-center text-yellow-500 ml-2">
                              <i className="fas fa-star text-xs mr-1"></i>
                              <span className="text-xs">
                                {auction.professional.rating}
                              </span>
                              <span className="text-gray-500 text-xs ml-1">
                                ({auction.professional.reviews})
                              </span>
                            </div>
                        </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <i className="fas fa-clock mr-1"></i>
                          <span>
                            {formatTimeRemaining(auction.timeRemaining)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-users mr-1"></i>
                          <span>{auction.participants} participantes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <div>
                        <div className="text-xs text-gray-500">
                          Preço inicial
                        </div>
                        <div className="font-medium">
                          {formatCurrency(auction.initialPrice)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Lance atual</div>
                        {/* ALTERAÇÃO: text-gray-800 -> text-mr-dark-blue */}
                        <div className="font-semibold text-mr-dark-blue">
                          {formatCurrency(auction.currentBid)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenBidModal(auction)}
                        // SUBSTITUÍDO: bg-gray-800 por bg-mr-dark-blue
                        className="bg-mr-dark-blue text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                      >
                        Dar Lance
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <i className="fas fa-search text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-600">
                  Nenhum leilão encontrado para esta categoria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bid History (mantido) */}
        {activeTab === 'historico' && (
          <div className="space-y-4">
            {bidHistory.length > 0 ? (
              bidHistory.map((bid) => (
                <div key={bid.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{bid.professional}</h4>
                      <p className="text-sm text-gray-600">{bid.category}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bid.status === 'vencendo'
                          ? 'bg-green-100 text-green-800'
                          : bid.status === 'perdendo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bid.status === 'vencendo'
                        ? 'Vencendo'
                        : bid.status === 'perdendo'
                        ? 'Perdendo'
                        : 'Finalizado'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">{bid.date}</div>
                    <div className="font-medium">
                      {formatCurrency(bid.bidAmount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <i className="fas fa-gavel text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-600">
                  Você ainda não fez nenhum lance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {/* ALTERAÇÃO: Mudando para Nav Bar flutuante e arredondada (como na Home) */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg z-10 border border-gray-100 smooth-transition">
        <div className="grid grid-cols-5 h-16">
          <NavigationPlaceholder
            to="/home"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Início</span>
          </NavigationPlaceholder>
          <NavigationPlaceholder
            to="/search"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1">Buscar</span>
          </NavigationPlaceholder>
          {/* Item ATIVO 'Leilões' - SUBSTITUÍDO: text-gray-800 por text-mr-highlight (Vermelho) */}
          <div className="flex flex-col items-center justify-center text-mr-highlight cursor-pointer">
            <i className="fas fa-gavel text-lg"></i>
            <span className="text-xs mt-1">Leilões</span>
          </div>
          <NavigationPlaceholder
            to="/chat"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-comment-alt text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </NavigationPlaceholder>
          <NavigationPlaceholder
            to="/profile"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
          </NavigationPlaceholder>
        </div>
      </div>

      {/* Bid Modal (mantido) */}
      {showBidModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fazer Lance</h3>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <PlaceholderImage 
                    type="profile" 
                    size="48x48" 
                    className="w-full h-full object-cover" 
                    alt={selectedAuction.professional.name}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {selectedAuction.professional.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedAuction.category}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Lance atual:</span>
                  <span>{formatCurrency(selectedAuction.currentBid)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Lance mínimo:</span>
                  <span>{formatCurrency(selectedAuction.currentBid + 5)}</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu lance (R$)
                </label>
                <input
                  type="number"
                  min={selectedAuction.currentBid + 5}
                  step="5"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-right"
                />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span>Taxa de serviço (5%):</span>
                  <span>{formatCurrency(Number(bidAmount) * 0.05)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(Number(bidAmount) * 1.05)}</span>
                </div>
              </div>
              <button
                onClick={handleSubmitBid}
                // SUBSTITUÍDO: bg-gray-800 por bg-mr-dark-blue
                className="w-full bg-mr-dark-blue text-white py-3 rounded-lg font-medium cursor-pointer"
              >
                Confirmar Lance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (mantido) */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AuctionServices;