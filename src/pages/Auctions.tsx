import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../hooks/useAuth";
import { useAuctions } from "../hooks/useAuctions";
import { Auction, AuctionBid } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaArrowLeft, FaSearch, FaFilter, FaHistory, FaHome, FaComments, FaUser } from "react-icons/fa";
import { MdAuction } from "react-icons/md";
import { toast } from "react-hot-toast";

const AuctionsPage: React.FC = () => {
  const router = useRouter();
  const { user, profile } = useAuthContext();
  const { 
    auctions, 
    activeAuctions, 
    myAuctions, 
    loading, 
    error, 
    refetch, 
    placeBid, 
    getAuctionBids 
  } = useAuctions();

  const [activeTab, setActiveTab] = useState("ativos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [auctionBids, setAuctionBids] = useState<AuctionBid[]>([]);

  // Categorias de serviços
  const categories = [
    { id: 1, name: "Todos", icon: "fa-solid fa-border-all" },
    { id: 2, name: "Garçom", icon: "fa-solid fa-utensils" },
    { id: 3, name: "Cozinheiro", icon: "fa-solid fa-hat-chef" },
    { id: 4, name: "Recepcionista", icon: "fa-solid fa-bell-concierge" },
    { id: 5, name: "Barman", icon: "fa-solid fa-martini-glass" },
    { id: 6, name: "Auxiliar", icon: "fa-solid fa-hands-helping" },
  ];

  // Carregar lances do leilão selecionado
  useEffect(() => {
    if (selectedAuction) {
      loadAuctionBids(selectedAuction.id);
    }
  }, [selectedAuction]);

  // Carregar lances de um leilão
  const loadAuctionBids = async (auctionId: string) => {
    const { data, error } = await getAuctionBids(auctionId);
    if (data) {
      setAuctionBids(data);
    } else if (error) {
      toast.error("Erro ao carregar lances: " + error.message);
    }
  };

  // Filtrar leilões por categoria e termo de busca
  const getFilteredAuctions = () => {
    let filteredList = [];
    
    // Determinar qual lista de leilões usar com base na aba ativa
    if (activeTab === "ativos") {
      filteredList = activeAuctions;
    } else if (activeTab === "meus") {
      filteredList = myAuctions;
    } else {
      filteredList = auctions;
    }
    
    // Aplicar filtros de categoria e busca
    return filteredList.filter(
      (auction) =>
        (selectedCategory === "Todos" || auction.category === selectedCategory) &&
        (auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         auction.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Formatar tempo relativo
  const formatTimeRemaining = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Formatar valor em reais
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Abrir modal de lance
  const handleOpenBidModal = (auction: Auction) => {
    setSelectedAuction(auction);
    // Definir valor inicial do lance (atual + 5)
    const currentBidValue = auction.current_bid_amount || auction.initial_price;
    setBidAmount((currentBidValue + 5).toString());
    setShowBidModal(true);
  };

  // Enviar lance
  const handleSubmitBid = async () => {
    if (!selectedAuction || !bidAmount) return;
    
    const bidValue = Number(bidAmount);
    const currentBidValue = selectedAuction.current_bid_amount || selectedAuction.initial_price;
    
    if (bidValue <= currentBidValue) {
      toast.error("O lance deve ser maior que o lance atual");
      return;
    }

    // Calcular taxa de serviço (10%)
    const serviceFee = parseFloat((bidValue * 0.1).toFixed(2));
    const totalAmount = bidValue + serviceFee;

    // Confirmar lance
    if (window.confirm(`Confirmar lance de ${formatCurrency(bidValue)} + taxa de serviço ${formatCurrency(serviceFee)} = ${formatCurrency(totalAmount)}?`)) {
      const { data, error } = await placeBid(selectedAuction.id, bidValue);
      
      if (error) {
        toast.error("Erro ao fazer lance: " + error.message);
      } else {
        toast.success("Lance enviado com sucesso!");
        setShowBidModal(false);
        refetch(); // Atualizar lista de leilões
      }
    }
  };

  // Atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="mr-3 text-gray-600"
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">Leilão de Serviços</h1>
            </div>
            <button
              onClick={handleRefresh}
              className="text-blue-500 p-2 rounded-full hover:bg-blue-50"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <span>⟳</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Barra de busca */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar leilões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex overflow-x-auto hide-scrollbar space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-lg transition-colors ${selectedCategory === category.name ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
              >
                <i className={`${category.icon} text-lg mb-1`}></i>
                <span className="text-xs whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("ativos")}
              className={`py-3 px-4 font-medium text-sm ${activeTab === "ativos" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            >
              Leilões Ativos
            </button>
            <button
              onClick={() => setActiveTab("meus")}
              className={`py-3 px-4 font-medium text-sm ${activeTab === "meus" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            >
              Meus Leilões
            </button>
            <button
              onClick={() => setActiveTab("todos")}
              className={`py-3 px-4 font-medium text-sm ${activeTab === "todos" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p>Erro ao carregar leilões: {error.message}</p>
          </div>
        ) : getFilteredAuctions().length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <MdAuction className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum leilão encontrado</h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Tente ajustar seus filtros de busca"
                : activeTab === "meus"
                ? "Você ainda não criou nenhum leilão"
                : "Não há leilões disponíveis no momento"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredAuctions().map((auction) => {
              const currentBidValue = auction.current_bid_amount || auction.initial_price;
              
              return (
                <div key={auction.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                          {auction.category}
                        </span>
                        <h3 className="text-lg font-semibold">{auction.title}</h3>
                        <p className="text-sm text-gray-600">{auction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Criado {formatTimeRemaining(auction.created_at)}</p>
                        <p className="text-xs text-gray-500">Termina {formatTimeRemaining(auction.end_date)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm">Preço inicial: <span className="font-semibold">{formatCurrency(auction.initial_price)}</span></p>
                        <p className="text-sm">Lance atual: <span className="font-semibold text-green-600">{formatCurrency(currentBidValue)}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">{auction.bids_count || 0} lances</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2">
                          {auction.creator?.avatar_url ? (
                            <img src={auction.creator.avatar_url} alt={auction.creator.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                              {auction.creator?.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{auction.creator?.name || "Usuário"}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenBidModal(auction)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        disabled={auction.status !== "active"}
                      >
                        Fazer Lance
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de lance */}
      {showBidModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Fazer lance para: {selectedAuction.title}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Lance atual: {formatCurrency(selectedAuction.current_bid_amount || selectedAuction.initial_price)}</p>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu lance (R$)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={(selectedAuction.current_bid_amount || selectedAuction.initial_price) + 1}
                  step="1"
                />
                
                {bidAmount && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Taxa de serviço (10%): {formatCurrency(Number(bidAmount) * 0.1)}</p>
                    <p className="font-medium">Total: {formatCurrency(Number(bidAmount) * 1.1)}</p>
                  </div>
                )}
              </div>
              
              {auctionBids.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico de lances</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {auctionBids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden mr-2">
                            {bid.bidder?.avatar_url ? (
                              <img src={bid.bidder.avatar_url} alt={bid.bidder.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                                {bid.bidder?.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <span className="text-xs">{bid.bidder?.name || "Usuário"}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{formatCurrency(bid.amount)}</p>
                          <p className="text-xs text-gray-500">{formatTimeRemaining(bid.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitBid}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                >
                  Confirmar Lance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de navegação inferior */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <div className="container mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center py-3 px-5 text-gray-600"
            >
              <FaHome size={20} />
              <span className="text-xs mt-1">Início</span>
            </button>
            <button
              onClick={() => router.push("/auctions")}
              className="flex flex-col items-center py-3 px-5 text-blue-600"
            >
              <MdAuction size={20} />
              <span className="text-xs mt-1">Leilões</span>
            </button>
            <button
              onClick={() => router.push("/messages")}
              className="flex flex-col items-center py-3 px-5 text-gray-600"
            >
              <FaComments size={20} />
              <span className="text-xs mt-1">Mensagens</span>
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center py-3 px-5 text-gray-600"
            >
              <FaUser size={20} />
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AuctionsPage;