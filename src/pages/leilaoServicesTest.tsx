// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ativos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Categorias de serviços
  const categories = [
    { id: 1, name: "Todos", icon: "fa-solid fa-border-all" },
    { id: 2, name: "Garçom", icon: "fa-solid fa-utensils" },
    { id: 3, name: "Cozinheiro", icon: "fa-solid fa-hat-chef" },
    { id: 4, name: "Recepcionista", icon: "fa-solid fa-bell-concierge" },
    { id: 5, name: "Barman", icon: "fa-solid fa-martini-glass" },
    { id: 6, name: "Auxiliar", icon: "fa-solid fa-hands-helping" },
  ];
  // Interface para leilões
  interface Auction {
    id: number;
    category: string;
    professional: {
      name: string;
      photo: string;
      rating: number;
      reviews: number;
    };
    initialPrice: number;
    currentBid: number;
    timeRemaining: number;
    participants: number;
    status: "ativo" | "finalizado" | "aguardando";
  }
  // Interface para histórico de lances
  interface BidHistory {
    id: number;
    auctionId: number;
    category: string;
    professional: string;
    bidAmount: number;
    date: string;
    status: "vencendo" | "perdendo" | "finalizado";
  }
  // Dados de leilões ativos
  const auctions: Auction[] = [
    {
      id: 1,
      category: "Garçom",
      professional: {
        name: "Mariana Silva",
        photo:
          "https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520restaurant%2520uniform%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=100&height=100&seq=1&orientation=squarish",
        rating: 4.8,
        reviews: 47,
      },
      initialPrice: 120,
      currentBid: 145,
      timeRemaining: 3600, // em segundos
      participants: 8,
      status: "ativo",
    },
    {
      id: 2,
      category: "Cozinheiro",
      professional: {
        name: "Carlos Oliveira",
        photo:
          "https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520male%2520chef%2520in%2520white%2520chef%2520uniform%2520and%2520hat%252C%2520confident%2520expression%252C%2520well-groomed%2520appearance%252C%2520neutral%2520kitchen%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=100&height=100&seq=2&orientation=squarish",
        rating: 4.9,
        reviews: 124,
      },
      initialPrice: 200,
      currentBid: 230,
      timeRemaining: 7200,
      participants: 12,
      status: "ativo",
    },
    {
      id: 3,
      category: "Recepcionista",
      professional: {
        name: "Juliana Mendes",
        photo:
          "https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520receptionist%2520in%2520business%2520attire%252C%2520warm%2520welcoming%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520hotel%2520lobby%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=100&height=100&seq=3&orientation=squarish",
        rating: 4.7,
        reviews: 36,
      },
      initialPrice: 100,
      currentBid: 115,
      timeRemaining: 5400,
      participants: 6,
      status: "ativo",
    },
    {
      id: 4,
      category: "Barman",
      professional: {
        name: "Rafael Santos",
        photo:
          "https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520male%2520bartender%2520in%2520stylish%2520bartender%2520uniform%252C%2520confident%2520expression%252C%2520well-groomed%2520appearance%252C%2520neutral%2520bar%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=100&height=100&seq=4&orientation=squarish",
        rating: 4.6,
        reviews: 89,
      },
      initialPrice: 150,
      currentBid: 180,
      timeRemaining: 2700,
      participants: 9,
      status: "ativo",
    },
    {
      id: 5,
      category: "Auxiliar",
      professional: {
        name: "Fernanda Costa",
        photo:
          "https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520kitchen%2520assistant%2520in%2520chef%2520uniform%252C%2520friendly%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520kitchen%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=100&height=100&seq=5&orientation=squarish",
        rating: 4.5,
        reviews: 28,
      },
      initialPrice: 90,
      currentBid: 105,
      timeRemaining: 4500,
      participants: 5,
      status: "ativo",
    },
  ];
  // Histórico de lances do usuário
  const bidHistory: BidHistory[] = [
    {
      id: 1,
      auctionId: 2,
      category: "Cozinheiro",
      professional: "Carlos Oliveira",
      bidAmount: 220,
      date: "05/05/2025 14:30",
      status: "perdendo",
    },
    {
      id: 2,
      auctionId: 1,
      category: "Garçom",
      professional: "Mariana Silva",
      bidAmount: 145,
      date: "05/05/2025 13:15",
      status: "vencendo",
    },
    {
      id: 3,
      auctionId: 4,
      category: "Barman",
      professional: "Rafael Santos",
      bidAmount: 165,
      date: "04/05/2025 18:45",
      status: "finalizado",
    },
  ];
  // Filtrar leilões por categoria e termo de busca
  const filteredAuctions = auctions.filter(
    (auction) =>
      (selectedCategory === "Todos" || auction.category === selectedCategory) &&
      (auction.professional.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        auction.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );
  // Formatar tempo restante
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
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
    setBidAmount((auction.currentBid + 5).toString());
    setShowBidModal(true);
  };
  // Enviar lance
  const handleSubmitBid = () => {
    if (!selectedAuction || !bidAmount) return;
    const bidValue = Number(bidAmount);
    if (bidValue <= selectedAuction.currentBid) {
      setToastMessage("O lance deve ser maior que o lance atual");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    // Aqui seria a lógica para enviar o lance ao servidor
    // Por enquanto, apenas simulamos a atualização
    setToastMessage("Lance enviado com sucesso!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowBidModal(false);
  };
  // Atualizar contagem regressiva
  useEffect(() => {
    const timer = setInterval(() => {
      // Atualizar contagem regressiva (simulação)
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Barra de navegação superior */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <a
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
            data-readdy="true"
            className="cursor-pointer"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </a>
          <h1 className="text-xl font-bold">Leilão de Serviços</h1>
          <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
            <i className="fas fa-bell text-lg"></i>
          </button>
        </div>
      </div>
      {/* Conteúdo principal */}
      <div className="pt-16 pb-16 px-4">
        {/* Barra de pesquisa */}
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
        {/* Categorias */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer ${
                  selectedCategory === category.name
                    ? "bg-gray-800 text-white"
                    : "bg-white shadow-sm"
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
        {/* Abas de navegação */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              id="activeAuctionsTab"
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                activeTab === "ativos" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
              onClick={() => {
                if (activeTab === "ativos") {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    setIsRefreshing(false);
                    setToastMessage("Lista de leilões atualizada");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }, 1000);
                } else {
                  setActiveTab("ativos");
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
                activeTab === "historico"
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("historico")}
            >
              Histórico de Lances
            </button>
          </div>
        </div>
        {/* Lista de leilões ativos */}
        {activeTab === "ativos" && (
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
                          <img
                            src={auction.professional.photo}
                            alt={auction.professional.name}
                            className="w-full h-full object-cover"
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
                        <div className="font-semibold text-gray-800">
                          {formatCurrency(auction.currentBid)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenBidModal(auction)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer !rounded-button"
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
        {/* Histórico de lances */}
        {activeTab === "historico" && (
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
                        bid.status === "vencendo"
                          ? "bg-green-100 text-green-800"
                          : bid.status === "perdendo"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {bid.status === "vencendo"
                        ? "Vencendo"
                        : bid.status === "perdendo"
                          ? "Perdendo"
                          : "Finalizado"}
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
      {/* Barra de navegação inferior */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="grid grid-cols-5 h-16">
          <a
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
            data-readdy="true"
            className="flex flex-col items-center justify-center text-gray-500 cursor-pointer no-underline"
          >
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Início</span>
          </a>
          <a
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/275940a7-3b94-40d8-b063-5b7e4c6539d7"
            data-readdy="true"
            className="flex flex-col items-center justify-center text-gray-500 cursor-pointer no-underline"
          >
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1">Buscar</span>
          </a>
          <div className="flex flex-col items-center justify-center text-gray-800 cursor-pointer">
            <i className="fas fa-gavel text-lg"></i>
            <span className="text-xs mt-1">Leilões</span>
          </div>
          <a
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/1e3dbf0d-dee6-4e1a-8032-0f055f0d88fb"
            data-readdy="true"
            className="flex flex-col items-center justify-center text-gray-500 cursor-pointer no-underline"
          >
            <i className="fas fa-comment-alt text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </a>
          <a
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/2526abfb-ac98-4cfd-946d-a7d7cf726615"
            data-readdy="true"
            className="flex flex-col items-center justify-center text-gray-500 cursor-pointer no-underline"
          >
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
          </a>
        </div>
      </div>
      {/* Modal de lance */}
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
                  <img
                    src={selectedAuction.professional.photo}
                    alt={selectedAuction.professional.name}
                    className="w-full h-full object-cover"
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
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium cursor-pointer !rounded-button"
              >
                Confirmar Lance
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast de notificação */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
export default App;
