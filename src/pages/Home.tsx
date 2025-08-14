// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessionals } from '../hooks/useProfessionals'
import { useCategories } from '../hooks/useCategories'
import { Loading, ErrorMessage, DebugPanel } from '../components'


const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Hooks do Supabase
  const { professionals, loading: professionalsLoading, error: professionalsError, refetch: refetchProfessionals } = useProfessionals();
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileButton = document.getElementById('profileButton');
      const isClickInsideButton = profileButton?.contains(event.target as Node);
      if (!isClickInsideButton) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [_showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [filters, setFilters] = useState({
    distance: '0-5',
    availability: 'now',
    rating: '4.0',
    experience: '1'
  });

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      setIsPulsing(true);
      setShowToast(true);
      setTimeout(() => {
        setIsPulsing(false);
        setShowToast(false);
      }, 1000);
    }
    setSelectedCategory(category);
  };

  const handleHomeRefresh = () => {
    setIsRefreshing(true);
    setSearchTerm('');
    setSelectedCategory('Todos');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Dados agora vêm dos hooks do Supabase

  const filteredProfessionals = professionals.filter(professional =>
    (selectedCategory === 'Todos' || professional.category.includes(selectedCategory)) &&
    (professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Verificar se há erros
  if (professionalsError || categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage 
          message={professionalsError || categoriesError || 'Erro ao carregar dados'} 
          onRetry={() => {
            refetchProfessionals();
            refetchCategories();
          }}
        />
      </div>
    );
  }

  // Verificar se está carregando
  if (professionalsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Carregando profissionais..." size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-gray-800 pb-16" 
      style={{
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-1">
        {/* Main Content */}
        <div className="px-4 relative z-10">
          {/* Welcome Section */}
          <div className="mt-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Olá, seja bem-vindo!</h2>
            <p className="text-gray-200">Encontre profissionais qualificados para seu evento ou estabelecimento</p>
            <p className="text-gray-300 mt-1 text-sm">Ideal para restaurantes, buffets e eventos particulares</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar garçons, cozinheiros, recepcionistas..."
              className="w-full py-3 px-4 pr-10 rounded-lg bg-white shadow-sm border-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => navigate('/search')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              <i className="fas fa-search"></i>
            </button>
            <button
              id="filterButton"
              onClick={() => setShowFilterModal(true)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              <i className="fas fa-filter"></i>
            </button>

            {showFilterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg w-full max-w-md">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="text-gray-500 hover:text-gray-700">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="p-4 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Distância</label>
                      <select
                        value={filters.distance}
                        onChange={(e) => setFilters({...filters, distance: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="0-5">0-5 km</option>
                        <option value="5-10">5-10 km</option>
                        <option value="10-15">10-15 km</option>
                        <option value="15+">15+ km</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidade</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Agora', 'Hoje', 'Esta semana', 'Qualquer'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setFilters({...filters, availability: option.toLowerCase()})}
                            className={`p-2 rounded-lg border ${
                              filters.availability === option.toLowerCase()
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'border-gray-300 text-gray-700'
                            }`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação mínima: {filters.rating}+
                      </label>
                      <input
                        type="range"
                        min="3.0"
                        max="5.0"
                        step="0.5"
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: e.target.value})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anos de experiência: {filters.experience}+
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={filters.experience}
                        onChange={(e) => setFilters({...filters, experience: e.target.value})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={() => {
                        setFilters({
                          distance: '0-5',
                          availability: 'now',
                          rating: '4.0',
                          experience: '1'
                        });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                      Limpar Filtros
                    </button>
                    <button
                      onClick={() => {
                        setShowFilterModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg">
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Categorias</h3>
              <span className="text-sm text-gray-300">{filteredProfessionals.length} profissionais encontrados</span>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-3 relative">
              {showToast && (
                <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-20">
                  Mostrando todos os profissionais
                </div>
              )}
              <div
                id="category-todos"
                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer ${selectedCategory === 'Todos' ? 'bg-gray-800 text-white' : 'bg-white shadow-sm'} ${isPulsing && selectedCategory === 'Todos' ? 'animate-pulse' : ''}`}
                onClick={() => handleCategoryClick('Todos')}
              >
                <i className="fas fa-border-all text-xl mb-1"></i>
                <span className="text-xs whitespace-nowrap overflow-hidden text-overflow-ellipsis">Todos</span>
              </div>
              {categories.map(category => (
                <div
                  key={category.id}
                  id={`category-${category.id}`}
                  className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer ${selectedCategory === category.name ? 'bg-gray-800 text-white' : 'bg-white shadow-sm'} ${isPulsing && selectedCategory === category.name ? 'animate-pulse' : ''}`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <i className={`${category.icon} text-xl mb-1`}></i>
                  <span className="text-xs whitespace-nowrap overflow-hidden text-overflow-ellipsis">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Auction Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/auctions')}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <i className="fas fa-gavel text-lg"></i>
              <span className="font-medium">Leilão de Serviços</span>
              <div className="flex items-center text-sm text-gray-700 ml-2">
                <i className="fas fa-clock mr-1"></i>
                <span>Ideal para eventos urgentes</span>
              </div>
            </button>
          </div>

          {/* Professionals List */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Profissionais Disponíveis</h3>
              <button 
                onClick={() => navigate('/search')}
                className="text-gray-300 text-sm flex items-center cursor-pointer">
                <span>Filtrar</span>
                <i className="fas fa-sliders-h ml-1"></i>
              </button>
            </div>
            <div className="space-y-4 relative z-10">
              {filteredProfessionals.map(professional => (
                <div key={professional.id} className="bg-white rounded-lg shadow-sm p-4 flex cursor-pointer">
                  <div className="mr-3">
                    <div className="w-[70px] h-[70px] rounded-lg overflow-hidden">
                      <img
                        src={professional.image_url || '/placeholder-avatar.jpg'}
                        alt={professional.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => navigate('/provider/profile')}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{professional.name}</h4>
                        <p className="text-sm text-gray-600">{professional.category}</p>
                      </div>
                      <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Disponível
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <div className="flex items-center text-yellow-500 mr-3">
                        <i className="fas fa-star mr-1"></i>
                        <span>{professional.rating}</span>
                        <span className="text-gray-500 ml-1">(avaliações)</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>{professional.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-10">
          <div className="grid grid-cols-5 h-16">
            <button
              id="homeButton"
              onClick={handleHomeRefresh}
              className="flex flex-col items-center justify-center text-gray-800 cursor-pointer relative"
            >
              {isRefreshing ? (
                <i className="fas fa-spinner fa-spin text-lg"></i>
              ) : (
                <i className="fas fa-home text-lg"></i>
              )}
              <span className="text-xs mt-1">Início</span>
            </button>
            <button 
              onClick={() => navigate('/search')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer"
            >
              <i className="fas fa-search text-lg"></i>
              <span className="text-xs mt-1">Buscar</span>
            </button>
            <button 
              onClick={() => navigate('/auctions')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer"
            >
              <i className="fas fa-calendar-alt text-lg"></i>
              <span className="text-xs mt-1">Agenda</span>
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer"
            >
              <i className="fas fa-comment-alt text-lg"></i>
              <span className="text-xs mt-1">Chat</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer"
            >
              <i className="fas fa-building text-lg"></i>
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>

        {/* Floating Action Button and Menu */}
        <div className="fixed right-4 bottom-20 flex flex-col items-end">
          {showFloatingMenu && (
            <div className="mb-4 bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="py-2">
                <button
                  onClick={() => alert('Solicitar profissional em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left">
                  <i className="fas fa-utensils w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Solicitar profissional</span>
                </button>
                <button
                  onClick={() => alert('Criar evento/festa em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left">
                  <i className="fas fa-calendar-day w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Criar evento/festa</span>
                </button>
                <button
                  onClick={() => alert('Cadastrar estabelecimento em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left">
                  <i className="fas fa-store w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Cadastrar estabelecimento</span>
                </button>
                <button
                  onClick={() => navigate('/provider/profile')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left">
                  <i className="fas fa-user-tie w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Cadastrar como profissional</span>
                </button>
              </div>
            </div>
          )}
          <button
            id="floatingActionButton"
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className={`bg-gray-800 text-white p-4 rounded-full shadow-lg cursor-pointer transition-transform duration-200 ${showFloatingMenu ? 'rotate-45' : ''}`}>
            <i className="fas fa-plus text-xl"></i>
          </button>
        </div>
        
        {/* Botão de Debug (apenas em desenvolvimento) */}
        <button
          onClick={() => setShowDebugPanel(true)}
          className="fixed bottom-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-40 text-xs"
          title="Debug Panel"
        >
          🔍
        </button>
        
        {/* Debug Panel */}
        {showDebugPanel && (
          <DebugPanel onClose={() => setShowDebugPanel(false)} />
        )}
      </div>
    </div>
  );
};

export default Home;