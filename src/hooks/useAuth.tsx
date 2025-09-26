import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, Contratante } from '../types';

export type UserRole = 'admin' | 'contratante' | 'profissional';

export type UserProfile = Profile & Contratante;

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const fetchUserProfile = useCallback(async (user: User) => {
    setLoading(true);
    try {
      const { data: baseProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !baseProfile) {
        throw new Error(profileError?.message || 'Perfil base não encontrado.');
      }

      const role = baseProfile.role;
      
      // Apenas busca o perfil de contratante, ignorando outros roles
      if (role === 'contratante') {
        const { data, error } = await supabase
          .from('contratantes')
          .select('*')
          .eq('id', baseProfile.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }
        const fullProfile = { ...baseProfile, ...data };
        setProfile(fullProfile as UserProfile);
      } else {
        console.warn(`Usuário com a role '${role}' logado. O aplicativo está configurado apenas para o perfil de contratante.`);
        setProfile(null);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil do usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessão');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserProfile(currentUser);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

 const signUp = useCallback(async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      const role = 'contratante';
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) return { error: authError };
      if (!authData.user) throw new Error("Criação do usuário falhou.");
      const userId = authData.user.id;
      const { data: baseProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: profileData.full_name, role })
        .select()
        .single();
      if (profileError) {
        console.error("Erro ao criar perfil base:", profileError);
        throw profileError;
      }
      const { error: insertError } = await supabase
        .from('contratantes')
        .insert({
          id: baseProfile.id,
          nome_fantasia: (profileData as Contratante).nome_fantasia,
          cnpj: (profileData as Contratante).cnpj,
          endereco: (profileData as Contratante).endereco,
        });
      if (insertError) {
        console.error(`Erro ao criar perfil de contratante:`, insertError);
        throw insertError;
      }
      await fetchUserProfile(authData.user);
      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      console.error('Erro no signUp:', error);
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
      return {
        error: {
          name: error.name || 'SignUpError',
          message: errorMessage
        } as AuthError
      };
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

 const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return { error };
      }
      if (data.user) {
        await fetchUserProfile(data.user);
      }
      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      console.error('Erro no signIn:', error);
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
      return {
        error: {
          name: error.name || 'SignInError',
          message: errorMessage,
        } as AuthError,
      };
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

 const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

 const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      if (!user || !profile) {
        throw new Error("Usuário não autenticado.");
      }

      const baseProfileUpdates: Partial<Profile> = {};
      const specificProfileUpdates: Partial<Contratante> = {};

      // Separa os campos para cada tabela
      for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
          const value = (updates as any)[key];
          if (key === 'full_name' || key === 'avatar_url' || key === 'username' || key === 'website') {
            (baseProfileUpdates as any)[key] = value;
          } else {
            (specificProfileUpdates as any)[key] = value;
          }
        }
      }

      if (Object.keys(baseProfileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(baseProfileUpdates)
          .eq('id', user.id);
        if (profileError) throw profileError;
      }
      if (Object.keys(specificProfileUpdates).length > 0) {
        const { error: specificProfileError } = await supabase
          .from('contratantes') 
          .update(specificProfileUpdates)
          .eq('id', user.id);
        if (specificProfileError) throw specificProfileError;
      }
      await fetchUserProfile(user);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao atualizar perfil:", error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [user, profile, fetchUserProfile]);

 const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      return { error };
    } catch (err) {
      const error = err as AuthError;
      return { error };
    }
  }, []);

 return useMemo(() => ({
    user,
    profile,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword
  }), [user, profile, session, loading, error, signUp, signIn, signOut, updateProfile, resetPassword]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};