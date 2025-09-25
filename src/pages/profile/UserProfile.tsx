import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { ProfessionalWithProfile } from '../../hooks/useProfessionals';
import { Loading } from '../../components';
import { ErrorMessage } from '../../components';

// Tipagem baseada no tipo de retorno da nossa função RPC
type ProfessionalProfile = ProfessionalWithProfile;

const UserProfile = () => {
    // ---------------------------------------------------
    // 1. HOOKS E ESTADOS PARA GESTÃO DE DADOS E NAVEGAÇÃO
    // ---------------------------------------------------
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // ESTADOS PARA CONTROLE VISUAL (MANTIDOS DO MOCKUP)
    const [activeTab, setActiveTab] = useState('sobre');
    const [showFullBio, setShowFullBio] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Segunda'); // Para a aba Disponibilidade (se implementada)

    // ---------------------------------------------------
    // 2. LÓGICA DE BUSCA DE DADOS (USE EFFECT)
    // ---------------------------------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                setLoading(false);
                setError("ID do perfil não fornecido.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Chamada à função RPC, passando o ID do profissional como o parâmetro 'p_id'
                const { data, error: rpcError } = await supabase.rpc('get_professional_profile_by_id', { p_id: id });

                if (rpcError) {
                    console.error('Erro ao buscar perfil do profissional:', rpcError);
                    throw new Error(rpcError.message);
                }

                if (data && data.length > 0) {
                    // A função RPC retorna um array, pegamos o primeiro item.
                    setProfile(data[0]);
                } else {
                    setError('Perfil não encontrado.');
                }
            } catch (err: any) {
                setError(err.message || 'Ocorreu um erro ao carregar o perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    // ---------------------------------------------------
    // 3. CHECAGENS DE ESTADO INICIAL
    // ---------------------------------------------------
    if (loading) {
        return <Loading message="Carregando perfil..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={() => fetchProfile()} />; // Adiciona retry
    }
    
    if (!profile) {
        return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => fetchProfile()} />;
    }

    // ---------------------------------------------------
    // 4. PREPARAÇÃO DOS DADOS PARA O JSX (Mapeamento e Filtro)
    // ---------------------------------------------------
    const isProfessional = profile.role === 'professional'; // Filtro de Papel
    const professional = isProfessional ? profile as ProfessionalProfile : null;
    const contratante = !isProfessional ? profile as any : null; // Assumindo o tipo Contratante/Empresa

    // Variáveis para preencher o visual rico
    const profileAvatar = professional?.avatar_url || "/images/default-avatar.svg";
    const profileName = professional?.full_name || professional?.nome_completo || 'N/A';
    const profileCategory = professional?.categoria || 'Profissional';
    const hourlyRate = professional?.valor_hora ? `R$ ${professional.valor_hora.toFixed(2).replace('.', ',')}` : 'R$ N/A';
    
    // Lógica para Bio
    const isBioLong = professional?.bio ? professional.bio.length > 150 : false;
    const shortBio = professional?.bio ? professional.bio.substring(0, 150) + '...' : '';

    // MOCKS VISUAIS (Ajustar quando o backend estiver pronto)
    const profileRating = 4.8;
    const reviewsCount = 47;
    const isAvailable = true; 
    const isVerified = true;

    // ---------------------------------------------------
    // 5. JSX (A PARTE VISUAL RICA)
    // ---------------------------------------------------
    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
            {/* Nav Bar (Completo: Botão Voltar + Compartilhar/Opções) */}
            <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
    <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
            {/* O BOTÃO VOLTAR COM A LÓGICA */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700" 
            >
                <i className="fas fa-arrow-left text-lg mr-3"></i>
            </button>
            <h1 className="text-lg font-medium">Perfil Profissional</h1>
        </div>
                    <div className="flex items-center">
                        <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"><i className="fas fa-share-alt text-lg"></i></button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 pb-24 px-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center mt-6 mb-6">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                        <img src={profileAvatar} alt={profileName} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold">{profileName}</h2>
                    {isProfessional && <p className="text-gray-600 mb-2">{profileCategory}</p>}
                    
                    {/* Seção de Rating e Status (Apenas para profissionais) */}
                    {isProfessional && (
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <div className="flex items-center text-yellow-500">
                                <i className="fas fa-star mr-1"></i>
                                <span className="font-medium">{profileRating.toFixed(1)}</span>
                                <span className="text-gray-500 ml-1">({reviewsCount})</span>
                            </div>
                            <div className="w-1 h-4 bg-gray-300"></div>
                            <div className="flex items-center text-gray-600">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                <span>1.2 km</span>
                            </div>
                            <div className="w-1 h-4 bg-gray-300"></div>
                            {isAvailable && (
                                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                    Disponível agora
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs Navigation */}
                <div className="mb-5 border-b border-gray-200">
                    <div className="flex overflow-x-auto space-x-6 pb-2">
                        <button onClick={() => setActiveTab('sobre')} className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${activeTab === 'sobre' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}>Sobre</button>
                        {isProfessional && (
                            <>
                                <button onClick={() => setActiveTab('experiencia')} className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${activeTab === 'experiencia' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}>Experiência</button>
                                <button onClick={() => setActiveTab('avaliacoes')} className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${activeTab === 'avaliacoes' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}>Avaliações</button>
                                <button onClick={() => setActiveTab('disponibilidade')} className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${activeTab === 'disponibilidade' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}>Disponibilidade</button>
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
                                    {professional?.bio ? (showFullBio || !isBioLong ? professional.bio : shortBio) : 'Nenhuma biografia disponível.'}
                                </p>
                                {isProfessional && isBioLong && (
                                    <button onClick={() => setShowFullBio(!showFullBio)} className="text-gray-800 text-sm font-medium mt-2 cursor-pointer">
                                        {showFullBio ? "Ver menos" : "Ver mais"}
                                    </button>
                                )}
                            </div>

                            {/* Informações da Empresa (Apenas Contratante) */}
                            {!isProfessional && contratante && (
                                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                    <h3 className="font-semibold mb-3">Informações da Empresa</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Nome Fantasia</p>
                                            <p className="text-sm text-gray-900">{contratante.nome_fantasia || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Habilidades (Apenas Profissional) */}
                            {isProfessional && professional?.especialidades && professional.especialidades.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                    <h3 className="font-semibold mb-3">Habilidades</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {professional.especialidades.map((skill: string, index: number) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Contato (Profissional) */}
                             <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h3 className="font-semibold mb-3">Contato</h3>
                                {isProfessional && professional?.telefone && (
                                    <div className="flex items-center">
                                        <i className="fas fa-phone text-gray-500 mr-2"></i>
                                        <span className="text-gray-700">{professional.telefone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Outras Abas (Experiência, Avaliações, Disponibilidade) - Placeholder */}
                    {activeTab !== 'sobre' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h3 className="font-semibold mb-3">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                            <p className="text-gray-600 text-sm">Informações serão carregadas do banco de dados em breve.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Bar (Rodapé de Ação Completo) */}
            {isProfessional && (
                <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-gray-500">Valor por hora</p>
                            <p className="text-xl font-bold">{hourlyRate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {isVerified && (
                                <>
                                    <i className="fas fa-shield-alt text-green-600"></i>
                                    <span className="text-xs text-green-600 font-medium">Profissional Verificado</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm cursor-pointer flex items-center justify-center !rounded-button"><i className="fas fa-comment-alt mr-2"></i> Iniciar Chat</button>
                        <button className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium text-sm cursor-pointer !rounded-button">Contratar Agora</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;