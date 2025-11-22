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
  signUp: (email: string, pass: string, data: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>; 
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNÇÃO DE AUTO-CURA (Mantida, mas usada com cautela) ---
  const createDefaultProfile = useCallback(async (targetUser: User) => {
    console.log("🩹 Tentando auto-cura do perfil para:", targetUser.id);
    const role = 'contratante';
    const now = new Date().toISOString();
    
    // Tenta criar/garantir Profile
    await supabase.from('profiles').upsert({
        id: targetUser.id,
        email: targetUser.email,
        full_name: targetUser.user_metadata?.full_name || 'Novo Usuário',
        role: role,
        updated_at: now 
    }, { onConflict: 'id' });

    // Tenta criar/garantir Contratante
    await supabase.from('contratantes').upsert({
        id: targetUser.id,
        nome_fantasia: targetUser.user_metadata?.full_name || 'Minha Empresa',
        // Garante que o full_name esteja sincronizado na criação
        full_name: targetUser.user_metadata?.full_name || 'Novo Usuário',
        email: targetUser.email,
        data_criacao: now,      
        data_atualizacao: now   
    }, { onConflict: 'id' });
  }, []);

  // --- BUSCA DE DADOS OTIMIZADA ---
  const fetchUserProfile = useCallback(async (currentUser: User) => {
    try {
      // Busca Profile
      let { data: baseProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      // Se não existir profile, cria (Auto-cura)
      if (!baseProfile) {
        await createDefaultProfile(currentUser);
        const { data: retryData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
        baseProfile = retryData;
      }

      if (!baseProfile) {
        setProfile(null);
        return;
      }

      // Busca Dados Específicos (Contratante)
      if (baseProfile.role === 'contratante') {
        let { data: contratanteData } = await supabase
          .from('contratantes')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        // Se não existir contratante, cria (Auto-cura parte 2)
        if (!contratanteData) {
            await createDefaultProfile(currentUser);
            const { data: retryCont } = await supabase.from('contratantes').select('*').eq('id', currentUser.id).maybeSingle();
            contratanteData = retryCont;
        }
          
        // Mescla os dados
        setProfile({ ...baseProfile, ...(contratanteData || {}) } as UserProfile);
      } else {
        setProfile(baseProfile as UserProfile);
      }
    } catch (err) {
      console.error('Erro fetch profile:', err);
    }
  }, [createDefaultProfile]);

  // --- MONITORAMENTO DE SESSÃO (ESTÁVEL) ---
  useEffect(() => {
    let mounted = true;

    // 1. Inicialização
    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user);
        }
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listener de Mudanças (Sem lógica manual de refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      // Debug para entender o que o Supabase está fazendo
      console.log(`🔐 Auth Event: ${event}`);

      // Atualiza sessão básica
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      
      // Lógica Anti-Pisca:
      // Só atualizamos o user/profile se o ID do usuário mudou ou se foi um Login explícito.
      // Ignoramos 'TOKEN_REFRESHED' se o usuário for o mesmo para evitar recarregar o perfil à toa.
      setUser((prevUser) => {
        if (prevUser?.id !== newUser?.id) {
            // Usuário mudou (Logoff ou troca de conta) -> Busca novo perfil
            if (newUser) {
                // Não setamos loading=true aqui para evitar piscar a tela inteira num refresh silencioso
                fetchUserProfile(newUser); 
            } else {
                setProfile(null);
            }
            return newUser;
        }
        // Se for o mesmo usuário (apenas refresh de token), mantemos o objeto antigo 
        // para o React não achar que mudou tudo e desmontar componentes.
        return prevUser;
      });

      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // --- AÇÕES (Mantidas iguais) ---

  const signUp = useCallback(async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: profileData.full_name, role: 'contratante' }
        }
      });

      if (error) throw error;
      
      if (data.user) {
          await createDefaultProfile(data.user);
          await fetchUserProfile(data.user);
      }
      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    } finally {
      setLoading(false);
    }
  }, [createDefaultProfile, fetchUserProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as AuthError };
    } finally {
        // No SignIn, deixamos loading true até o onAuthStateChange resolver o perfil
        setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setProfile(null);
    setUser(null);
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    // Função placeholder, a lógica real está nos componentes por enquanto
    return { error: null }; 
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { error };
  }, []);

  const value = useMemo(() => ({
    user, profile, session, loading, error,
    signUp, signIn, signOut, updateProfile, updatePassword, resetPassword
  }), [user, profile, session, loading, error, signUp, signIn, signOut, updateProfile, updatePassword, resetPassword]);
  
  return value;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
    return context;
};