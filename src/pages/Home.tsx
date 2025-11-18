import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessionals } from '../hooks/useProfessionals';
// A linha abaixo pode ser reativada no futuro, mas por agora usamos a lista estática para garantir o visual.
// import { useCategories } from '../hooks/useCategories';
import { useAuthContext } from '../hooks/useAuth';
import { Loading, ErrorMessage, ProfessionalsGrid, PWAInstallButton } from '../components';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  
  const { professionals, loading: professionalsLoading, error: professionalsError, fetchProfessionals: refetchProfessionals } = useProfessionals();
  // const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();

  // --- USANDO A LISTA DE CATEGORIAS QUE FUNCIONOU VISUALMENTE ---
  const categories = [
    { id: 1, name: "Todos", icon: "fa-solid fa-border-all" },
    { id: 2, name: "Garçom", icon: "fa-solid fa-user-tie" },
    { id: 3, name: "Cozinheiro", icon: "fa-solid fa-utensils" },
    { id: 4, name: "Barman", icon: "fa-solid fa-martini-glass" },
    { id: 5, name: "Auxiliar", icon: "fa-solid fa-hands-helping" },
    { id: 6, name: "Gerente", icon: "fa-solid fa-user-cog" },
  ];
  // --------------------------------------------------------

  // O resto dos seus estados e lógica originais (sem alterações)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [, setIsPulsing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, ] = useState({
    availability: 'qualquer',
    rating: '0.0',
    experience: '0'
  });

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      setIsPulsing(true);
      setTimeout(() => {
        setIsPulsing(false);
      }, 1000);
    }
    setSelectedCategory(category);
  };

  const filteredProfessionals = useMemo(() => {
    return (professionals || []).filter(professional => {
      const nameForSearch = professional.nome_completo || professional.full_name || '';
      const categoryMatch = selectedCategory === 'Todos' || (professional.especialidades && professional.especialidades.includes(selectedCategory));
      const searchMatch = nameForSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (professional.especialidades && Array.isArray(professional.especialidades) && professional.especialidades.some((s: string) => (s || '').toLowerCase().includes(searchTerm.toLowerCase())));
      const ratingMatch = (professional.average_rating || 0) >= parseFloat(filters.rating);
      const experienceMatch = (professional.anos_experiencia || 0) >= parseFloat(filters.experience);
      let availabilityMatch = true;
      const filterValue = filters.availability.toLowerCase();
      if (filterValue === 'agora') {
          availabilityMatch = professional.is_available === true;
      }
      return categoryMatch && searchMatch && ratingMatch && experienceMatch && availabilityMatch;
    });
  }, [professionals, selectedCategory, searchTerm, filters]); 

  // Removido 'categoriesError' e 'categoriesLoading' das condições
  if (professionalsError) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <ErrorMessage message={professionalsError || 'Erro ao carregar dados'} onRetry={refetchProfessionals} />
      </div>
    );
  }

  if (professionalsLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loading message="Carregando profissionais..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="absolute inset-0 animated-background parallax-light bg-[#FAF9F6]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
        <div className="particle floating-element"></div>
      </div>
      
      <div className="relative z-10 fade-in">
        <div className="px-20 relative z-10 overflow-x-hidden">
          
          {/* A sua secção de Boas-Vindas original */}
          <div className="mt-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-sw-blue-primary">
                  {user && profile ? `Olá, ${profile.full_name?.split(' ')[0] || 'Utilizador'}!` : 'Aonde o preparo e a oportunidade tem hora marcada para se encontrarem. '}
                </h2>
                <p className="text-gray-600">Olá, seja bem-vindo! </p>
                <p className="text-gray-500 mt-1 text-sm">Encontre profissionais qualificados para o seu evento ou estabelecimento.</p>
              </div>
              <div className="mb-4">
                <PWAInstallButton variant="minimal" />
              </div>
              <div className="flex items-center space-x-2">
                {/* ... (lógica de login/logout) ... */}
              </div>
            </div>
          </div>

          {/* A sua Barra de Busca original */}
          <div className="relative mb-4 slide-up">
            <input
              type="text"
              placeholder="Buscar garçons, cozinheiros, recepcionistas..."
              className="w-full py-3 px-4 pr-20 rounded-lg bg-white shadow-sm border border-transparent text-sm smooth-transition focus:shadow-lg focus:scale-[1.02] focus:ring-2 focus:ring-sw-yellow-accent focus:border-sw-yellow-accent focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowFilterModal(true)} className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer p-2">
                <i className="fas fa-filter"></i>
            </button>
            {/* BOTÃO BUSCAR: bg-sw-blue-primary e hover ajustado */}
            <button onClick={() => {}} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-sw-blue-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1D4ED8] transition-colors">
              Buscar
            </button>
            {showFilterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg w-full max-w-md">
                   {/* ... O seu modal de filtros completo ... */}
                </div>
              </div>
            )}
          </div>

          {/* --- SECÇÃO DE CATEGORIAS INTEGRADA E CORRIGIDA --- */}
          <div className="mb-4 slide-up">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-sw-blue-primary">Categorias</h3>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex flex-col items-center justify-center flex-shrink-0 w-20 h-20 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    // CORREÇÃO COMPLETA DOS CARDS DE CATEGORIA (ESTADO ATIVO E INATIVO)
                    selectedCategory === category.name
                      ? "bg-sw-blue-primary text-white shadow-lg border-2 border-sw-blue-primary" 
                      : "bg-white text-sw-blue-primary shadow-md border-2 border-sw-yellow-accent hover:shadow-lg hover:bg-gray-50"
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <i className={`${category.icon} text-2xl mb-2`}></i>
                  <span className="text-xs font-semibold whitespace-nowrap">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* O seu botão de Leilão original */}
          <div className="mb-4 slide-up">
            <button 
              onClick={() => navigate('/auctions')}
              className="w-full py-3 px-4 bg-sw-blue-primary/10 hover:bg-sw-blue-primary/20 text-sw-blue-primary rounded-lg shadow-sm smooth-transition card-hover flex items-center justify-center space-x-2 cursor-pointer border-2 border-sw-yellow-accent"
             >
              <i className="fas fa-gavel text-lg"></i>
              <span className="font-medium">Leilão de Serviços</span>
              <div className="flex items-center text-sm text-sw-blue-primary/80 ml-2">
                <i className="fas fa-clock mr-1"></i>
                <span>Ideal para eventos urgentes</span>
              </div>
            </button>
          </div>

          {/* O seu Grid de Profissionais original */}
          <ProfessionalsGrid professionals={filteredProfessionals} />
        </div>

        {/* O seu menu flutuante e barra de rodapé originais */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg z-10 border border-gray-100 smooth-transition">
          {/* ... */}
        </div>
        <div className="fixed right-4 bottom-20 flex flex-col items-end">
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Home;