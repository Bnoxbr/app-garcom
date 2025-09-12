import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Professional } from '../../types';
import { Loading, ErrorMessage } from '../../components';

const ProfessionalProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('informacoes');

  useEffect(() => {
    if (id) {
      fetchProfessional(id);
    }
  }, [id]);

  const fetchProfessional = async (professionalId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', professionalId)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setProfessional(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissional');
    } finally {
      setLoading(false);
    }
  };

  const portfolioPhotos = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop'
  ];

  const workHistory = [
    {
      id: 1,
      client: 'Restaurante Bella Vista',
      event: 'Jantar Corporativo',
      date: '15/04/2025',
      status: 'Finalizado',
      rating: 4.8,
      review: 'Excelente profissional, muito atencioso e pontual.'
    },
    {
      id: 2,
      client: 'Eventos Premium',
      event: 'Casamento',
      date: '02/05/2025',
      status: 'Em andamento',
      rating: 4.9,
      review: ''
    },
    {
      id: 3,
      client: 'Hotel Luxo',
      event: 'Evento Corporativo',
      date: '28/04/2025',
      status: 'Finalizado',
      rating: 4.7,
      review: 'Profissional dedicado e experiente.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Carregando perfil..." size="lg" />
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage 
          message={error || 'Profissional não encontrado'} 
          onRetry={() => id && fetchProfessional(id)}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            >
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </button>
            <h1 className="text-xl font-bold">Perfil do Profissional</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-share text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16 px-0">
        {/* Cover Image and Profile */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-utensils text-white text-6xl opacity-20"></i>
            </div>
          </div>
          <div className="absolute -bottom-16 left-4 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src={professional.image || '/placeholder-avatar.jpg'}
              alt={professional.name}
              className="w-24 h-24 object-cover"
            />
          </div>
        </div>

        {/* Professional Name and Info */}
        <div className="mt-20 px-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{professional.name}</h2>
              <p className="text-gray-600 text-lg">{professional.category}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span>{professional.rating}</span>
                  <span className="ml-1">({professional.reviews} avaliações)</span>
                </div>
                <span className="ml-3 text-gray-600 text-sm">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {professional.distance}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{professional.price}</div>
              <div className={`text-sm px-3 py-1 rounded-full ${
                professional.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {professional.available ? 'Disponível' : 'Indisponível'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 mt-6 flex space-x-3">
          <button className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium flex items-center justify-center">
            <i className="fas fa-calendar-plus mr-2"></i>
            Contratar
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium flex items-center justify-center">
            <i className="fas fa-comment mr-2"></i>
            Mensagem
          </button>
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
                activeTab === 'portfolio' 
                  ? 'border-gray-800 text-gray-800' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfólio
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'avaliacoes' 
                  ? 'border-gray-800 text-gray-800' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('avaliacoes')}
            >
              Avaliações
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
                <h3 className="font-semibold text-lg mb-3">Sobre</h3>
                <p className="text-gray-600 text-sm">
                  {professional.description || 'Profissional experiente e dedicado, sempre buscando oferecer o melhor atendimento aos clientes.'}
                </p>
              </div>

              {/* Especialidades */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {professional.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Atendimento Premium
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Eventos Corporativos
                  </span>
                </div>
              </div>

              {/* Experiência */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-3">Experiência</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-briefcase text-gray-500 w-6"></i>
                    <span className="ml-2 text-sm">5+ anos de experiência</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-certificate text-gray-500 w-6"></i>
                    <span className="ml-2 text-sm">Certificado em Hospitalidade</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-language text-gray-500 w-6"></i>
                    <span className="ml-2 text-sm">Português, Inglês</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfólio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Trabalhos Realizados</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {portfolioPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`Trabalho ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avaliações Tab */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Histórico de Trabalhos</h3>
              </div>
              {workHistory.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{work.client}</h4>
                      <p className="text-sm text-gray-600">{work.event}</p>
                      <p className="text-xs text-gray-500">{work.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        work.status === 'Finalizado' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {work.status}
                      </span>
                      {work.rating && (
                        <div className="flex items-center mt-1">
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                          <span className="text-sm ml-1">{work.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {work.review && (
                    <p className="text-sm text-gray-600 italic mt-2">
                      "{work.review}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;