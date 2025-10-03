import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components'; 
import toast from 'react-hot-toast'; 

// Importa os tipos de dados
import type { Contratante } from '../../types';

// Tipo de retorno de dados rico (Qualquer, para evitar erros de tipagem)
type ProfessionalProfile = any; 

const UserProfile = () => {
    // ---------------------------------------------------
    // 1. HOOKS E ESTADOS
    // ---------------------------------------------------
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading, error: authError } = useAuthContext();
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // ESTADOS PARA CONTROLE VISUAL
    const [activeTab, setActiveTab] = useState('sobre');
    const [showFullBio, setShowFullBio] = useState(false);

    // ---------------------------------------------------
    // 2. LÓGICA DE BUSCA DE DADOS (USE EFFECT)
    // ---------------------------------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            const userId = id || user?.id;

            if (!userId) {
                setLoading(false);
                setError("ID do perfil não fornecido.");
                return;
            }
            
            // CORREÇÃO DE LOOP: Se o perfil já está carregado e é o mesmo, sai.
            if (profile && profile.id === userId) {
                 setLoading(false);
                 return;
            }

            setLoading(true);
            setError(null);

            try {
                // CHAMADA RPC CORRIGIDA
                const { data, error: rpcError } = await supabase.rpc('get_professional_profile_by_id', { p_id: userId });

                if (rpcError) throw rpcError;

                if (data && data.length > 0) {
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
    }, [id, user]); 
    
    // ---------------------------------------------------
    // 3. CHECAGENS DE ESTADO INICIAL (ORDEM CORRIGIDA PARA EVITAR CRASH)
    // ---------------------------------------------------
    if (authLoading || loading) {
        return <Loading message="Carregando perfil..." />;
    }

    if (authError || error) {
        return <ErrorMessage message={authError || error || "Ocorreu um erro."} onRetry={() => window.location.reload()} />;
    }
    
    // CRUCIAL: Se profile é NULL, retornamos a mensagem de erro ANTES de ler o profile.role
    if (!profile) { 
        return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => window.location.reload()} />;
    }

    // A PARTIR DESTE PONTO, PROFILE É GARANTIDAMENTE NOT NULL.
    // ---------------------------------------------------
    // 4. PREPARAÇÃO DE VARIÁVEIS (Tipagem e Fallback)
    // ---------------------------------------------------
    const isProfessional = profile?.role === 'professional'; 
    const professional = isProfessional ? profile as any : null; 
    const contratante = !isProfessional ? profile as Contratante : null; 

    // Variáveis para preencher o visual rico
    const profileAvatar = professional?.avatar_url || "/images/default-avatar.svg";
    const profileName = professional?.nome_completo || professional?.full_name || contratante?.nome_fantasia || 'N/A';
    const profileCategory = professional?.categoria || 'Profissional';
    const hourlyRate = professional?.valor_hora ? `R$ ${professional.valor_hora.toFixed(2).replace('.', ',')}` : 'R$ N/A';
    
    // Lógica para Bio e Rating
    const profileBio = professional?.bio || (contratante?.description || 'Nenhuma biografia disponível.');
    const isBioLong = profileBio.length > 150;
    const shortBio = isBioLong ? profileBio.substring(0, 150) + '...' : profileBio;
    
    // DADOS DO RPC: average_rating e total_reviews
    const profileRating = professional?.average_rating || 4.8;
    const reviewsCount = professional?.total_reviews || 47;
    const isAvailable = true; 
    const isVerified = true;
    const displaySpecialties = professional?.especialidades || []; 


    // ---------------------------------------------------
    // 5. JSX (A PARTE VISUAL RICA)
    // ---------------------------------------------------
    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
            {/* Nav Bar */}
            <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="flex items-center cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700"><i className="fas fa-arrow-left text-lg mr-3"></i></button>
                        <h1 className="text-lg font-medium">Perfil Profissional</h1>
                    </div>
                    <div className="flex items-center">
                        <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"><i className="fas fa-share-alt text-lg"></i></button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 pb-24 px-4">
                {/* Profile Header (Lendo ProfileName e Rating) */}
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
                                <p className="text-gray-600 text-sm">{isBioLong && !showFullBio ? shortBio : profileBio}</p>
                                {isBioLong && (
                                    <button onClick={() => setShowFullBio(!showFullBio)} className="text-gray-800 text-sm font-medium mt-2 cursor-pointer">
                                        {showFullBio ? "Ver menos" : "Ver mais"}
                                    </button>
                                )}
                            </div>

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
                            
                            {/* Contato (Profissional) - BLOCO SEGURO */}
                             <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h3 className="font-semibold mb-3">Contato</h3>
                                <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-200">
                                    <i className="fas fa-lock text-red-600 mr-3 text-lg"></i>
                                    <span className="text-sm text-red-800 font-medium">
                                        Toda a comunicação deve ser feita via Chat da Plataforma.
                                    </span>
                                </div>
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