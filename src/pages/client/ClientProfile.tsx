import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components';

// Importa os tipos de dados
import type { Contratante } from '../../types';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading, error: authError, updateProfile } = useAuthContext();
  const [profile, setProfile] = useState<Contratante | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [endereco, setEndereco] = useState('');
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = id || user?.id;

      if (!userId) {
        setError('ID do perfil não encontrado.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('contratantes')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as Contratante);
          setNomeFantasia(data.nome_fantasia || '');
          setEndereco(data.endereco || '');
          setDocument(data.document || '');
          setDocumentType(data.document_type || 'cpf');
          setTelefone(data.telefone || '');
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
  }, [id, user]);

  const handleSaveChanges = async () => {
    if (!profile || !user) return;
    
    const updates: Partial<Contratante> = {
      nome_fantasia: nomeFantasia,
      endereco: endereco,
      document: document,
      document_type: documentType,
      telefone: telefone,
    };
    
    try {
      const { error: updateError } = await updateProfile(updates);
      if (updateError) {
        throw updateError;
      }
      setIsEditMode(false);
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      setError('Erro ao salvar as informações. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      handleSaveChanges();
    } else {
      setIsEditMode(true);
    }
  };

  if (authLoading || loading) {
    return <Loading message="Carregando perfil do cliente..." />;
  }

  if (authError || error) {
    return <ErrorMessage message={authError || error || "Ocorreu um erro."} onRetry={() => window.location.reload()} />;
  }

  if (!profile) {
    return <ErrorMessage message="Nenhum perfil encontrado." onRetry={() => window.location.reload()} />;
  }
  
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Navbar de Perfil */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <a href="/" className="cursor-pointer">
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </a>
            <h1 className="text-xl font-bold">{isEditMode ? nomeFantasia : profile.nome_fantasia}</h1>
          </div>
          {user?.id === profile.id && (
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm flex items-center cursor-pointer"
            >
              <i className={`fas ${isEditMode ? "fa-check" : "fa-edit"} mr-2`}></i>
              <span>{isEditMode ? "Salvar" : "Editar"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-16 pb-16 px-0">
        <div className="px-4 py-4">
          {/* Informações Gerais */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-lg mb-3">Informações</h3>
              {isEditMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome Fantasia"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="CNPJ"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ) : (
                <div className="text-gray-600 text-sm space-y-2">
                  <p>
                    <span className="font-medium">Nome Fantasia:</span> {profile.nome_fantasia}
                  </p>
                  <p>
                    <span className="font-medium">Endereço:</span> {profile.endereco}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span> {profile.telefone || 'Não informado'}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user?.email || 'Não informado'}
                  </p>
                  <p>
                    <span className="font-medium">CNPJ:</span> {profile.document || 'Não informado'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões de Ação e Tab Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
        <a href="#" className="text-center text-gray-500 hover:text-gray-800 cursor-pointer">
          <i className="fas fa-home text-xl"></i>
          <span className="block text-xs">Início</span>
        </a>
        <a href="#" className="text-center text-gray-500 hover:text-gray-800 cursor-pointer">
          <i className="fas fa-concierge-bell text-xl"></i>
          <span className="block text-xs">Serviços</span>
        </a>
        <a href="#" className="text-center text-gray-500 hover:text-gray-800 cursor-pointer">
          <i className="fas fa-calendar-alt text-xl"></i>
          <span className="block text-xs">Agenda</span>
        </a>
        <a href="#" className="text-center text-gray-800 font-bold cursor-pointer">
          <i className="fas fa-user-circle text-xl"></i>
          <span className="block text-xs">Perfil</span>
        </a>
      </div>
    </div>
  );
};

export default ClientProfile;
