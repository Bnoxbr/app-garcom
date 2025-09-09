import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../hooks/useAuth'
import { Loading } from '../../components'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: React.ReactNode
}

const userTypes: UserTypeOption[] = [
  {
    value: 'client',
    label: 'Cliente',
    description: 'Contrato profissionais para eventos e estabelecimentos',
    icon: <span className="text-2xl">👥</span>
  },
  {
    value: 'provider',
    label: 'Prestador',
    description: 'Ofereço serviços gastronômicos e de hospitalidade',
    icon: <span className="text-2xl">💼</span>
  },
  {
    value: 'establishment',
    label: 'Estabelecimento',
    description: 'Represento um restaurante ou empresa',
    icon: <span className="text-2xl">🛡️</span>
  }
]

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()
  
  const [step, setStep] = useState<'userType' | 'form'>('userType')
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUserTypeSelect = (userType: UserRole) => {
    setSelectedUserType(userType)
    setStep('form')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório')
      return false
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm() || !selectedUserType) return

    setIsSubmitting(true)

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        selectedUserType,
        formData.fullName
      )
      
      if (error) {
        setError(error.message)
      } else {
        // Show success message and redirect
        navigate('/auth/login', {
          state: {
            message: 'Conta criada com sucesso! Verifique seu email para confirmar.'
          }
        })
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.fullName && formData.email && formData.password && formData.confirmPassword

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Verificando autenticação..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => step === 'form' ? setStep('userType') : navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            {step === 'form' ? 'Voltar' : 'Voltar ao início'}
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'userType' ? 'Criar conta' : 'Dados pessoais'}
          </h2>
          <p className="text-gray-600">
            {step === 'userType' 
              ? 'Escolha o tipo de conta que melhor se adequa a você'
              : `Criando conta como ${userTypes.find(t => t.value === selectedUserType)?.label}`
            }
          </p>
        </div>

        {step === 'userType' ? (
          /* User Type Selection */
          <div className="space-y-4">
            {userTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleUserTypeSelect(type.value)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:border-gray-800 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-800 transition-colors">
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {type.label}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Registration Form */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="text-gray-400 hover:text-gray-600">{showPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="text-gray-400 hover:text-gray-600">{showConfirmPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div className="text-center">
          <div className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-gray-800 hover:text-gray-900 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register