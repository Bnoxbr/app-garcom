import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components';

// Importa os tipos de dados
import type { Profile, Profissional, Contratante } from '../../types';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<(Profissional | Contratante) & Profile | null>(null);
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

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) {
          setError('Perfil não encontrado.');
          return;
        }

        let specificProfileData: Contratante | Profissional | null = null;
        let specificProfileError: any = null;

        if (profileData.role === 'profissional') {
          const { data, error } = await supabase
            .from('profissionais')
            .select('*')
            .eq('id', id)
            .single();
          specificProfileData = data;
          specificProfileError = error;
        } else if (profileData.role === 'contratante') {
          const { data, error } = await supabase
            .from('contratantes')
            .select('*')
            .eq('id', id)
            .single();
          specificProfileData = data;
          specificProfileError = error;
        }

        if (specificProfileError) throw specificProfileError;

        setProfile({ ...profileData, ...specificProfileData });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);


  if (loading) {
    return <Loading message="Carregando perfil..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }
  
  if (!profile) {
    return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => {}} />;
  }
  
  const isProfessional = profile.role === 'profissional';
  const professional = isProfessional ? profile as (Profissional & Profile) : null;
  const contratante = !isProfessional ? profile as (Contratante & Profile) : null;

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
              alt={`Foto de ${profile.full_name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/default-avatar.svg";
              }}
            />
          </div>
          <h2 className="text-2xl font-bold">{isProfessional ? professional?.full_name : contratante?.nome_fantasia}</h2>
          {isProfessional && professional?.categoria && (
            <p className="text-gray-600 mb-2">{professional.categoria}</p>
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

              {!isProfessional && contratante && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-semibold mb-3">Informações da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome Fantasia</p>
                      <p className="text-sm text-gray-900">{contratante.nome_fantasia}</p>
                    </div>
                    {/* Removido razao_social que não existe */}
                  </div>
                </div>
              )}

              {isProfessional && professional?.especialidades && professional.especialidades.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-semibold mb-3">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.especialidades.map((specialty: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold mb-3">Contato</h3>
                {isProfessional && professional?.telefone && (
                  <div className="flex items-center">
                    <i className="fas fa-phone text-gray-500 mr-2"></i>
                    <span className="text-gray-700">{professional.telefone}</span>
                  </div>
                )}
              </div>
              {isProfessional && professional && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.especialidades?.map((specialty: string, index: number) => (
                      <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
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