// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("informacoes");
  const [isEditMode, setIsEditMode] = useState(false);

  const restaurantInfo = {
    name: "Restaurante Sabor & Arte",
    address: "Av. Paulista, 1578, Bela Vista, São Paulo - SP",
    phone: "(11) 3456-7890",
    email: "contato@saborarte.com.br",
    openingHours: [
      { day: "Segunda-feira", hours: "11:00 - 22:00" },
      { day: "Terça-feira", hours: "11:00 - 22:00" },
      { day: "Quarta-feira", hours: "11:00 - 22:00" },
      { day: "Quinta-feira", hours: "11:00 - 23:00" },
      { day: "Sexta-feira", hours: "11:00 - 00:00" },
      { day: "Sábado", hours: "12:00 - 00:00" },
      { day: "Domingo", hours: "12:00 - 22:00" },
    ],
    specialties: ["Italiana", "Mediterrânea", "Contemporânea", "Frutos do Mar"],
    description:
      "Fundado em 2015, o Restaurante Sabor & Arte traz o melhor da gastronomia italiana e mediterrânea com um toque contemporâneo. Nossa equipe de chefs experientes seleciona os ingredientes mais frescos para criar pratos memoráveis em um ambiente acolhedor e sofisticado. Oferecemos uma experiência gastronômica completa, com carta de vinhos premiada e atendimento personalizado.",
  };

  const photos = [
    "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20interior%20with%20warm%20lighting%2C%20wooden%20tables%2C%20comfortable%20seating%2C%20sophisticated%20decor%2C%20neutral%20color%20palette%2C%20ambient%20lighting%2C%20professional%20restaurant%20photography%2C%20no%20people%2C%20wide%20angle%20view%2C%20high-end%20dining%20establishment%2C%20polished%20surfaces%2C%20inviting%20atmosphere&width=150&height=150&seq=10&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Professional%20food%20photography%20of%20gourmet%20Italian%20pasta%20dish%20with%20seafood%2C%20beautifully%20plated%20on%20white%20ceramic%20plate%2C%20soft%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20restaurant%20quality%20presentation%2C%20garnished%20with%20fresh%20herbs%2C%20high-end%20culinary%20photography&width=150&height=150&seq=11&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20bar%20area%20with%20bottles%20display%2C%20professional%20bar%20setup%2C%20ambient%20lighting%2C%20polished%20glassware%2C%20sophisticated%20decor%2C%20neutral%20background%2C%20high-end%20establishment%20photography%2C%20no%20people%2C%20commercial%20interior%20photography&width=150&height=150&seq=12&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Professional%20food%20photography%20of%20Mediterranean%20seafood%20platter%2C%20beautifully%20arranged%20on%20rustic%20wooden%20board%2C%20fresh%20ingredients%2C%20vibrant%20colors%2C%20restaurant%20quality%20presentation%2C%20soft%20natural%20lighting%2C%20high-end%20culinary%20photography&width=150&height=150&seq=13&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Restaurant%20private%20dining%20area%20with%20elegant%20table%20setting%2C%20ambient%20lighting%2C%20sophisticated%20decor%2C%20neutral%20color%20palette%2C%20professional%20interior%20photography%2C%20no%20people%2C%20high-end%20dining%20establishment%2C%20intimate%20atmosphere&width=150&height=150&seq=14&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Professional%20food%20photography%20of%20gourmet%20dessert%2C%20beautifully%20plated%20with%20artistic%20presentation%2C%20drizzle%20of%20sauce%2C%20fresh%20berries%2C%20dusting%20of%20powdered%20sugar%2C%20soft%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20restaurant%20quality%20presentation&width=150&height=150&seq=15&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Restaurant%20outdoor%20terrace%20with%20elegant%20seating%2C%20ambient%20lighting%2C%20potted%20plants%2C%20sophisticated%20decor%2C%20neutral%20color%20palette%2C%20professional%20interior%20photography%2C%20no%20people%2C%20high-end%20dining%20establishment%2C%20evening%20atmosphere&width=150&height=150&seq=16&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Professional%20food%20photography%20of%20gourmet%20appetizer%2C%20beautifully%20plated%20with%20microgreens%2C%20dots%20of%20sauce%2C%20restaurant%20quality%20presentation%2C%20soft%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20high-end%20culinary%20photography&width=150&height=150&seq=17&orientation=squarish",
    "https://readdy.ai/api/search-image?query=Restaurant%20wine%20cellar%20with%20organized%20bottle%20display%2C%20ambient%20lighting%2C%20wooden%20racks%2C%20sophisticated%20storage%2C%20neutral%20background%2C%20professional%20interior%20photography%2C%20no%20people%2C%20high-end%20establishment%20photography&width=150&height=150&seq=18&orientation=squarish",
  ];

  const hiringHistory = [
    {
      id: 1,
      name: "Mariana Silva",
      photo:
        "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20female%20waitress%20in%20restaurant%20uniform%2C%20warm%20smile%2C%20confident%20posture%2C%20well-groomed%20appearance%2C%20neutral%20restaurant%20background%2C%20high%20quality%20professional%20headshot%2C%20soft%20lighting%2C%20realistic%20photo%2C%20subject%20fills%2080%20percent%20of%20frame&width=60&height=60&seq=19&orientation=squarish",
      position: "Garçonete",
      date: "15/04/2025",
      status: "Finalizado",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      photo:
        "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20male%20chef%20in%20white%20chef%20uniform%20and%20hat%2C%20confident%20expression%2C%20well-groomed%20appearance%2C%20neutral%20kitchen%20background%2C%20high%20quality%20professional%20headshot%2C%20soft%20lighting%2C%20realistic%20photo%2C%20subject%20fills%2080%20percent%20of%20frame&width=60&height=60&seq=20&orientation=squarish",
      position: "Chef Auxiliar",
      date: "02/05/2025",
      status: "Em andamento",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Juliana Mendes",
      photo:
        "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20female%20receptionist%20in%20business%20attire%2C%20warm%20welcoming%20smile%2C%20confident%20posture%2C%20well-groomed%20appearance%2C%20neutral%20hotel%20lobby%20background%2C%20high%20quality%20professional%20headshot%2C%20soft%20lighting%2C%20realistic%20photo%2C%20subject%20fills%2080%20percent%20of%20frame&width=60&height=60&seq=21&orientation=squarish",
      position: "Recepcionista",
      date: "28/04/2025",
      status: "Finalizado",
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
            <a
              href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
              data-readdy="true"
              className="cursor-pointer"
            >
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </a>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16 px-0">
        {/* Cover Image and Profile */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Restaurant%20storefront%20with%20elegant%20facade%2C%20outdoor%20seating%20area%2C%20warm%20lighting%2C%20sophisticated%20exterior%2C%20neutral%20color%20palette%2C%20professional%20architectural%20photography%2C%20no%20people%2C%20wide%20angle%20view%2C%20high-end%20dining%20establishment%2C%20evening%20atmosphere&width=375&height=150&seq=22&orientation=landscape"
              alt="Capa do restaurante"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-16 left-4 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src="https://readdy.ai/api/search-image?query=Restaurant%20logo%20design%20with%20elegant%20typography%2C%20minimalist%20icon%20of%20fork%20and%20knife%2C%20sophisticated%20color%20palette%2C%20professional%20branding%2C%20clean%20background%2C%20high%20quality%20vector%20style%2C%20restaurant%20identity%20design&width=100&height=100&seq=23&orientation=squarish"
              alt="Logo do restaurante"
              className="w-24 h-24 object-cover"
            />
          </div>
        </div>

        {/* Restaurant Name and Edit Button */}
        <div className="mt-20 px-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg !rounded-button shadow-sm flex items-center cursor-pointer"
          >
            <i
              className={`fas ${isEditMode ? "fa-check" : "fa-edit"} mr-2`}
            ></i>
            <span>{isEditMode ? "Salvar" : "Editar Perfil"}</span>
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
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "informacoes" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("informacoes")}
            >
              Informações
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "fotos" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("fotos")}
            >
              Fotos
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "gestao" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("gestao")}
            >
              Gestão
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {/* Informações Tab */}
          {activeTab === "informacoes" && (
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
                  <img
                    src="https://readdy.ai/api/search-image?query=Map%20view%20of%20Sao%20Paulo%20city%20center%20with%20location%20pin%2C%20street%20layout%2C%20urban%20area%2C%20neutral%20colors%2C%20professional%20cartography%20style%2C%20clean%20design%2C%20digital%20map%20representation&width=375&height=160&seq=24&orientation=landscape"
                    alt="Mapa"
                    className="w-full h-full object-cover"
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
                        defaultValue="www.saborarte.com.br"
                      />
                    ) : (
                      <span className="ml-2 text-sm">www.saborarte.com.br</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer">
                    <i className="fab fa-instagram"></i>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fotos Tab */}
          {activeTab === "fotos" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Galeria de Fotos</h3>
                {isEditMode && (
                  <button className="flex items-center text-gray-800 text-sm bg-gray-100 px-3 py-2 rounded-lg !rounded-button cursor-pointer">
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
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
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
          {activeTab === "gestao" && (
            <div className="space-y-4">
              {/* Cards de acesso rápido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h4 className="font-medium">Preferências de Contratação</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Configure suas preferências para contratação
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-history"></i>
                  </div>
                  <h4 className="font-medium">Histórico de Profissionais</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Veja profissionais contratados anteriormente
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="font-medium">Avaliações e Comentários</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Gerencie avaliações do seu estabelecimento
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mb-3">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h4 className="font-medium">Documentos e Certificações</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Gerencie documentos do estabelecimento
                  </p>
                </div>
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
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${item.status === "Finalizado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
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
                <button className="w-full mt-3 py-3 text-center text-gray-600 text-sm cursor-pointer">
                  Ver histórico completo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
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
          <div className="flex flex-col items-center justify-center text-gray-800 cursor-pointer">
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
