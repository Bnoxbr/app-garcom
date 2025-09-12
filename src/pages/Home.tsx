// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessionals } from '../hooks/useProfessionals'
import { useCategories } from '../hooks/useCategories'
import { useAuthContext, useAuth } from '../hooks/useAuth'
import { Loading, ErrorMessage, ProfessionalsGrid, PWAInstallButton } from '../components'


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { signOut } = useAuth();
  
  // Hooks do Supabase
  const { professionals, loading: professionalsLoading, error: professionalsError, refetch: refetchProfessionals } = useProfessionals();
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();



  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);


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

  const filteredProfessionals = professionals.filter(professional => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'Todos' || professional.category.includes(selectedCategory);
    
    // Filtro por termo de busca
    const searchMatch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por distância
    let distanceMatch = true;
    if (professional.distance) {
      const distance = parseFloat(professional.distance.replace(/[^0-9.]/g, ''));
      switch (filters.distance) {
        case '0-5':
          distanceMatch = distance <= 5;
          break;
        case '5-10':
          distanceMatch = distance > 5 && distance <= 10;
          break;
        case '10-15':
          distanceMatch = distance > 10 && distance <= 15;
          break;
        case '15+':
          distanceMatch = distance > 15;
          break;
      }
    }
    
    // Filtro por disponibilidade
    let availabilityMatch = true;
    if (filters.availability !== 'qualquer') {
      availabilityMatch = professional.available;
    }
    
    // Filtro por rating
    const ratingMatch = professional.rating >= parseFloat(filters.rating);
    
    return categoryMatch && searchMatch && distanceMatch && availabilityMatch && ratingMatch;
  });

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
    <div className="relative min-h-screen text-gray-800 pb-24 bg-gray-100">
      {/* Animated Background with Parallax Effect */}
      <div className="absolute inset-0 animated-background parallax-light"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
      </div>
      
      <div className="relative z-10 fade-in">
        {/* Main Content */}
        <div className="px-4 relative z-10">
          {/* Welcome Section */}
          <div className="mt-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user && profile ? `Olá, ${profile.full_name?.split(' ')[0] || 'Usuário'}!` : 'Olá, seja bem-vindo!'}
                </h2>
                <p className="text-gray-600">Encontre profissionais qualificados para seu evento ou estabelecimento</p>
                <p className="text-gray-500 mt-1 text-sm">Ideal para restaurantes, buffets e eventos particulares</p>
              </div>
              
              {/* PWA Install Button */}
              <div className="mb-4">
                <PWAInstallButton variant="minimal" />
              </div>
              
              {/* Auth Section */}
              <div className="flex items-center space-x-2">
                {user && profile ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {profile.role}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Sair</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate('/auth/login')}
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Entrar</span>
                    </button>
                    <button
                      onClick={() => navigate('/auth/register')}
                      className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 slide-up">
            <input
              type="text"
              placeholder="Buscar garçons, cozinheiros, recepcionistas..."
              className="w-full py-3 px-4 pr-10 rounded-lg bg-white shadow-sm border-none text-sm smooth-transition focus:shadow-lg focus:scale-[1.02]"
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
          <div className="mb-6 slide-up">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800 gentle-pulse">Categorias</h3>
            <span className="text-sm text-gray-600">{filteredProfessionals.length} profissionais encontrados</span>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-3 relative">
              {showToast && (
                <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-20">
                  Mostrando todos os profissionais
                </div>
              )}
              <div
                id="category-todos"
                className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer smooth-hover stagger-animation ${selectedCategory === 'Todos' ? 'bg-gray-800 text-white' : 'bg-white shadow-sm'} ${isPulsing && selectedCategory === 'Todos' ? 'animate-pulse' : ''}`}
                onClick={() => handleCategoryClick('Todos')}
              >
                <i className="fas fa-border-all text-xl mb-1"></i>
                <span className="text-xs whitespace-nowrap overflow-hidden text-overflow-ellipsis">Todos</span>
              </div>
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  id={`category-${category.id}`}
                  className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg cursor-pointer smooth-hover stagger-animation ${selectedCategory === category.name ? 'bg-gray-800 text-white' : 'bg-white shadow-sm'} ${isPulsing && selectedCategory === category.name ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <i className={`${category.icon} text-xl mb-1`}></i>
                  <span className="text-xs whitespace-nowrap overflow-hidden text-overflow-ellipsis">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Auction Button */}
          <div className="mb-6 slide-up">
            <button 
              onClick={() => navigate('/auctions')}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg shadow-sm smooth-transition card-hover flex items-center justify-center space-x-2 cursor-pointer"
            >
              <i className="fas fa-gavel text-lg"></i>
              <span className="font-medium">Leilão de Serviços</span>
              <div className="flex items-center text-sm text-gray-700 ml-2">
                <i className="fas fa-clock mr-1"></i>
                <span>Ideal para eventos urgentes</span>
              </div>
            </button>
          </div>

          {/* Professionals Grid */}
          <ProfessionalsGrid professionals={filteredProfessionals} />
        </div>

        {/* Tab Bar */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg z-10 border border-gray-100 smooth-transition">
          <div className="grid grid-cols-5 h-16">
            <button
              id="homeButton"
              onClick={handleHomeRefresh}
              className="flex flex-col items-center justify-center text-gray-800 cursor-pointer relative rounded-2xl smooth-hover"
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
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
            >
              <i className="fas fa-search text-lg"></i>
              <span className="text-xs mt-1">Buscar</span>
            </button>
            <button 
              onClick={() => navigate('/auctions')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
            >
              <i className="fas fa-gavel text-lg"></i>
              <span className="text-xs mt-1">Leilão</span>
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
            >
              <i className="fas fa-comment-alt text-lg"></i>
              <span className="text-xs mt-1">Chat</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center justify-center text-gray-500 cursor-pointer rounded-2xl smooth-hover"
            >
              <i className="fas fa-building text-lg"></i>
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>

        {/* Floating Action Button and Menu */}
        <div className="fixed right-4 bottom-20 flex flex-col items-end">
          {showFloatingMenu && (
            <div className="mb-4 bg-white rounded-lg shadow-xl overflow-hidden fade-in">
              <div className="py-2">
                <button
                  onClick={() => alert('Solicitar profissional em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left smooth-transition">
                  <i className="fas fa-utensils w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Solicitar profissional</span>
                </button>
                <button
                  onClick={() => alert('Criar evento/festa em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left smooth-transition">
                  <i className="fas fa-calendar-day w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Criar evento/festa</span>
                </button>
                <button
                  onClick={() => alert('Cadastrar estabelecimento em desenvolvimento')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left smooth-transition">
                  <i className="fas fa-store w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Cadastrar estabelecimento</span>
                </button>
                <button
                  onClick={() => navigate('/provider/profile')}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full text-left smooth-transition">
                  <i className="fas fa-user-tie w-6 text-gray-600"></i>
                  <span className="ml-3 text-gray-700">Cadastrar como profissional</span>
                </button>
              </div>
            </div>
          )}
          <button
            id="floatingActionButton"
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className={`bg-gray-800 text-white p-4 rounded-full shadow-lg cursor-pointer smooth-transition card-hover ${showFloatingMenu ? 'rotate-45' : ''}`}>
            <i className="fas fa-plus text-xl"></i>
          </button>
        </div>
        

      </div>
    </div>
  );
};

export default Home;