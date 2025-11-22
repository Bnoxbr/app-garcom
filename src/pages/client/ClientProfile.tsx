import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components'; 
import DocumentsSection from '../../components/profile/DocumentsSection';
import FinancialSection from '../../components/profile/FinancialSection';
import HiringHistorySection from '../../components/profile/HiringHistorySection';
import ReviewsSection from '../../components/profile/ReviewsSection';
import toast from 'react-hot-toast';

// [NOVO] Importando o Dashboard para usar na aba
import ClientDashboard from './ClientDashboard';

import type { Contratante } from '../../types';

// --- CONFIGURAÇÕES ---
const BUCKET_NAME = 'client-logos';
const MOCK_COVER_IMAGE = "https://placehold.co/600x200/E2E8F0/94A3B8?text=Capa+do+Estabelecimento"; 

const DEFAULT_OPENING_HOURS = [
    { day: "Segunda-feira", hours: "Fechado" },
    { day: "Terça-feira", hours: "18:00 - 23:00" },
    { day: "Quarta-feira", hours: "18:00 - 23:00" },
    { day: "Quinta-feira", hours: "18:00 - 23:00" },
    { day: "Sexta-feira", hours: "18:00 - 00:00" },
    { day: "Sábado", hours: "12:00 - 00:00" },
    { day: "Domingo", hours: "12:00 - 17:00" }
];

// --- TIPAGEM ---
type ClientProfileData = Contratante & { 
    full_name?: string | null;
    nome_fantasia?: string | null;
    endereco?: string | null;
    phone?: string | null;          
    description?: string | null;    
    specialties?: string[] | null;  
    opening_hours?: { day: string; hours: string }[] | null;
    payment_data?: any; 
    
    reviews?: any[];
    credit_cards?: any[]; 
    documents?: any[];
    logo_url?: string | null;
    cover_url?: string | null;
};

// --- SUB-COMPONENTES ---
interface FloatingActionMenuProps {
    photoUrl: string;
    onClose: () => void;
    onSetAsLogo: () => void;
    onSetAsCover: () => void;
    onDelete: () => void;
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ photoUrl, onClose, onSetAsLogo, onSetAsCover, onDelete }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
                <img src={photoUrl} alt="Foto selecionada" className="w-full h-32 object-cover rounded-lg" />
            </div>
            <div className="flex flex-col">
                <button onClick={onSetAsLogo} className="flex items-center p-4 text-left hover:bg-gray-50 transition-colors text-sm">
                    <i className="fas fa-user-circle mr-3 text-lg text-blue-500"></i>Definir como Logo
                </button>
                <button onClick={onSetAsCover} className="flex items-center p-4 text-left hover:bg-gray-50 transition-colors text-sm">
                    <i className="fas fa-image mr-3 text-lg text-blue-500"></i>Definir como Capa
                </button>
                <button onClick={onDelete} className="flex items-center p-4 text-left hover:bg-red-50 transition-colors text-red-600 border-t border-gray-200 text-sm">
                    <i className="fas fa-trash-alt mr-3 text-lg"></i>Deletar
                </button>
                <button onClick={onClose} className="p-4 text-center text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors mt-2 text-sm">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const ClientProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading, error: authError, signOut } = useAuthContext();
    
    // Estados de Dados
    const [profile, setProfile] = useState<ClientProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estados de UI
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('informacoes');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // Estados do Formulário
    const [fullName, setFullName] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState(''); 
    const [descriptionEdit, setDescriptionEdit] = useState(''); 
    const [specialtiesEdit, setSpecialtiesEdit] = useState<string[]>([]);
    const [openingHoursEdit, setOpeningHoursEdit] = useState<{ day: string; hours: string }[]>(DEFAULT_OPENING_HOURS);

    // --- UTILS ---
    const handleLogout = async () => {
        if (window.confirm("Tem certeza que deseja sair?")) {
            await signOut();
            toast.success("Sessão encerrada.");
            navigate('/auth/login');
        }
    };

    const getInitials = (name: string | undefined | null): string => {
        if (!name) return 'SW';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts.length > 0 ? parts[0][0].toUpperCase() : 'SW';
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProfile = async () => {
            const userId = id || user?.id;
            
            if (authLoading) return;

            if (!userId) { 
                setError('ID de usuário não identificado.');
                return; 
            }
            
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('contratantes')
                    .select('*') 
                    .eq('id', userId)
                    .single();
                
                if (error) throw error;

                if (data) {
                    const profileData = data as ClientProfileData;
                    profileData.credit_cards = profileData.payment_data?.cards || [];
                    
                    setProfile(profileData);
                    
                    // Populate Form
                    setFullName(profileData.full_name || '');
                    setNomeFantasia(profileData.nome_fantasia || '');
                    setEndereco(profileData.endereco || '');
                    setTelefone(profileData.phone || ''); 
                    setDescriptionEdit(profileData.description || ''); 
                    setSpecialtiesEdit(profileData.specialties || []); 
                    
                    if (profileData.opening_hours && Array.isArray(profileData.opening_hours)) {
                        setOpeningHoursEdit(profileData.opening_hours);
                    } else {
                        setOpeningHoursEdit(DEFAULT_OPENING_HOURS);
                    }
                    
                    // Cache Buster
                    const ts = Date.now();
                    setLogoPreview(profileData.logo_url ? `${profileData.logo_url}?t=${ts}` : ''); 
                    setCoverPreview(profileData.cover_url ? `${profileData.cover_url}?t=${ts}` : '');
                }
            } catch (err: any) {
                console.error("Erro ao buscar perfil:", err);
                if (err.code !== 'PGRST116') { 
                     setError("Não foi possível carregar os dados do perfil.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfile();
        
    }, [id, user?.id, authLoading]); 

    // --- UPLOAD ---
    const handleImageUpload = async (file: File, columnToUpdate: 'logo_url' | 'cover_url', setPreviewUrl: any, setUploadingState: any) => {
        if (!user) return toast.error("Sessão inválida.");
        setUploadingState(true);

        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) throw new Error("Sessão expirada. Atualize a página.");

            const fileExt = file.name.split('.').pop();
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, ''); 
            const fileName = `${Date.now()}_${cleanFileName}.${fileExt}`;
            const filePath = `${user.id}/${columnToUpdate}/${fileName}`; 

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, { upsert: true, contentType: file.type, cacheControl: '3600' });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
            
            const { error: dbError } = await supabase.from('contratantes').upsert({ 
                id: user.id,
                [columnToUpdate]: publicUrl,
                data_atualizacao: new Date().toISOString() 
            });
            
            if (dbError) throw dbError;

            const newUrlWithCache = `${publicUrl}?t=${Date.now()}`;
            setPreviewUrl(newUrlWithCache);
            setProfile(prev => prev ? { ...prev, [columnToUpdate]: publicUrl } : null);
            toast.success("Imagem atualizada!");

        } catch (err: any) {
            console.error("Falha no Upload:", err);
            toast.error(`Erro: ${err.message || 'Falha no envio.'}`);
        } finally {
            setUploadingState(false);
        }
    };

    const onLogoChange = (e: any) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo_url', setLogoPreview, setUploadingLogo);
    const onCoverChange = (e: any) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover_url', setCoverPreview, setUploadingCover);

    const handleHourChange = (index: number, value: string) => {
        const newHours = [...openingHoursEdit];
        newHours[index].hours = value;
        setOpeningHoursEdit(newHours);
    };

    // --- SAVE ---
    const handleSaveChanges = async () => {
        if (!user) return toast.error("Sessão inválida.");
        setIsSaving(true);

        try {
            const updates = {
                full_name: fullName || null,
                nome_fantasia: nomeFantasia || null,
                endereco: endereco || null,
                phone: telefone || null,                  
                description: descriptionEdit || null,     
                specialties: specialtiesEdit || [], 
                opening_hours: openingHoursEdit || [], 
                data_atualizacao: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('contratantes')
                .upsert({
                    id: user.id,
                    ...updates
                });

            if (error) throw error;

            toast.success('Perfil salvo!');
            setIsEditMode(false); 
            
            setProfile(prev => {
                if (!prev) return null;
                return { ...prev, ...updates, specialties: updates.specialties, opening_hours: updates.opening_hours } as ClientProfileData;
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: any) {
            console.error("Erro ao salvar:", error);
            if (error.code === '42501') {
                toast.error("Permissão negada. Login necessário.");
            } else {
                toast.error(`Erro ao salvar: ${error.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const shouldShowLoading = (authLoading && !user) || (loading && !profile);

    if (shouldShowLoading) return <Loading message="Carregando perfil..." />;
    if (authError) return <ErrorMessage message={authError} onRetry={() => window.location.reload()} />;
    if (error && !profile) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
    if (!profile) return <div className="p-10 text-center">Iniciando perfil...</div>;

    const isOwner = user?.id === profile.id;
    const displaySpecialties = specialtiesEdit.length > 0 ? specialtiesEdit : (profile.specialties || []);

    return (
        <div className="relative min-h-screen bg-[#FAF9F6] text-gray-800 pb-32">
            {selectedPhotoUrl && isEditMode && (
                <FloatingActionMenu 
                    photoUrl={selectedPhotoUrl} 
                    onClose={() => setSelectedPhotoUrl(null)} 
                    onSetAsLogo={() => {}} 
                    onSetAsCover={() => {}} 
                    onDelete={() => {}} 
                />
            )}

            <div className="fixed top-0 w-full bg-sw-blue-primary text-white shadow-md z-30">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* NAVEGAÇÃO PARA A HOME */}
                        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-white/10">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h1 className="font-bold text-lg truncate">{profile.nome_fantasia || 'Empresa'}</h1>
                    </div>
                    {isOwner && (
                        <div className="flex items-center gap-1">
                            <button onClick={handleLogout} className="text-red-200 hover:text-red-100 text-sm flex items-center gap-2 px-3 py-1 rounded hover:bg-white/10 transition-colors">
                                <i className="fas fa-sign-out-alt"></i> <span className="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-14">
                {/* HERO COVER */}
                <div className="relative group">
                    <div className="h-40 w-full bg-gray-300 overflow-hidden relative">
                        <img src={coverPreview || MOCK_COVER_IMAGE} alt="Capa" className="w-full h-full object-cover" />
                        {isEditMode && (
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                {uploadingCover ? <Loading message="" /> : <div className="text-white flex flex-col items-center"><i className="fas fa-camera text-2xl mb-1"></i><span>Alterar Capa</span></div>}
                                <input type="file" className="hidden" onChange={onCoverChange} accept="image/*" disabled={uploadingCover} />
                            </label>
                        )}
                    </div>
                    <div className="absolute -bottom-12 left-4">
                        <div className="relative w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden group/logo">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-sw-yellow-accent/20 text-sw-blue-primary font-bold text-3xl">
                                    {getInitials(profile.nome_fantasia)}
                                </div>
                            )}
                            {isEditMode && (
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover/logo:opacity-100 transition-opacity">
                                    {uploadingLogo ? <Loading message="" /> : <i className="fas fa-camera text-white"></i>}
                                    <input type="file" className="hidden" onChange={onLogoChange} accept="image/*" disabled={uploadingLogo} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* INFO PRINCIPAL */}
                <div className="mt-14 px-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            {isEditMode ? (
                                <>
                                    <div className="mb-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Responsável</label>
                                        <input 
                                            type="text" 
                                            value={fullName} 
                                            onChange={(e) => setFullName(e.target.value)} 
                                            className="text-lg text-gray-700 w-full border-b border-gray-300 outline-none bg-transparent" 
                                            placeholder="Ex: João da Silva" 
                                        />
                                    </div>
                                    <input type="text" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} className="text-2xl font-bold w-full border-b-2 border-sw-blue-primary outline-none bg-transparent" placeholder="Nome Fantasia" />
                                </>
                            ) : (
                                <>
                                    {profile.full_name && <p className="text-sm text-gray-500 font-medium mb-1">{profile.full_name}</p>}
                                    <h2 className="text-2xl font-bold text-sw-blue-primary">{profile.nome_fantasia || 'Sem nome definido'}</h2>
                                </>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                                {displaySpecialties.map((tag, idx) => (
                                    <span key={idx} className="bg-sw-blue-primary/10 text-sw-blue-primary px-2 py-1 rounded text-xs font-medium border border-sw-blue-primary/20">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {isOwner && (
                            <button onClick={() => isEditMode ? handleSaveChanges() : setIsEditMode(true)} disabled={isSaving} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors ${isEditMode ? 'bg-sw-yellow-accent text-sw-blue-primary hover:bg-[#EAB308]' : 'bg-sw-blue-primary text-white hover:bg-[#1D4ED8]'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                {isSaving ? (<i className="fas fa-spinner fa-spin"></i>) : (<i className={`fas ${isEditMode ? 'fa-save' : 'fa-pen'}`}></i>)}
                                {isSaving ? 'Salvando...' : (isEditMode ? 'Salvar' : 'Editar')}
                            </button>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <div className="sticky top-14 bg-[#FAF9F6] z-20 border-b border-gray-200 px-4 overflow-x-auto">
                    <div className="flex space-x-6 min-w-max">
                        {['informacoes', 'fotos', 'gestao', 'pedidos'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-sw-blue-primary text-sw-blue-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {tab === 'informacoes' ? 'Sobre' : tab === 'fotos' ? 'Galeria' : tab === 'gestao' ? 'Gestão' : 'Meus Pedidos'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTEÚDO TABS */}
                <div className="p-4 space-y-6">
                    {activeTab === 'informacoes' && (
                        <>
                            <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-sw-blue-primary mb-3 flex items-center gap-2"><i className="fas fa-align-left text-sw-yellow-accent"></i> Descrição</h3>
                                {isEditMode ? <textarea value={descriptionEdit} onChange={(e) => setDescriptionEdit(e.target.value)} rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-primary outline-none text-sm" placeholder="Descreva sua empresa..." /> : <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{profile.description || 'Nenhuma descrição informada.'}</p>}
                            </section>
                            <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-sw-blue-primary mb-3 flex items-center gap-2"><i className="fas fa-map-marker-alt text-sw-yellow-accent"></i> Contato e Local</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-sw-blue-primary/10 flex items-center justify-center text-sw-blue-primary"><i className="fas fa-map-marker-alt"></i></div>
                                        <div className="flex-1"><p className="text-xs text-gray-500">Endereço</p>{isEditMode ? <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full border-b border-gray-300 text-sm py-1 outline-none" /> : <p className="text-sm text-gray-800">{profile.endereco || 'Não informado'}</p>}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-sw-blue-primary/10 flex items-center justify-center text-sw-blue-primary"><i className="fas fa-phone"></i></div>
                                        <div className="flex-1"><p className="text-xs text-gray-500">Telefone</p>{isEditMode ? <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full border-b border-gray-300 text-sm py-1 outline-none" /> : <p className="text-sm text-gray-800">{profile.phone || 'Não informado'}</p>}</div>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-sw-blue-primary mb-3 flex items-center gap-2"><i className="fas fa-clock text-sw-yellow-accent"></i> Horário de Funcionamento</h3>
                                <div className="space-y-2">
                                    {openingHoursEdit.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                                            <span className="text-gray-600 font-medium">{item.day}</span>
                                            {isEditMode ? <input type="text" className="w-32 p-1 border border-gray-300 rounded text-right text-xs" value={item.hours} onChange={(e) => handleHourChange(index, e.target.value)} /> : <span className={`font-medium ${item.hours === 'Fechado' ? 'text-red-500' : 'text-gray-800'}`}>{item.hours}</span>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                    {activeTab === 'fotos' && <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">Galeria em desenvolvimento.</div>}
                    {activeTab === 'gestao' && (
                        <div className="space-y-6">
                            <FinancialSection cards={profile.credit_cards || []} onDeleteCard={() => {}} onSetDefaultCard={() => {}} />
                            <DocumentsSection documents={profile.documents || []} onDocumentUpload={() => {}} onDocumentDelete={() => {}} />
                            <ReviewsSection reviews={profile.reviews || []} />
                            <HiringHistorySection history={[]} />
                        </div>
                    )}
                    
                    {/* --- CORREÇÃO 3: USO DO COMPONENTE DASHBOARD NA ABA PEDIDOS --- */}
                    {activeTab === 'pedidos' && (
                        <div className="min-h-[500px]">
                            <ClientDashboard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;