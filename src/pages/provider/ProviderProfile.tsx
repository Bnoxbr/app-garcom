import React, { useState } from 'react';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import NavigationPlaceholder from '../../components/ui/NavigationPlaceholder';

const ProviderProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sobre');
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Segunda');

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  // Mock data - será substituído por hooks do Supabase
  const availabilityData = {
    'Segunda': [
      { time: '08:00 - 12:00', available: true },
      { time: '13:00 - 17:00', available: true },
      { time: '18:00 - 22:00', available: false }
    ],
    'Terça': [
      { time: '08:00 - 12:00', available: true },
      { time: '13:00 - 17:00', available: false },
      { time: '18:00 - 22:00', available: true }
    ],
    'Quarta': [
      { time: '08:00 - 12:00', available: false },
      { time: '13:00 - 17:00', available: true },
      { time: '18:00 - 22:00', available: true }
    ],
    'Quinta': [
      { time: '08:00 - 12:00', available: true },
      { time: '13:00 - 17:00', available: true },
      { time: '18:00 - 22:00', available: false }
    ],
    'Sexta': [
      { time: '08:00 - 12:00', available: false },
      { time: '13:00 - 17:00', available: false },
      { time: '18:00 - 22:00', available: true }
    ],
    'Sábado': [
      { time: '08:00 - 12:00', available: true },
      { time: '13:00 - 17:00', available: true },
      { time: '18:00 - 22:00', available: true }
    ],
    'Domingo': [
      { time: '08:00 - 12:00', available: false },
      { time: '13:00 - 17:00', available: false },
      { time: '18:00 - 22:00', available: false }
    ]
  };

  const reviews = [
    {
      id: 1,
      name: 'Restaurante Sabor Brasileiro',
      photo: null, // Placeholder será usado
      date: '15 abril, 2025',
      rating: 5,
      comment: 'A Mariana foi excepcional! Extremamente profissional, pontual e atenciosa com todos os clientes. Seu conhecimento sobre vinhos impressionou nossos clientes mais exigentes. Definitivamente voltaremos a contratá-la para eventos especiais.'
    },
    {
      id: 2,
      name: 'Bistrô Gourmet',
      photo: null,
      date: '2 abril, 2025',
      rating: 4,
      comment: 'Mariana trabalhou em nosso bistrô durante um fim de semana movimentado. Ela se adaptou rapidamente à nossa dinâmica e demonstrou grande habilidade no atendimento. Apenas um pequeno detalhe sobre a organização das mesas poderia ter sido melhor.'
    },
    {
      id: 3,
      name: 'Cantina Della Nonna',
      photo: null,
      date: '20 março, 2025',
      rating: 5,
      comment: 'Contratamos a Mariana para um evento privado em nossa cantina e ela superou todas as expectativas! Seu atendimento personalizado e atenção aos detalhes fizeram toda a diferença. Os clientes elogiaram muito o serviço.'
    }
  ];

  const experiences = [
    {
      id: 1,
      establishment: 'Restaurante Vila Madá',
      period: 'Janeiro 2023 - Atual',
      position: 'Garçonete Sênior',
      responsibilities: 'Atendimento em salão principal, coordenação de equipe de garçons júnior, especialista em harmonização de vinhos, responsável pelo treinamento de novos colaboradores.'
    },
    {
      id: 2,
      establishment: 'Bistrô Francês Le Petit',
      period: 'Março 2020 - Dezembro 2022',
      position: 'Garçonete',
      responsibilities: 'Atendimento em restaurante fine dining, serviço à francesa, conhecimento avançado em etiqueta e protocolo, responsável pelo atendimento de clientes VIP.'
    },
    {
      id: 3,
      establishment: 'Restaurante Sabor & Arte',
      period: 'Junho 2018 - Fevereiro 2020',
      position: 'Garçonete Auxiliar',
      responsibilities: 'Apoio no atendimento aos clientes, organização de mesas, controle de pedidos, auxílio no serviço de bebidas.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <NavigationPlaceholder to="/dashboard" className="cursor-pointer">
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </NavigationPlaceholder>
            <h1 className="text-xl font-bold">Perfil do Profissional</h1>
          </div>
          <div className="flex items-center">
            <NavigationPlaceholder to="/settings" className="p-2 rounded-full hover:bg-gray-800">
              <i className="fas fa-cog text-lg"></i>
            </NavigationPlaceholder>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-4">
            <div className="relative mr-4">
              <PlaceholderImage 
                type="profile" 
                size="80x80" 
                className="rounded-full" 
                alt="Foto do profissional"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white bg-green-500"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Mariana Silva</h2>
              <p className="text-gray-600">Garçonete Sênior</p>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8 (47 avaliações)</span>
              </div>
              <div className="flex items-center mt-2">
                <i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                <span className="text-sm text-gray-600">São Paulo, SP</span>
                <span className="text-sm text-gray-400 mx-2">•</span>
                <span className="text-sm text-green-600">Disponível</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">R$ 25/h</p>
              <p className="text-xs text-gray-500">Preço base</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">7+</p>
              <p className="text-xs text-gray-500">Anos exp.</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">98%</p>
              <p className="text-xs text-gray-500">Aprovação</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('sobre')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                activeTab === 'sobre'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => setActiveTab('experiencia')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                activeTab === 'experiencia'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Experiência
            </button>
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                activeTab === 'avaliacoes'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Avaliações
            </button>
            <button
              onClick={() => setActiveTab('disponibilidade')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                activeTab === 'disponibilidade'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Disponibilidade
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-20">
          {/* Sobre Tab */}
          {activeTab === 'sobre' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-2">Biografia</h3>
                <p className="text-gray-600 text-sm">
                  {showFullBio 
                    ? "Profissional com mais de 7 anos de experiência em restaurantes de alto padrão. Especializada em atendimento personalizado e harmonização de vinhos. Formada em Gastronomia com ênfase em serviços de sala. Busco sempre oferecer aos clientes uma experiência gastronômica completa, com atenção aos detalhes e excelência no atendimento. Tenho facilidade para trabalhar em equipe e lidar com situações de alta demanda, mantendo a qualidade do serviço e a satisfação do cliente como prioridades."
                    : "Profissional com mais de 7 anos de experiência em restaurantes de alto padrão. Especializada em atendimento personalizado e harmonização de vinhos. Formada em Gastronomia com ênfase em serviços de sala..."
                  }
                </p>
                <button 
                  onClick={() => setShowFullBio(!showFullBio)} 
                  className="text-gray-800 text-sm font-medium mt-2 cursor-pointer"
                >
                  {showFullBio ? "Ver menos" : "Ver mais"}
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Atendimento VIP</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Harmonização de vinhos</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Serviço à francesa</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Etiqueta à mesa</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Gestão de equipe</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Inglês fluente</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Idiomas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Português</span>
                    <span className="text-sm text-gray-600">Nativo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Inglês</span>
                    <span className="text-sm text-gray-600">Fluente</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Espanhol</span>
                    <span className="text-sm text-gray-600">Intermediário</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Francês</span>
                    <span className="text-sm text-gray-600">Básico</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Certificações</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <i className="fas fa-certificate text-yellow-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm font-medium">Sommelier Nível 1</p>
                      <p className="text-xs text-gray-500">Associação Brasileira de Sommeliers, 2022</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-certificate text-yellow-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm font-medium">Serviços de Sala e Bar</p>
                      <p className="text-xs text-gray-500">Senac São Paulo, 2020</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-certificate text-yellow-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm font-medium">Manipulação de Alimentos</p>
                      <p className="text-xs text-gray-500">Vigilância Sanitária, 2023</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-3">Preferências de Trabalho</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <i className="fas fa-clock text-gray-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm">Disponibilidade</p>
                      <p className="text-xs text-gray-500">Período noturno e finais de semana</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-gray-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm">Região de atuação</p>
                      <p className="text-xs text-gray-500">Até 15km do centro</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-utensils text-gray-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm">Especialidade</p>
                      <p className="text-xs text-gray-500">Restaurantes fine dining e eventos corporativos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experiência Tab */}
          {activeTab === 'experiencia' && (
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{exp.establishment}</h3>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-2">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.responsibilities}</p>
                </div>
              ))}

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-3">Formação</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">Tecnólogo em Gastronomia</p>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">2016 - 2018</span>
                    </div>
                    <p className="text-xs text-gray-500">Universidade Anhembi Morumbi</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">Curso Técnico em Serviços de Restaurante</p>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">2015 - 2016</span>
                    </div>
                    <p className="text-xs text-gray-500">Senac São Paulo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Avaliações Tab */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start mb-3">
                    <PlaceholderImage 
                      type="restaurant" 
                      size="50x50" 
                      className="rounded-full mr-3" 
                      alt={review.name}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{review.name}</h4>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Disponibilidade Tab */}
          {activeTab === 'disponibilidade' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Agenda Semanal</h3>
                <div className="flex overflow-x-auto space-x-2 mb-4">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
                        selectedDay === day
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {availabilityData[selectedDay as keyof typeof availabilityData]?.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{slot.time}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        slot.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {slot.available ? 'Disponível' : 'Ocupado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <NavigationPlaceholder 
            to="/chat" 
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium text-center"
          >
            <i className="fas fa-comment mr-2"></i>
            Chat
          </NavigationPlaceholder>
          <NavigationPlaceholder 
            to="/hire" 
            className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-lg font-medium text-center"
          >
            <i className="fas fa-handshake mr-2"></i>
            Contratar
          </NavigationPlaceholder>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex">
          <NavigationPlaceholder to="/home" className="flex-1 py-3 text-center">
            <i className="fas fa-home text-gray-400 text-lg"></i>
          </NavigationPlaceholder>
          <NavigationPlaceholder to="/search" className="flex-1 py-3 text-center">
            <i className="fas fa-search text-gray-400 text-lg"></i>
          </NavigationPlaceholder>
          <NavigationPlaceholder to="/messages" className="flex-1 py-3 text-center">
            <i className="fas fa-comment text-gray-400 text-lg"></i>
          </NavigationPlaceholder>
          <NavigationPlaceholder to="/profile" className="flex-1 py-3 text-center">
            <i className="fas fa-user text-gray-800 text-lg"></i>
          </NavigationPlaceholder>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;