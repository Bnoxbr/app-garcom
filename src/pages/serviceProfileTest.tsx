// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sobre');
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Segunda');

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
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
      photo: 'https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520restaurant%2520manager%2520in%2520business%2520attire%252C%2520confident%2520expression%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=50&height=50&seq=11&orientation=squarish',
      date: '15 abril, 2025',
      rating: 5,
      comment: 'A Mariana foi excepcional! Extremamente profissional, pontual e atenciosa com todos os clientes. Seu conhecimento sobre vinhos impressionou nossos clientes mais exigentes. Definitivamente voltaremos a contratá-la para eventos especiais.'
    },
    {
      id: 2,
      name: 'Bistrô Gourmet',
      photo: 'https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520bistro%2520owner%2520in%2520casual%2520elegant%2520attire%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520bistro%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=50&height=50&seq=12&orientation=squarish',
      date: '2 abril, 2025',
      rating: 4,
      comment: 'Mariana trabalhou em nosso bistrô durante um fim de semana movimentado. Ela se adaptou rapidamente à nossa dinâmica e demonstrou grande habilidade no atendimento. Apenas um pequeno detalhe sobre a organização das mesas poderia ter sido melhor.'
    },
    {
      id: 3,
      name: 'Cantina Della Nonna',
      photo: 'https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520an%2520Italian%2520restaurant%2520owner%252C%2520middle-aged%2520woman%2520with%2520warm%2520smile%252C%2520casual%2520elegant%2520attire%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=50&height=50&seq=13&orientation=squarish',
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
            <a 
              href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c" 
              data-readdy="true"
              className="flex items-center cursor-pointer"
            >
              <i className="fas fa-arrow-left text-lg mr-3"></i>
            </a>
            <h1 className="text-lg font-medium">Perfil Profissional</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-share-alt text-lg"></i>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-ellipsis-v text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-24 px-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center mt-6 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520elegant%2520black%2520uniform%252C%2520confident%2520posture%252C%2520warm%2520smile%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=200&height=200&seq=6&orientation=squarish"
              alt="Mariana Silva"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">Mariana Silva</h2>
          <p className="text-gray-600 mb-2">Garçonete Profissional</p>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center text-yellow-500">
              <i className="fas fa-star mr-1"></i>
              <span className="font-medium">4.8</span>
              <span className="text-gray-500 ml-1">(47)</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center text-gray-600">
              <i className="fas fa-map-marker-alt mr-1"></i>
              <span>1.2 km</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Disponível agora
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-5 border-b border-gray-200">
          <div className="flex overflow-x-auto space-x-6 pb-2">
            <button
              onClick={() => setActiveTab('sobre')}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
                activeTab === 'sobre'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => setActiveTab('experiencia')}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
                activeTab === 'experiencia'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Experiência
            </button>
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
                activeTab === 'avaliacoes'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Avaliações
            </button>
            <button
              onClick={() => setActiveTab('disponibilidade')}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
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
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Avaliação Geral</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">4.8</span>
                    <div className="flex text-yellow-500">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm w-24">Pontualidade</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-[95%]"></div>
                    </div>
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm w-24">Atendimento</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-[90%]"></div>
                    </div>
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm w-24">Conhecimento</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-[95%]"></div>
                    </div>
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm w-24">Apresentação</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-[90%]"></div>
                    </div>
                    <span className="text-sm font-medium">4.7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start mb-3">
                      <img 
                        src={review.photo} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{review.name}</h4>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex text-yellow-500 text-xs mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}

                <button className="w-full py-3 text-gray-700 font-medium text-sm bg-gray-100 rounded-lg cursor-pointer">
                  Ver todas as avaliações
                </button>
              </div>
            </div>
          )}

          {/* Disponibilidade Tab */}
          {activeTab === 'disponibilidade' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Disponibilidade Semanal</h3>
                
                <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium min-w-[80px] ${
                        selectedDay === day
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {availabilityData[selectedDay as keyof typeof availabilityData].map((slot: TimeSlot, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <i className={`fas fa-clock mr-3 ${slot.available ? 'text-green-500' : 'text-red-500'}`}></i>
                        <span className="text-sm">{slot.time}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        slot.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {slot.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-3">Agendar Horário</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Selecione uma data e horário para verificar a disponibilidade e fazer uma reserva.
                </p>
                <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium text-sm cursor-pointer !rounded-button">
                  Verificar Disponibilidade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">Valor por hora</p>
            <p className="text-xl font-bold">R$ 45,00</p>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-green-600"></i>
            <span className="text-xs text-green-600 font-medium">Profissional Verificado</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm cursor-pointer flex items-center justify-center !rounded-button">
            <i className="fas fa-comment-alt mr-2"></i>
            Iniciar Chat
          </button>
          <button className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium text-sm cursor-pointer !rounded-button">
            Contratar Agora
          </button>
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

