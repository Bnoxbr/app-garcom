import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loading, ErrorMessage } from '../../components';

// Importa os tipos de dados
import type { Professional, Profile } from '../../types';

interface UserProfileProps {
  userType: 'prestador' | 'contratante';
}

const UserProfile: React.FC<UserProfileProps> = ({ userType }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Professional | Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (userType === 'prestador') tableName = 'professionals';
        else if (userType === 'contratante') tableName = 'profiles';

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
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

    if(user) fetchProfile();
  }, [id, userType, user]);


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
  

  // Lógica para renderização da página
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <a href="#" className="cursor-pointer">
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </a>
            <h1 className="text-xl font-bold">Perfil do Profissional</h1>
          </div>
        </div>
      </div>
      <div className="pt-16 px-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-4">
            <div className="relative mr-4">
              <img 
                src={(profile as Profile).avatar_url || "https://via.placeholder.com/80"} 
                alt="Foto do perfil"
                className="rounded-full w-20 h-20"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white bg-green-500"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userType === 'contratante' ? (profile as Profile).full_name : (profile as Professional).name}</h2>
              {userType === 'prestador' && 'category' in profile && <p className="text-gray-600">
                {(profile as Professional).category}
              </p>}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="font-semibold mb-2">Biografia</h3>
        <p className="text-gray-600 text-sm">
          {userType === 'contratante' ? (profile as Profile).bio : (profile as Professional).description}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;