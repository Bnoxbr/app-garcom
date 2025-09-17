import { useState, useEffect, createContext, useContext } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { UserRole, Profile } from '../types'

// Alias para compatibilidade
export type UserProfile = Profile
// Re-export UserRole for compatibility
export type { UserRole } from '../types'

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, profileData: Partial<Profile>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessão')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Perfil não existe, criar um perfil padrão
        console.log('Perfil não encontrado, criando perfil padrão...')
        const defaultProfile = {
          id: userId,
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
          email: user?.email || '',
          role: 'contratante' as UserRole,
          document: '',
          document_type: 'cpf' as 'cpf' | 'cnpj',
          verified: false,
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)

        if (insertError) {
          console.error('Erro ao criar perfil padrão:', insertError)
        }

        // Definir o perfil no estado mesmo se houver erro na inserção
        setProfile({
          ...defaultProfile,
          email: user?.email || '',
          role: 'contratante'
        })
        return
      }

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile({
          ...data,
          email: user?.email || '',
          role: data.role || 'contratante'
        })
      } else {
        // Fallback: criar perfil padrão se data for null
        const defaultProfile = {
          id: userId,
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
          email: user?.email || '',
          role: 'contratante' as UserRole,
          document: '',
          document_type: 'cpf' as 'cpf' | 'cnpj',
          verified: false,
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setProfile(defaultProfile)
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      // Em caso de erro, criar perfil padrão para evitar loop
      const defaultProfile = {
        id: userId,
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
        email: user?.email || '',
        role: 'contratante' as UserRole,
        document: '',
        document_type: 'cpf' as 'cpf' | 'cnpj',
        verified: false,
        available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setProfile(defaultProfile)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    }
  }

  const signUp = async (email: string, password: string, profileData: Partial<Profile>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.full_name,
            role: profileData.role
          }
        }
      })

      if (error) return { error }

      // Create profile record with all new fields
      if (data.user) {
        const profileToInsert = {
          id: data.user.id,
          full_name: profileData.full_name || '',
          email: email,
          role: profileData.role || 'contratante',
          document: profileData.document || '',
          document_type: profileData.document_type || 'cpf',
          phone: profileData.phone,
          bio: profileData.bio,
          mei_number: profileData.mei_number,
          specialties: profileData.specialties,
          hourly_rate: profileData.hourly_rate,
          experience_years: profileData.experience_years,
          portfolio_images: profileData.portfolio_images,
          address: profileData.address,
          banking_data: profileData.banking_data,
          rating: profileData.rating,
          reviews_count: profileData.reviews_count || 0,
          verified: false,
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileToInsert)

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          // Lançar o erro para ser pego pelo bloco catch
          throw profileError
        }
      }

      return { error: null }
    } catch (err) {
      const error = err as AuthError // Pode ser AuthError ou PostgrestError
      console.error('Erro no signUp:', error)
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.'
      setError(errorMessage)
      return {
        error: {
          name: error.name || 'SignUpError',
          message: errorMessage
        } as AuthError
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { error }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      if (profile) {
        setProfile({ ...profile, ...updates })
      }

      return { error: null }
    } catch (err) {
      const error = err as Error
      setError(error.message)
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { error }
    } catch (err) {
      const error = err as AuthError
      return { error }
    }
  }

  return {
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
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}