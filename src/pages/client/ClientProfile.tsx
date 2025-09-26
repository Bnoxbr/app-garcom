import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
// Certifique-se de que seus componentes Loading e ErrorMessage estão aqui:
import { Loading, ErrorMessage } from '../../components'; 

// Importa os tipos de dados
import type { Contratante } from '../../types';

// O tipo de retorno da nossa busca, incluindo os novos campos e email
type ClientProfileData = Contratante & { 
    email?: string; 
    description?: string;
    specialties?: string[];
    opening_hours?: any;
    photos_gallery?: string[];
};

// URLs de Placeholders (substituídas por um serviço mais robusto)
const mockCoverImage = "https://placehold.co/400x150/000000/FFFFFF?text=CAPA"; 
const mockLogoImage = "https://placehold.co/100x100/4F46E5/FFFFFF?text=LOGO";
// Mock para Horários
const mockOpeningHours = [
    { day: "Segunda-feira", hours: "11:00 - 22:00" },
    { day: "Terça-feira", hours: "11:00 - 22:00" },
];


const ClientProfile: React.FC = () => {
    // ---------------------------------------------------
    // 1. HOOKS E ESTADOS
    // ---------------------------------------------------
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading, error: authError, updateProfile } = useAuthContext();
    const [profile, setProfile] = useState<ClientProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ESTADOS DE INTERAÇÃO VISUAL E EDIÇÃO
    const [activeTab, setActiveTab] = useState('informacoes');
    const [isEditMode, setIsEditMode] = useState(false);
    
    // ESTADOS DE FORMULÁRIO
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [endereco, setEndereco] = useState('');
    const [document, setDocument] = useState('');
    const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cnpj');
    const [telefone, setTelefone] = useState('');
    const [descriptionEdit, setDescriptionEdit] = useState('');
    const [specialtiesEdit, setSpecialtiesEdit] = useState<string[]>([]);
    
    // Mocks/Placeholders
    const mockPhotos = Array(9).fill("https://via.placeholder.com/150/EEEEEE?text=FOTO"); 

    // ---------------------------------------------------
    // 2. LÓGICA DE BUSCA DE DADOS
    // ---------------------------------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            const userId = id || user?.id;
            if (!userId) { setError('ID não encontrado.'); setLoading(false); return; }
            
            setLoading(true);
            setError(null);
            
            try {
                // Buscando dados de Contratante + Perfil (Corrigido para não pedir email no JOIN)
                const { data, error } = await supabase
                    .from('contratantes')
                    .select('*, profiles(*)') 
                    .eq('id', userId)
                    .single();
                
                if (error) throw error;

                if (data) {
                    const fullData = { ...data, email: user?.email }; // Pega email do auth context
                    setProfile(fullData as ClientProfileData);
                    // Inicializa os campos de edição com os dados do perfil
                    setNomeFantasia(fullData.nome_fantasia || '');
                    setEndereco(fullData.endereco || '');
                    setDocument(fullData.document || '');
                    setDocumentType(fullData.document_type || 'cnpj');
                    setTelefone(fullData.telefone || '');
                    setDescriptionEdit(fullData.description || '');
                    setSpecialtiesEdit(fullData.specialties || []);
                } else {
                    setError('Perfil não encontrado.');
                }
            } catch (err: any) {
                console.error("Erro ao buscar perfil:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfile();
    }, [id, user, updateProfile]); // Adicionei updateProfile como dependência se for usá-lo

    // ---------------------------------------------------
    // 3. LÓGICA DE EDIÇÃO E SALVAMENTO (COMPLETA)
    // ---------------------------------------------------
    const handleSaveChanges = async () => {
        if (!profile || !user) return;
        
        // Mapeamento dos campos de estado de volta para o DB
        const updates: Partial<Contratante> = {
            nome_fantasia: nomeFantasia,
            endereco: endereco,
            document: document,
            document_type: documentType,
            phone: telefone,
            description: descriptionEdit, 
            specialties: specialtiesEdit, 
        };
        
        try {
            const { error: updateError } = await updateProfile(updates); // Chama a função do AuthContext para salvar
            if (updateError) {
                throw updateError;
            }
            
            // O updateProfile deve retornar o novo profile atualizado (assumindo que ele o faz)
            // Se o profile do AuthContext for atualizado, o useEffect acima será disparado.
            
            setIsEditMode(false); // Sai do modo de edição
            // O ideal seria recarregar o perfil após o sucesso para ter certeza
            window.location.reload(); 
            
        } catch (err: any) {
            console.error('Erro ao salvar alterações:', err);
            setError('Erro ao salvar as informações. Por favor, tente novamente.');
        }
    };

    const toggleEditMode = () => {
        if (isEditMode) {
            // Se estava editando, tenta salvar
            handleSaveChanges();
        } else {
            // Se estava visualizando, entra no modo de edição
            setIsEditMode(true);
        }
    };

    // ---------------------------------------------------
    // 4. RENDERIZAÇÃO
    // ---------------------------------------------------
    if (authLoading || loading) return <Loading message="Carregando perfil da empresa..." />;
    if (authError || error) return <ErrorMessage message={authError || error || "Ocorreu um erro."} onRetry={() => window.location.reload()} />;
    if (!profile) return <ErrorMessage message="Nenhum perfil de contratante encontrado." onRetry={() => window.location.reload()} />;
    
    const displaySpecialties = profile.specialties || []; 

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
            {/* Navbar FIXA SUPERIOR (Corrigida: Engrenagem Removida) */}
            <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="flex items-center cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700">
                            <i className="fas fa-arrow-left text-xl mr-3"></i>
                        </button>
                        <h1 className="text-xl font-bold">Perfil</h1>
                    </div>
                    {/* Botão de Configurações/Opções - REMOVIDO COMO SOLICITADO */}
                    {/* Deixando apenas o nome do perfil (se estiver no modo de edição, ele aparecerá no botão) */}
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 pb-16 px-0">
                {/* 1. SEÇÃO DE CAPA E AVATAR */}
                <div className="relative">
                    <div className="h-40 w-full overflow-hidden">
                        <img src={mockCoverImage} alt="Capa da empresa" className="w-full h-full object-cover object-top" />
                    </div>
                    {/* Logo Flutuante */}
                    <div className="absolute -bottom-16 left-4 border-4 border-white rounded-full overflow-hidden shadow-lg">
                        <img src={mockLogoImage} alt="Logo da empresa" className="w-24 h-24 object-cover" />
                    </div>
                </div>

                {/* 2. NOME DA EMPRESA, BOTÃO DE EDITAR E TAGS */}
                <div className="mt-20 px-4">
                    <div className="flex justify-between items-center mb-2">
                        {isEditMode ? (
                            <input 
                                type="text" 
                                value={nomeFantasia} 
                                onChange={(e) => setNomeFantasia(e.target.value)}
                                className="text-2xl font-bold p-1 border-b border-gray-400 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{profile.nome_fantasia}</h2>
                        )}

                        {user?.id === profile.id && (
                            <button onClick={toggleEditMode} className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm flex items-center cursor-pointer">
                                <i className={`fas ${isEditMode ? "fa-check" : "fa-edit"} mr-2`}></i>
                                <span>{isEditMode ? "Salvar" : "Editar Perfil"}</span>
                            </button>
                        )}
                    </div>
                    
                    {/* Tags de Especialidades */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {displaySpecialties.map((specialty, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{specialty}</span>
                        ))}
                    </div>
                </div>

                {/* 3. TABS NAVIGATION */}
                <div className="mt-6 border-b border-gray-200">
                    <div className="flex px-4">
                        <button onClick={() => setActiveTab("informacoes")} className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "informacoes" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}>Informações</button>
                        <button onClick={() => setActiveTab("fotos")} className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "fotos" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}>Fotos</button>
                        <button onClick={() => setActiveTab("gestao")} className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "gestao" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}>Gestão</button>
                    </div>
                </div>

                {/* 4. TAB CONTENT */}
                <div className="px-4 py-4">
                    {/* Informações Tab */}
                    {activeTab === "informacoes" && (
                        <div className="space-y-6">
                            {/* Descrição */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold text-lg mb-3">Descrição</h3>
                                {isEditMode ? (
                                    <textarea 
                                        value={descriptionEdit} 
                                        onChange={(e) => setDescriptionEdit(e.target.value)}
                                        rows={4} 
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    ></textarea>
                                ) : (
                                    <p className="text-gray-600 text-sm">{profile.description || 'Nenhuma descrição fornecida.'}</p>
                                )}
                            </div>

                            {/* Endereço (ADICIONADO PARA EDIÇÃO) */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold text-lg mb-3">Endereço</h3>
                                {isEditMode ? (
                                    <input 
                                        type="text" 
                                        value={endereco} 
                                        onChange={(e) => setEndereco(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm">{profile.endereco || 'Não informado'}</p>
                                )}
                            </div>
                            
                            {/* Horário de Funcionamento */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold text-lg">Horário de Funcionamento</h3>
                                <div className="space-y-2">
                                    {mockOpeningHours.map((item, index) => (<div key={index} className="flex justify-between text-sm"><span className="text-gray-600">{item.day}</span><span className="font-medium">{item.hours}</span></div>))}
                                </div>
                            </div>

                            {/* Contato (Telefone editável) */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold text-lg">Contato</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <i className="fas fa-phone text-gray-500 w-6"></i>
                                        {isEditMode ? (
                                            <input 
                                                type="tel" 
                                                value={telefone} 
                                                onChange={(e) => setTelefone(e.target.value)}
                                                className="ml-2 p-1 border-b border-gray-300 text-sm"
                                            />
                                        ) : (
                                            <span className="ml-2 text-sm">{profile.telefone || 'Não informado'}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-envelope text-gray-500 w-6"></i>
                                        <span className="ml-2 text-sm">{profile.email || user?.email || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fotos Tab / Gestão Tab ... (O restante é mock e placeholder) */}
                </div>
            </div>

            {/* Tab Bar FIXA INFERIOR (Rodapé) - Manter o componente DashboardNavigation */}
        </div>
    );
};

export default ClientProfile;