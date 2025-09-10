import { useState, useEffect, createContext, useContext } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type UserRole = 'client' | 'provider' | 'admin' | 'establishment'

export interface UserProfile {
  id: string
  full_name?: string
  avatar_url?: string
  phone?: string
  address?: string
  bio?: string
  role: UserRole
  email: string
  document?: string
  document_type?: 'cpf' | 'cnpj'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, role: UserRole, fullName?: string, document?: string, documentType?: 'cpf' | 'cnpj') => Promise<{ error: AuthError | null }>
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

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setProfile({
          ...data,
          email: user?.email || '',
          role: data.role || 'client'
        })
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    }
  }

  const signUp = async (email: string, password: string, role: UserRole, fullName?: string, document?: string, documentType?: 'cpf' | 'cnpj') => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            document: document,
            document_type: documentType
          }
        }
      })

      if (error) return { error }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: role,
            document: document,
            document_type: documentType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      return { error: null }
    } catch (err) {
      const error = err as AuthError
      setError(error.message)
      return { error }
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