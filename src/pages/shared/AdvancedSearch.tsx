import React, { useState } from 'react';
import NavigationPlaceholder from '../../components/ui/NavigationPlaceholder';

const AdvancedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [experience, setExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - será substituído por hooks do Supabase
  const categories = [
    'Garçom/Garçonete',
    'Chef de Cozinha',
    'Auxiliar de Cozinha',
    'Bartender',
    'Recepcionista',
    'Gerente',
    'Limpeza',
    'Segurança',
    'Entregador',
    'Caixa'
  ];

  const skills = [
    'Atendimento ao Cliente',
    'Conhecimento em Vinhos',
    'Preparo de Drinks',
    'Cozinha Italiana',
    'Cozinha Japonesa',
    'Gestão de Equipe',
    'Inglês Fluente',
    'Espanhol',
    'Organização',
    'Multitarefa'
  ];

  const experienceOptions = [
    { value: '', label: 'Qualquer experiência' },
    { value: 'entry', label: 'Iniciante (0-1 ano)' },
    { value: 'junior', label: 'Júnior (1-3 anos)' },
    { value: 'mid', label: 'Pleno (3-5 anos)' },
    { value: 'senior', label: 'Sênior (5+ anos)' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'distance', label: 'Mais Próximo' },
    { value: 'price_low', label: 'Menor Preço' },
    { value: 'price_high', label: 'Maior Preço' },
    { value: 'newest', label: 'Mais Recente' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Qualquer horário' },
    { value: 'morning', label: 'Manhã' },
    { value: 'afternoon', label: 'Tarde' },
    { value: 'evening', label: 'Noite' },
    { value: 'weekend', label: 'Fins de semana' },
    { value: 'fulltime', label: 'Tempo integral' },
    { value: 'parttime', label: 'Meio período' }
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setDistance(10);
    setRating(0);
    setAvailability('');
    setPriceRange([0, 1000]);
    setExperience('');
    setSelectedSkills([]);
    setSortBy('relevance');
  };

  const saveSearch = () => {
    // Aqui será implementada a lógica de salvar busca via Supabase
    console.log('Salvando busca...');
  };

  const handleSearch = () => {
    // Aqui será implementada a lógica de busca via Supabase
    console.log('Executando busca...');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <NavigationPlaceholder to="/back" className="cursor-pointer">
              <i className="fas fa-arrow-left text-xl mr-3 text-gray-600"></i>
            </NavigationPlaceholder>
            <h1 className="text-xl font-bold">Busca Avançada</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveSearch}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="fas fa-bookmark text-gray-600"></i>
            </button>
            <button
              onClick={clearFilters}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="fas fa-eraser text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar profissionais..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Quick Filters Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-600 text-sm cursor-pointer"
          >
            <span>{showFilters ? 'Ocultar' : 'Mostrar'} filtros</span>
            <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'} ml-1`}></i>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 rounded-full text-sm cursor-pointer ${
                      selectedCategories.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Distância: {distance} km</h3>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Avaliação Mínima</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl cursor-pointer ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Disponibilidade</h3>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">
                Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Mínimo: R$ {priceRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Máximo: R$ {priceRange[1]}</label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Experiência</h3>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {experienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-full text-sm cursor-pointer ${
                      selectedSkills.includes(skill)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Ordenar por</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700"
          >
            <i className="fas fa-search mr-2"></i>
            Buscar Profissionais
          </button>
          
          {/* Active Filters Summary */}
          {(selectedCategories.length > 0 || selectedSkills.length > 0 || rating > 0) && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2">Filtros Ativos:</h4>
              <div className="space-y-2 text-sm">
                {selectedCategories.length > 0 && (
                  <div>
                    <span className="text-gray-600">Categorias: </span>
                    <span className="text-blue-600">{selectedCategories.join(', ')}</span>
                  </div>
                )}
                {selectedSkills.length > 0 && (
                  <div>
                    <span className="text-gray-600">Habilidades: </span>
                    <span className="text-green-600">{selectedSkills.join(', ')}</span>
                  </div>
                )}
                {rating > 0 && (
                  <div>
                    <span className="text-gray-600">Avaliação: </span>
                    <span className="text-yellow-600">{rating}+ estrelas</span>
                  </div>
                )}
                {distance < 50 && (
                  <div>
                    <span className="text-gray-600">Distância: </span>
                    <span className="text-purple-600">até {distance} km</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;