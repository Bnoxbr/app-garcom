import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuth'; // Caminho corrigido
import { supabase } from '@/lib/supabase'; // Caminho corrigido
import { Loading, ErrorMessage } from '@/components'; // Caminho corrigido
import { OfertaDetalhadaForm } from '@/components/OfertaDetalhadaForm'; // Caminho corrigido

type ProfessionalProfile = any; 

// Componente para renderizar estrelas de avaliação
const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        } else if (i - 0.5 <= rating) {
            stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-500"></i>);
        } else {
            stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
        }
    }
    return <div className="flex">{stars}</div>;
};


const UserProfile = () => {
    // ---------------------------------------------------
    // 1. HOOKS E ESTADOS
    // ---------------------------------------------------
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { loading: authLoading } = useAuthContext();
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para controle visual
    const [activeTab, setActiveTab] = useState('sobre');
    const [showFullBio, setShowFullBio] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

    // Estados para as abas
    const [jobHistory, setJobHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    
    // ---------------------------------------------------
    // 2. LÓGICA DE BUSCA DE DADOS
    // ---------------------------------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            const userId = id;
            if (!userId) { setLoading(false); setError("ID do perfil não fornecido."); return; }
            setLoading(true); setError(null);
            try {
                const { data, error: rpcError } = await supabase.rpc('get_professional_profile_by_id', { p_id: userId });
                if (rpcError) throw rpcError;
                if (data && data.length > 0) setProfile(data[0]); 
                else setError('Perfil não encontrado.');
            } catch (err: any) {
                setError(err.message || 'Ocorreu um erro ao carregar o perfil.');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            setProfile(null);
            fetchProfile();
        }
    }, [id]);

    useEffect(() => {
        if (profile?.id && profile.role === 'profissional') {
            const fetchDataForTabs = async () => {
                setHistoryLoading(true);
                const { data: historyData, error: historyError } = await supabase.rpc('get_job_history_for_professional', { p_id: profile.id });
                if (historyError) console.error("Erro ao buscar histórico:", historyError); 
                else setJobHistory(historyData || []);
                setHistoryLoading(false);

                setReviewsLoading(true);
                const { data: reviewsData, error: reviewsError } = await supabase.rpc('get_reviews_for_professional', { p_id: profile.id });
                if (reviewsError) console.error("Erro ao buscar avaliações:", reviewsError);
                else setReviews(reviewsData || []);
                setReviewsLoading(false);
            };
            fetchDataForTabs();
        }
    }, [profile]);
    
    // ---------------------------------------------------
    // 3. CHECAGENS DE ESTADO INICIAL
    // ---------------------------------------------------
    if (authLoading || loading) return <Loading message="Carregando perfil..." />;
    if (error) return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
    if (!profile) return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => navigate(0)} />;

    // ---------------------------------------------------
    // 4. PREPARAÇÃO DE VARIÁVEIS
    // ---------------------------------------------------
    const isProfessional = profile?.role === 'profissional'; 
    const professional = isProfessional ? profile as any : null; 

    const profileAvatar = professional?.avatar_url || "/images/default-avatar.svg";
    const profileName = professional?.nome_completo || 'N/A';
    const profileCategory = professional?.categoria || 'Profissional';
    const hourlyRate = professional?.valor_hora ? `R$ ${Number(professional.valor_hora).toFixed(2).replace('.', ',')}` : 'R$ N/A';
    const profileBio = professional?.bio || 'Nenhuma biografia disponível.';
    const isBioLong = profileBio.length > 150;
    const shortBio = isBioLong ? profileBio.substring(0, 150) + '...' : profileBio;
    const profileRating = professional?.average_rating || 0;
    const reviewsCount = professional?.total_reviews || 0;
    const isAvailable = professional?.is_available ?? true; 
    const isVerified = true;
    const disponibilidade = professional?.disponibilidade_semanal || {};
    const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    // ---------------------------------------------------
    // 5. JSX
    // ---------------------------------------------------
    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-32">
            <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-30">
                 <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                     <div className="flex items-center">
                         <button onClick={() => navigate(-1)} className="flex items-center cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700"><i className="fas fa-arrow-left text-lg"></i></button>
                         <h1 className="text-lg font-medium ml-3">Perfil Profissional</h1>
                     </div>
                     <div className="flex items-center space-x-2">
                         <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"><i className="fas fa-share-alt text-lg"></i></button>
                         <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"><i className="fas fa-ellipsis-v text-lg"></i></button>
                     </div>
                 </div>
            </div>

            <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center mt-6 mb-8">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                        <img src={profileAvatar} alt={profileName} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-bold">{profileName}</h2>
                    <p className="text-gray-600 mb-4">{profileCategory}</p>
                    {isProfessional && (
                        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                            {reviewsCount > 0 && (<div className="flex items-center text-yellow-500"><i className="fas fa-star mr-1"></i><span className="font-medium">{profileRating.toFixed(1)}</span><span className="text-gray-500 ml-1">({reviewsCount})</span></div>)}
                            <div className="w-1 h-4 bg-gray-300 hidden sm:block"></div>
                            <div className="flex items-center text-gray-600"><i className="fas fa-map-marker-alt mr-1"></i><span>São José dos Campos</span></div>
                            <div className="w-1 h-4 bg-gray-300 hidden sm:block"></div>
                            {isAvailable && (<div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Disponível agora</div>)}
                        </div>
                    )}
                </div>

                <div className="mb-6 border-b border-gray-200">
                    <div className="flex justify-center sm:justify-start overflow-x-auto">
                        <div className="flex space-x-6">
                            <button onClick={() => setActiveTab('sobre')} className={`pb-2 px-1 font-medium text-base whitespace-nowrap ${activeTab === 'sobre' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Sobre</button>
                            <button onClick={() => setActiveTab('experiencia')} className={`pb-2 px-1 font-medium text-base whitespace-nowrap ${activeTab === 'experiencia' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Experiência</button>
                            <button onClick={() => setActiveTab('avaliacoes')} className={`pb-2 px-1 font-medium text-base whitespace-nowrap ${activeTab === 'avaliacoes' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Avaliações</button>
                            <button onClick={() => setActiveTab('disponibilidade')} className={`pb-2 px-1 font-medium text-base whitespace-nowrap ${activeTab === 'disponibilidade' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Disponibilidade</button>
                        </div>
                    </div>
                </div>

                <div>
                    {activeTab === 'sobre' && ( <div className="space-y-4 animate-fade-in"> <div className="bg-white rounded-lg shadow-sm p-6"> <h3 className="font-semibold mb-2 text-lg">Biografia</h3> <p className="text-gray-600 text-sm leading-relaxed">{isBioLong && !showFullBio ? shortBio : profileBio}</p> {isBioLong && (<button onClick={() => setShowFullBio(!showFullBio)} className="text-gray-800 text-sm font-medium mt-3 cursor-pointer">{showFullBio ? "Ver menos" : "Ver mais"}</button>)} </div> {isProfessional && professional?.especialidades && professional.especialidades.length > 0 && ( <div className="bg-white rounded-lg shadow-sm p-6"> <h3 className="font-semibold mb-3 text-lg">Habilidades</h3> <div className="flex flex-wrap gap-2"> {professional.especialidades.map((skill: string, index: number) => (<span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{skill}</span>))} </div> </div> )} </div> )}
                    
                    {activeTab === 'experiencia' && ( <div className="space-y-4 animate-fade-in"> <div className="bg-white rounded-lg shadow-sm p-6"> <h3 className="font-semibold mb-3 text-lg">Resumo Profissional</h3> <div className="space-y-2 text-sm"> <div className="flex"><span className="w-32 font-medium text-gray-600">Área de Atuação:</span><span className="text-gray-800">{profileCategory}</span></div> <div className="flex"><span className="w-32 font-medium text-gray-600">Especialidades:</span><span className="text-gray-800 flex-1">{(professional?.especialidades || []).join(', ')}</span></div> <div className="flex items-center"><span className="w-32 font-medium text-gray-600">Verificação:</span>{professional?.experiencia_comprovada ? (<span className="flex items-center font-semibold text-green-600"><i className="fas fa-check-circle mr-2"></i> Experiência Verificada</span>) : (<span className="flex items-center text-gray-500"><i className="fas fa-times-circle mr-2"></i> Experiência não verificada</span>)}</div> </div> </div> <div className="bg-white rounded-lg shadow-sm p-6"> <h3 className="font-semibold mb-4 text-lg">Histórico na Plataforma</h3> {historyLoading ? (<p className="text-sm text-gray-500">Buscando histórico de trabalhos...</p>) : jobHistory.length > 0 ? ( <div className="space-y-6"> {jobHistory.map((job) => ( <div key={job.servico_id} className="flex items-center pb-4 border-b last:border-b-0"> <img src={job.avatar_contratante || '/images/default-avatar.svg'} alt={job.nome_contratante} className="w-12 h-12 rounded-full object-cover mr-4"/> <div> <p className="font-semibold text-gray-800">{job.nome_contratante}</p> <p className="text-sm text-gray-500">Serviço prestado em: {new Date(job.data_servico).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p> </div> </div> ))} </div> ) : ( <div className="text-center py-6"><i className="fas fa-history text-4xl text-gray-300 mb-2"></i><p className="text-sm text-gray-500">Este profissional ainda não concluiu trabalhos na plataforma.</p><p className="text-xs text-gray-400 mt-1">Seja o primeiro a contratá-lo e avaliá-lo!</p></div> )} </div> </div> )}

                    {activeTab === 'avaliacoes' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold mb-3 text-lg">Avaliação Geral</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="text-5xl font-bold text-gray-800">{profileRating.toFixed(1)}</div>
                                    <div><StarRating rating={profileRating} /><p className="text-sm text-gray-500">Baseado em {reviewsCount} avaliações</p></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold mb-4 text-lg">Comentários</h3>
                                {reviewsLoading ? (<p className="text-sm text-center py-4 text-gray-500">Carregando avaliações...</p>) : reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {reviews.map(review => (
                                            <div key={review.avaliacao_id} className="border-b pb-4 last:border-b-0">
                                                <div className="flex items-center mb-2"><img src={review.avatar_avaliador || '/images/default-avatar.svg'} alt={review.nome_avaliador} className="w-10 h-10 rounded-full object-cover mr-3" /><div><p className="font-semibold text-sm">{review.nome_avaliador}</p><p className="text-xs text-gray-500">{new Date(review.data_criacao).toLocaleDateString('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'})}</p></div></div>
                                                <div className="flex items-center mb-2"><StarRating rating={review.nota} /><span className="ml-2 text-sm font-bold">{Number(review.nota).toFixed(1)}</span></div>
                                                <p className="text-sm text-gray-700 leading-relaxed">{review.comentario}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (<div className="text-center py-6"><i className="far fa-comment-dots text-4xl text-gray-300 mb-2"></i><p className="text-sm text-gray-500">Este profissional ainda não recebeu avaliações.</p></div>)}
                            </div>
                        </div>
                    )}

                    {activeTab === 'disponibilidade' && (
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                             <h3 className="font-semibold mb-4 text-lg">Disponibilidade Semanal Padrão</h3>
                             <div className="space-y-3">
                                {diasDaSemana.map(dia => {
                                    const horarios = disponibilidade[dia.toLowerCase()];
                                    const isDisponivel = horarios && horarios.length > 0;
                                    return (
                                        <div key={dia} className={`p-3 rounded-lg flex justify-between items-center ${isDisponivel ? 'bg-green-50' : 'bg-gray-100'}`}>
                                            <span className="font-semibold text-sm">{dia}</span>
                                            {isDisponivel ? (<span className="text-sm text-green-800 font-medium">{horarios.join(' | ')}</span>) : (<span className="text-sm text-gray-500">Indisponível</span>)}
                                        </div>
                                    );
                                })}
                             </div>
                             <p className="text-xs text-gray-500 mt-4 text-center">*Esta é a disponibilidade padrão. A disponibilidade real para datas específicas deve ser confirmada no momento da contratação.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {isProfessional && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-gray-500">Valor por hora</p>
                            <p className="text-xl font-bold">{hourlyRate}</p>
                        </div>
                        {isVerified && (
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-shield-alt text-green-600"></i>
                                <span className="text-xs text-green-600 font-medium">Profissional Verificado</span>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm cursor-pointer flex items-center justify-center hover:bg-gray-200 transition-colors"><i className="fas fa-comment-alt mr-2"></i>Mensagem</button>
                        <button onClick={() => setIsOfferModalOpen(true)} className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium text-sm cursor-pointer hover:bg-gray-900 transition-colors">Contratar Agora</button>
                    </div>
                </div>
              </div>
            )}

            {isOfferModalOpen && (<OfertaDetalhadaForm professional={profile} onClose={() => setIsOfferModalOpen(false)}/>)}
        </div>
    );
};

export default UserProfile;