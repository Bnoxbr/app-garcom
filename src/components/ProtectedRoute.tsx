import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuth'
import type { UserRole } from '../hooks/useAuth'
import { Loading } from './Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth/login' 
}) => {
  const { user, profile, loading } = useAuthContext()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Verificando autenticação..." size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0 && profile) {
    const hasRequiredRole = requiredRoles.includes(profile.role)
    
    if (!hasRequiredRole) {
      // Redirect based on user role
      const roleRedirects: Record<UserRole, string> = {
        contratante: '/client/profile',
        prestador: '/provider/profile',
        admin: '/admin/dashboard'
      }
      
      return (
        <Navigate 
          to={roleRedirects[profile.role] || '/'} 
          replace 
        />
      )
    }
  }

  // If profile is not loaded yet but user exists, show loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Carregando perfil..." size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute