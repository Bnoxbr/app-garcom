import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components';

// Importa os tipos de dados
import type { Professional, Profile } from '../../types';

interface UserProfileProps {
  userType: 'prestador' | 'contratante';
}

const UserProfile: React.FC<UserProfileProps> = ({ userType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Professional | Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sobre');
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError('ID do perfil não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let tableName = '';
        let profileType = '';
        
        if (userType === 'prestador') {
          tableName = 'professionals';
          profileType = 'professional';
        }
        else if (userType === 'contratante') {
          tableName = 'profiles';
          profileType = 'profile';
        }

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          console.log(`Perfil carregado (${profileType}):`, data);
          setProfile(data);
        } else {
          setError('Perfil não encontrado.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Removida a verificação de usuário autenticado para permitir visualização pública
    fetchProfile();
  }, [id, userType]);


  // Exibe loading ou erro
  if (loading) {
    return <Loading message="Carregando perfil..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }
  
  if (!profile) {
    return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => {}} />;
  }
  
  // Verifica se é um profissional
  const isProfessional = userType === 'prestador';
  const professional = isProfessional ? profile as Professional : null;

  // Lógica para renderização da página
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer"
            >
              <i className="fas fa-arrow-left text-lg mr-3"></i>
            </button>
            <h1 className="text-lg font-medium">Perfil Profissional</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-share-alt text-lg"></i>
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
              src={profile?.avatar_url || "/images/default-avatar.svg"}
              alt={`Foto de ${profile?.name || 'perfil'}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/default-avatar.svg";
              }}
            />
          </div>
          <h2 className="text-2xl font-bold">{profile?.name}</h2>
          {isProfessional && (
            <p className="text-gray-600 mb-2">{professional?.category?.name || 'Profissional'}</p>
          )}
          
          {isProfessional && (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star mr-1"></i>
                <span className="font-medium">{professional?.rating || '0.0'}</span>
                <span className="text-gray-500 ml-1">({professional?.reviews || '0'})</span>
              </div>
              {professional?.distance && (
                <>
                  <div className="w-1 h-4 bg-gray-300"></div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    <span>{professional.distance}</span>
                  </div>
                </>
              )}
              {professional?.available && (
                <>
                  <div className="w-1 h-4 bg-gray-300"></div>
                  <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Disponível agora
                  </div>
                </>
              )}
            </div>
          )}
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
            {isProfessional && (
              <>
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
              </>
            )}
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
                  {profile?.bio ? (
                    showFullBio || profile.bio.length <= 150 
                      ? profile.bio
                      : `${profile.bio.substring(0, 150)}...`
                  ) : 'Nenhuma biografia disponível.'}
                </p>
                {profile?.bio && profile.bio.length > 150 && (
                  <button 
                    onClick={() => setShowFullBio(!showFullBio)} 
                    className="text-gray-800 text-sm font-medium mt-2 cursor-pointer"
                  >
                    {showFullBio ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>

              {isProfessional && professional?.specialties && professional.specialties.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-semibold mb-3">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isProfessional && professional?.phone && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-semibold mb-3">Contato</h3>
                  <div className="flex items-center">
                    <i className="fas fa-phone text-gray-500 mr-2"></i>
                    <span className="text-gray-700">{professional.phone}</span>
                  </div>
                  {professional.email && (
                    <div className="flex items-center mt-2">
                      <i className="fas fa-envelope text-gray-500 mr-2"></i>
                      <span className="text-gray-700">{professional.email}</span>
                    </div>
                  )}
                </div>
              )}

              {isProfessional && professional?.address && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-semibold mb-3">Localização</h3>
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-gray-500 mt-1 mr-2"></i>
                    <div>
                      <p className="text-sm text-gray-700">
                        {professional.address.street}, {professional.address.number}
                        {professional.address.complement && `, ${professional.address.complement}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {professional.address.neighborhood}, {professional.address.city} - {professional.address.state}
                      </p>
                      <p className="text-sm text-gray-700">
                        CEP: {professional.address.cep}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experiência Tab - Placeholder */}
          {activeTab === 'experiencia' && isProfessional && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-semibold mb-3">Experiência Profissional</h3>
              <p className="text-gray-600 text-sm">Informações sobre experiência profissional serão adicionadas em breve.</p>
            </div>
          )}

          {/* Avaliações Tab - Placeholder */}
          {activeTab === 'avaliacoes' && isProfessional && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-semibold mb-3">Avaliações</h3>
              <p className="text-gray-600 text-sm">Avaliações de clientes serão adicionadas em breve.</p>
            </div>
          )}

          {/* Disponibilidade Tab - Placeholder */}
          {activeTab === 'disponibilidade' && isProfessional && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-semibold mb-3">Disponibilidade</h3>
              <p className="text-gray-600 text-sm">Informações sobre disponibilidade serão adicionadas em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;