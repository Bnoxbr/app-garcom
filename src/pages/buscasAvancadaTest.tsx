// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';

const App: React.FC = () => {
  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 200]);
  const [experience, setExperience] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevancia');
  const [expandedSection, setExpandedSection] = useState<string | null>('categorias');
  const [savedSearches, setSavedSearches] = useState<Array<{id: number, name: string}>>([
    {id: 1, name: 'Garçons experientes próximos'},
    {id: 2, name: 'Cozinheiros disponíveis hoje'}
  ]);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  // Categorias de profissionais
  const categories = [
    { id: 1, name: 'Garçom', icon: 'fa-utensils' },
    { id: 2, name: 'Cozinheiro', icon: 'fa-hat-chef' },
    { id: 3, name: 'Recepcionista', icon: 'fa-bell-concierge' },
    { id: 4, name: 'Barman', icon: 'fa-martini-glass' },
    { id: 5, name: 'Auxiliar', icon: 'fa-hands-helping' },
    { id: 6, name: 'Sommelier', icon: 'fa-wine-glass' },
    { id: 7, name: 'Gerente', icon: 'fa-user-tie' },
    { id: 8, name: 'Segurança', icon: 'fa-shield-alt' },
  ];

  // Opções de habilidades
  const skills = [
    'Inglês fluente', 'Espanhol', 'Francês', 'Cozinha italiana',
    'Cozinha japonesa', 'Cozinha francesa', 'Confeitaria', 'Drinks clássicos',
    'Drinks autorais', 'Gestão de equipe', 'Atendimento VIP', 'Eventos corporativos'
  ];

  // Opções de experiência
  const experienceOptions = [
    { value: 'iniciante', label: 'Iniciante (< 1 ano)' },
    { value: 'junior', label: 'Júnior (1-3 anos)' },
    { value: 'pleno', label: 'Pleno (3-5 anos)' },
    { value: 'senior', label: 'Sênior (5+ anos)' }
  ];

  // Opções de ordenação
  const sortOptions = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'distancia', label: 'Distância' },
    { value: 'avaliacao', label: 'Avaliação' },
    { value: 'preco_asc', label: 'Preço (menor-maior)' },
    { value: 'preco_desc', label: 'Preço (maior-menor)' }
  ];

  // Funções para manipular os filtros
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleAvailability = (value: string) => {
    setAvailability(availability === value ? null : value);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSaveSearch = () => {
    if (newSearchName.trim()) {
      setSavedSearches([...savedSearches, {
        id: savedSearches.length + 1,
        name: newSearchName
      }]);
      setNewSearchName('');
      setShowSaveSearchModal(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setDistance(10);
    setMinRating(0);
    setAvailability(null);
    setPriceRange([50, 200]);
    setExperience(null);
    setSelectedSkills([]);
    setSortBy('relevancia');
  };

  const formatPriceValue = (value: number) => {
    return `R$ ${value}`;
  };

  // Contador de filtros ativos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (distance !== 10) count++;
    if (minRating > 0) count++;
    if (availability) count++;
    if (priceRange[0] !== 50 || priceRange[1] !== 200) count++;
    if (experience) count++;
    if (selectedSkills.length > 0) count++;
    return count;
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <a 
              href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c" 
              data-readdy="true"
              className="mr-2 cursor-pointer"
            >
              <i className="fas fa-arrow-left text-lg"></i>
            </a>
            <i className="fas fa-utensils text-xl mr-2"></i>
            <h1 className="text-xl font-bold">GastroServ</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-bell text-lg"></i>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-user-circle text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6">
          <h2 className="text-xl font-semibold">Busca Avançada</h2>
          <p className="text-gray-600">Encontre o profissional ideal com filtros personalizados</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, especialidade ou habilidade..."
            className="w-full py-3 px-4 pr-12 rounded-lg bg-white shadow-sm border-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
            <i className="fas fa-search"></i>
          </button>
          {searchTerm && (
            <button 
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Active Filters Count */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getActiveFiltersCount()}</span> filtros ativos
            </div>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 font-medium cursor-pointer"
            >
              Limpar todos
            </button>
          </div>
        )}

        {/* Saved Searches */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Buscas Salvas</h3>
            <button 
              onClick={() => setShowSaveSearchModal(true)}
              className="text-sm text-blue-600 font-medium cursor-pointer"
            >
              Salvar atual
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {savedSearches.map(search => (
              <div 
                key={search.id}
                className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm cursor-pointer min-w-max"
              >
                <i className="fas fa-history text-gray-500 mr-2"></i>
                <span className="text-sm">{search.name}</span>
              </div>
            ))}
            {savedSearches.length === 0 && (
              <div className="text-sm text-gray-500 py-2">
                Nenhuma busca salva ainda
              </div>
            )}
          </div>
        </div>

        {/* Filter Sections */}
        <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Categories Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('categorias')}
            >
              <div className="flex items-center">
                <i className="fas fa-tags text-gray-500 mr-3"></i>
                <h3 className="font-medium">Categorias</h3>
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'categorias' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'categorias' && (
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => toggleCategory(category.name)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      selectedCategories.includes(category.name) 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <i className={`fas ${category.icon} ${selectedCategories.includes(category.name) ? 'text-blue-500' : 'text-gray-500'} mr-2`}></i>
                    <span className={`text-sm ${selectedCategories.includes(category.name) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Distance Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('distancia')}
            >
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-500 mr-3"></i>
                <h3 className="font-medium">Distância</h3>
                {distance !== 10 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {distance} km
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'distancia' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'distancia' && (
              <div className="p-4 pt-2">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-3 text-sm font-medium">
                  Até {distance} km de distância
                </div>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('avaliacao')}
            >
              <div className="flex items-center">
                <i className="fas fa-star text-gray-500 mr-3"></i>
                <h3 className="font-medium">Avaliação Mínima</h3>
                {minRating > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {minRating}+
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'avaliacao' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'avaliacao' && (
              <div className="p-4 pt-2">
                <div className="flex justify-between items-center">
                  {[0, 1, 2, 3, 4, 5].map(rating => (
                    <div 
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex flex-col items-center cursor-pointer p-2 ${minRating === rating ? 'bg-blue-50 rounded-lg' : ''}`}
                    >
                      {rating === 0 ? (
                        <span className="text-sm text-gray-500">Todos</span>
                      ) : (
                        <div className="flex">
                          {[...Array(rating)].map((_, i) => (
                            <i key={i} className="fas fa-star text-yellow-400"></i>
                          ))}
                          {[...Array(5-rating)].map((_, i) => (
                            <i key={i} className="far fa-star text-gray-300"></i>
                          ))}
                        </div>
                      )}
                      <span className={`text-xs mt-1 ${minRating === rating ? 'font-medium text-blue-700' : 'text-gray-500'}`}>
                        {rating === 0 ? 'Qualquer' : `${rating}+`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('disponibilidade')}
            >
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-500 mr-3"></i>
                <h3 className="font-medium">Disponibilidade</h3>
                {availability && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {availability}
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'disponibilidade' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'disponibilidade' && (
              <div className="p-4 pt-2 flex space-x-2">
                {['Agora', 'Hoje', 'Esta semana'].map(option => (
                  <button
                    key={option}
                    onClick={() => toggleAvailability(option)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      availability === option 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    } cursor-pointer !rounded-button`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('preco')}
            >
              <div className="flex items-center">
                <i className="fas fa-money-bill-wave text-gray-500 mr-3"></i>
                <h3 className="font-medium">Faixa de Preço</h3>
                {(priceRange[0] !== 50 || priceRange[1] !== 200) && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    R${priceRange[0]} - R${priceRange[1]}
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'preco' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'preco' && (
              <div className="p-4 pt-2">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>R$ 50</span>
                  <span>R$ 500</span>
                </div>
                <div className="relative pt-5">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between mt-8 text-sm font-medium">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    {formatPriceValue(priceRange[0])}
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    {formatPriceValue(priceRange[1])}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('experiencia')}
            >
              <div className="flex items-center">
                <i className="fas fa-briefcase text-gray-500 mr-3"></i>
                <h3 className="font-medium">Experiência</h3>
                {experience && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {experienceOptions.find(o => o.value === experience)?.label}
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'experiencia' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'experiencia' && (
              <div className="p-4 pt-2 grid grid-cols-2 gap-2">
                {experienceOptions.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => setExperience(experience === option.value ? null : option.value)}
                    className={`p-3 rounded-lg cursor-pointer ${
                      experience === option.value 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span className={`text-sm ${experience === option.value ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('habilidades')}
            >
              <div className="flex items-center">
                <i className="fas fa-tools text-gray-500 mr-3"></i>
                <h3 className="font-medium">Habilidades Específicas</h3>
                {selectedSkills.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedSkills.length}
                  </span>
                )}
              </div>
              <i className={`fas ${expandedSection === 'habilidades' ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
            </div>
            {expandedSection === 'habilidades' && (
              <div className="p-4 pt-2 flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div 
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-full text-sm cursor-pointer ${
                      selectedSkills.includes(skill) 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Ordenar por</h3>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-3 px-4 pr-10 rounded-lg bg-white shadow-sm border-none text-sm appearance-none cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button 
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium shadow-sm cursor-pointer !rounded-button"
          >
            Aplicar Filtros
          </button>
          <button 
            onClick={clearFilters}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium shadow-sm cursor-pointer !rounded-button"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center text-sm text-gray-500 mb-6">
          Encontramos 42 profissionais com base nos seus filtros
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-lg w-full max-w-xs p-5">
            <h3 className="text-lg font-semibold mb-4">Salvar Busca</h3>
            <input
              type="text"
              placeholder="Nome da busca"
              className="w-full py-3 px-4 rounded-lg bg-gray-100 border-none text-sm mb-4"
              value={newSearchName}
              onChange={(e) => setNewSearchName(e.target.value)}
            />
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveSearch}
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium cursor-pointer !rounded-button"
              >
                Salvar
              </button>
              <button 
                onClick={() => setShowSaveSearchModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium cursor-pointer !rounded-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar */}
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
          <button className="flex flex-col items-center justify-center text-gray-800 cursor-pointer">
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1">Buscar</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-calendar-alt text-lg"></i>
            <span className="text-xs mt-1">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-comment-alt text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

