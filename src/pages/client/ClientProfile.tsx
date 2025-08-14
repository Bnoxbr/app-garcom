import React, { useState } from 'react';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import NavigationPlaceholder from '../../components/ui/NavigationPlaceholder';

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('informacoes');
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data - será substituído por hooks do Supabase
  const restaurantInfo = {
    name: 'Restaurante Sabor & Arte',
    address: 'Av. Paulista, 1578, Bela Vista, São Paulo - SP',
    phone: '(11) 3456-7890',
    email: 'contato@saborarte.com.br',
    website: 'www.saborarte.com.br',
    openingHours: [
      { day: 'Segunda-feira', hours: '11:00 - 22:00' },
      { day: 'Terça-feira', hours: '11:00 - 22:00' },
      { day: 'Quarta-feira', hours: '11:00 - 22:00' },
      { day: 'Quinta-feira', hours: '11:00 - 23:00' },
      { day: 'Sexta-feira', hours: '11:00 - 00:00' },
      { day: 'Sábado', hours: '12:00 - 00:00' },
      { day: 'Domingo', hours: '12:00 - 22:00' },
    ],
    specialties: ['Italiana', 'Mediterrânea', 'Contemporânea', 'Frutos do Mar'],
    description:
      'Fundado em 2015, o Restaurante Sabor & Arte traz o melhor da gastronomia italiana e mediterrânea com um toque contemporâneo. Nossa equipe de chefs experientes seleciona os ingredientes mais frescos para criar pratos memoráveis em um ambiente acolhedor e sofisticado. Oferecemos uma experiência gastronômica completa, com carta de vinhos premiada e atendimento personalizado.',
  };

  const photos = [
    null, null, null, null, null, null, null, null, null // Placeholders serão usados
  ];

  const hiringHistory = [
    {
      id: 1,
      name: 'Mariana Silva',
      photo: null, // Placeholder será usado
      position: 'Garçonete',
      date: '15/04/2025',
      status: 'Finalizado',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Carlos Oliveira',
      photo: null,
      position: 'Chef Auxiliar',
      date: '02/05/2025',
      status: 'Em andamento',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Juliana Mendes',
      photo: null,
      position: 'Recepcionista',
      date: '28/04/2025',
      status: 'Finalizado',
      rating: 4.7,
    },
  ];

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <NavigationPlaceholder to="/dashboard" className="cursor-pointer">
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </NavigationPlaceholder>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
          <div className="flex items-center">
            <NavigationPlaceholder to="/settings" className="p-2 rounded-full hover:bg-gray-800">
              <i className="fas fa-cog text-lg"></i>
            </NavigationPlaceholder>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16 px-0">
        {/* Cover Image and Profile */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden">
            <PlaceholderImage 
              type="restaurant" 
              size="375x150" 
              className="w-full h-full object-cover object-top" 
              alt="Capa do restaurante"
            />
          </div>
          <div className="absolute -bottom-16 left-4 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <PlaceholderImage 
              type="restaurant" 
              size="100x100" 
              className="w-24 h-24 object-cover" 
              alt="Logo do restaurante"
            />
          </div>
        </div>

        {/* Restaurant Name and Edit Button */}
        <div className="mt-20 px-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm flex items-center cursor-pointer"
          >
            <i
              className={`fas ${isEditMode ? 'fa-check' : 'fa-edit'} mr-2`}
            ></i>
            <span>{isEditMode ? 'Salvar' : 'Editar Perfil'}</span>
          </button>
        </div>

        {/* Specialties Tags */}
        <div className="px-4 mt-2 flex flex-wrap gap-2">
          {restaurantInfo.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex px-4">
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'informacoes'
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('informacoes')}
            >
              Informações
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'fotos'
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('fotos')}
            >
              Fotos
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'gestao'
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('gestao')}
            >
              Gestão
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {/* Informações Tab */}
          {activeTab === 'informacoes' && (
            <div className="space-y-6">
              {/* Descrição */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Descrição</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    defaultValue={restaurantInfo.description}
                  ></textarea>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {restaurantInfo.description}
                  </p>
                )}
              </div>

              {/* Endereço */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3"
                    defaultValue={restaurantInfo.address}
                  />
                ) : (
                  <p className="text-gray-600 text-sm mb-3">
                    {restaurantInfo.address}
                  </p>
                )}
                <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-200">
                  <PlaceholderImage 
                    type="general" 
                    size="375x160" 
                    className="w-full h-full object-cover" 
                    alt="Mapa"
                  />
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    Horário de Funcionamento
                  </h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {restaurantInfo.openingHours.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.day}</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="w-32 p-1 border border-gray-300 rounded text-sm"
                          defaultValue={item.hours}
                        />
                      ) : (
                        <span className="font-medium">{item.hours}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contato */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Contato</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-phone text-gray-500 w-6"></i>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="ml-2 p-2 border border-gray-300 rounded text-sm flex-1"
                        defaultValue={restaurantInfo.phone}
                      />
                    ) : (
                      <span className="ml-2 text-sm">
                        {restaurantInfo.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-gray-500 w-6"></i>
                    {isEditMode ? (
                      <input
                        type="email"
                        className="ml-2 p-2 border border-gray-300 rounded text-sm flex-1"
                        defaultValue={restaurantInfo.email}
                      />
                    ) : (
                      <span className="ml-2 text-sm">
                        {restaurantInfo.email}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-globe text-gray-500 w-6"></i>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="ml-2 p-2 border border-gray-300 rounded text-sm flex-1"
                        defaultValue={restaurantInfo.website}
                      />
                    ) : (
                      <span className="ml-2 text-sm">{restaurantInfo.website}</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <NavigationPlaceholder to="/social/instagram" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    <i className="fab fa-instagram"></i>
                  </NavigationPlaceholder>
                  <NavigationPlaceholder to="/social/facebook" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    <i className="fab fa-facebook-f"></i>
                  </NavigationPlaceholder>
                  <NavigationPlaceholder to="/social/whatsapp" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    <i className="fab fa-whatsapp"></i>
                  </NavigationPlaceholder>
                </div>
              </div>
            </div>
          )}

          {/* Fotos Tab */}
          {activeTab === 'fotos' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Galeria de Fotos</h3>
                {isEditMode && (
                  <button className="flex items-center text-gray-800 text-sm bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <i className="fas fa-plus mr-2"></i>
                    <span>Adicionar</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <PlaceholderImage 
                      type="food" 
                      size="150x150" 
                      className="w-full h-full object-cover" 
                      alt={`Foto ${index + 1}`}
                    />
                    {isEditMode && (
                      <button className="absolute top-1 right-1 bg-white bg-opacity-70 w-6 h-6 rounded-full flex items-center justify-center text-red-500 cursor-pointer">
                        <i className="fas fa-times text-sm"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gestão Tab */}
          {activeTab === 'gestao' && (
            <div className="space-y-4">
              {/* Cards de acesso rápido */}
              <div className="grid grid-cols-2 gap-3">
                <NavigationPlaceholder to="/preferences" className="bg-white rounded-lg shadow-sm p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h4 className="font-medium">Preferências de Contratação</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Configure suas preferências para contratação
                  </p>
                </NavigationPlaceholder>
                <NavigationPlaceholder to="/history" className="bg-white rounded-lg shadow-sm p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-history"></i>
                  </div>
                  <h4 className="font-medium">Histórico de Profissionais</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Veja profissionais contratados anteriormente
                  </p>
                </NavigationPlaceholder>
                <NavigationPlaceholder to="/reviews" className="bg-white rounded-lg shadow-sm p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="font-medium">Avaliações e Comentários</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Gerencie avaliações do seu estabelecimento
                  </p>
                </NavigationPlaceholder>
                <NavigationPlaceholder to="/documents" className="bg-white rounded-lg shadow-sm p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h4 className="font-medium">Documentos e Certificações</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Gerencie documentos do estabelecimento
                  </p>
                </NavigationPlaceholder>
              </div>

              {/* Histórico recente */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">
                  Histórico Recente
                </h3>
                <div className="space-y-3">
                  {hiringHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm p-4 flex items-center"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <PlaceholderImage 
                          type="profile" 
                          size="60x60" 
                          className="w-full h-full object-cover" 
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === 'Finalizado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm text-gray-500">
                            <span>{item.position}</span>
                            <span className="mx-2">•</span>
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center text-yellow-500 text-sm">
                            <i className="fas fa-star mr-1"></i>
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <NavigationPlaceholder to="/history/full" className="w-full mt-3 py-3 text-center text-gray-600 text-sm">
                  Ver histórico completo
                </NavigationPlaceholder>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-10">
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
          <NavigationPlaceholder
            to="/calendar"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-calendar-alt text-lg"></i>
            <span className="text-xs mt-1">Agenda</span>
          </NavigationPlaceholder>
          <NavigationPlaceholder
            to="/chat"
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <i className="fas fa-comment-alt text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </NavigationPlaceholder>
          <div className="flex flex-col items-center justify-center text-gray-800">
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;