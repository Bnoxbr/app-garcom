import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types'
import { Loading } from '../../components'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: React.ReactNode
}

const userTypes: UserTypeOption[] = [
  {
    value: 'contratante',
    label: 'Contratante',
    description: 'Contrato profissionais para eventos e estabelecimentos',
    icon: <span className="text-2xl">👥</span>
  },
  {
    value: 'prestador',
    label: 'Prestador',
    description: 'Ofereço serviços gastronômicos e de hospitalidade',
    icon: <span className="text-2xl">💼</span>
  }
]

const specialtyOptions = [
  { value: 'garcom', label: 'Garçom' },
  { value: 'chef', label: 'Chef de Cozinha' },
  { value: 'bartender', label: 'Bartender' },
  { value: 'sommelier', label: 'Sommelier' },
  { value: 'copeiro', label: 'Copeiro' },
  { value: 'auxiliar_cozinha', label: 'Auxiliar de Cozinha' }
]

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()
  
  const [step, setStep] = useState<'userType' | 'documentType' | 'form' | 'providerDetails'>('userType')
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null)
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj' | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    document: '',
    phone: '',
    // Campos específicos para prestadores
    specialties: [] as string[],
    hourlyRate: '',
    experienceYears: '',
    meiNumber: '',
    bio: '',
    // Endereço
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    // Dados bancários
    pixKey: '',
    pixType: 'cpf' as 'cpf' | 'cnpj' | 'email' | 'phone' | 'random',
    bitcoinAddress: '',
    bankName: '',
    bankAgency: '',
    bankAccount: '',
    bankAccountType: 'corrente' as 'corrente' | 'poupanca'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUserTypeSelect = (userType: UserRole) => {
    setSelectedUserType(userType)
    if (userType === 'contratante') {
      setStep('documentType')
    } else {
      setStep('form')
    }
  }

  const handleDocumentTypeSelect = (docType: 'cpf' | 'cnpj') => {
    setDocumentType(docType)
    setStep('form')
  }

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14)
  }

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      .substring(0, 18)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'document' && documentType) {
      const formattedValue = documentType === 'cpf' ? formatCPF(value) : formatCNPJ(value)
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    } else if (name === 'cep') {
      const cleanValue = value.replace(/\D/g, '')
      const formattedValue = cleanValue.replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9)
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Validar dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    if (cleanCNPJ.length !== 14) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
    
    // Validar primeiro dígito verificador
    let sum = 0
    let weight = 2
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false
    
    // Validar segundo dígito verificador
    sum = 0
    weight = 2
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false
    
    return true
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
    if (selectedUserType === 'contratante' && documentType) {
      if (!formData.document.trim()) {
        setError(`${documentType.toUpperCase()} é obrigatório`)
        return false
      }
      if (documentType === 'cpf' && !validateCPF(formData.document)) {
        setError('CPF inválido')
        return false
      }
      if (documentType === 'cnpj' && !validateCNPJ(formData.document)) {
        setError('CNPJ inválido')
        return false
      }
    }
    if (selectedUserType === 'prestador') {
      if (!formData.document.trim()) {
        setError('CPF é obrigatório')
        return false
      }
      if (!validateCPF(formData.document)) {
        setError('CPF inválido')
        return false
      }
      if (formData.specialties.length === 0) {
        setError('Selecione pelo menos uma especialidade')
        return false
      }
      if (!formData.hourlyRate.trim()) {
        setError('Valor por hora é obrigatório')
        return false
      }
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

    if (selectedUserType === 'prestador' && step === 'form') {
      setStep('providerDetails')
      return
    }

    setIsSubmitting(true)

    try {
      const profileData = {
        full_name: formData.fullName,
        email: formData.email,
        role: selectedUserType,
        document: formData.document,
        document_type: selectedUserType === 'contratante' && documentType ? documentType : 'cpf',
        phone: formData.phone,
        ...(selectedUserType === 'prestador' && {
          specialties: formData.specialties,
          hourly_rate: parseFloat(formData.hourlyRate) || 0,
          experience_years: parseInt(formData.experienceYears) || 0,
          mei_number: formData.meiNumber,
          bio: formData.bio,
          address: formData.cep ? {
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            country: 'Brasil'
          } : undefined,
          banking_data: formData.pixKey ? {
            pix_key: formData.pixKey,
            pix_type: formData.pixType,
            bitcoin_address: formData.bitcoinAddress,
            bank_name: formData.bankName,
            bank_agency: formData.bankAgency,
            bank_account: formData.bankAccount,
            bank_account_type: formData.bankAccountType
          } : undefined
        })
      }

      const { error } = await signUp(
        formData.email,
        formData.password,
        profileData
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
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.fullName && formData.email && formData.password && formData.confirmPassword && 
    (selectedUserType === 'prestador' || (selectedUserType === 'contratante' && formData.document))

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
            onClick={() => {
              if (step === 'providerDetails') {
                setStep('form')
              } else if (step === 'form') {
                if (selectedUserType === 'contratante') {
                  setStep('documentType')
                } else {
                  setStep('userType')
                }
              } else if (step === 'documentType') {
                setStep('userType')
              } else {
                navigate('/')
              }
            }}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            {step === 'form' ? 'Voltar' : step === 'documentType' ? 'Voltar' : 'Voltar ao início'}
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'userType' ? 'Criar conta' : 
             step === 'documentType' ? 'Tipo de documento' : 
             step === 'providerDetails' ? 'Informações profissionais' : 
             'Dados pessoais'}
          </h2>
          <p className="text-gray-600">
            {step === 'userType' 
              ? 'Escolha o tipo de conta que melhor se adequa a você'
              : step === 'documentType'
              ? 'Você é pessoa física ou jurídica?'
              : step === 'providerDetails'
              ? 'Complete seu perfil profissional'
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
        ) : step === 'documentType' ? (
          /* Document Type Selection */
          <div className="space-y-4">
            <button
              onClick={() => handleDocumentTypeSelect('cpf')}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:border-gray-800 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-800 transition-colors">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Pessoa Física (CPF)
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sou uma pessoa física contratando serviços
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => handleDocumentTypeSelect('cnpj')}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:border-gray-800 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-800 transition-colors">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Pessoa Jurídica (CNPJ)
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Represento uma empresa ou estabelecimento
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : step === 'form' ? (
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

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📱</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Document Field (CPF/CNPJ) - Only for contratantes */}
              {selectedUserType === 'contratante' && documentType && (
                <div>
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                    {documentType === 'cpf' ? 'CPF' : 'CNPJ'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">{documentType === 'cpf' ? '🆔' : '🏢'}</span>
                    </div>
                    <input
                      id="document"
                      name="document"
                      type="text"
                      required
                      value={formData.document}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </div>
                </div>
              )}

              {/* Document Field (CPF) - For prestadores */}
              {selectedUserType === 'prestador' && (
                <div>
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🆔</span>
                    </div>
                    <input
                      id="document"
                      name="document"
                      type="text"
                      required
                      value={formData.document}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              )}

              {/* Specialties - For prestadores */}
              {selectedUserType === 'prestador' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidades *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map((specialty) => (
                      <label
                        key={specialty.value}
                        className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty.value)}
                          onChange={() => handleSpecialtyChange(specialty.value)}
                          className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                        />
                        <span className="text-sm text-gray-700">{specialty.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Hourly Rate - For prestadores */}
              {selectedUserType === 'prestador' && (
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor por hora (R$) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">💰</span>
                    </div>
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="50.00"
                    />
                  </div>
                </div>
              )}

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
                ) : selectedUserType === 'prestador' ? (
                  'Continuar'
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>
          </form>
        ) : step === 'providerDetails' ? (
          /* Provider Details Form */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              {/* Experience Years */}
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
                  Anos de experiência
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">⭐</span>
                  </div>
                  <input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* MEI Number */}
              <div>
                <label htmlFor="meiNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Número do MEI (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📋</span>
                  </div>
                  <input
                    id="meiNumber"
                    name="meiNumber"
                    type="text"
                    value={formData.meiNumber}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="12345678000195"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição profissional
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors resize-none"
                  placeholder="Conte um pouco sobre sua experiência e especialidades..."
                />
              </div>

              {/* Address Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    <input
                      id="cep"
                      name="cep"
                      type="text"
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="São Paulo"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Rua
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="Rua das Flores"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      id="number"
                      name="number"
                      type="text"
                      value={formData.number}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="Centro"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* Banking Data Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados para Pagamento</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pixType" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de chave PIX
                    </label>
                    <select
                      id="pixType"
                      name="pixType"
                      value={formData.pixType}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    >
                      <option value="cpf">CPF</option>
                      <option value="email">Email</option>
                      <option value="phone">Telefone</option>
                      <option value="random">Chave aleatória</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700 mb-2">
                      Chave PIX
                    </label>
                    <input
                      id="pixKey"
                      name="pixKey"
                      type="text"
                      value={formData.pixKey}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                      placeholder="Sua chave PIX"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="bitcoinAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Bitcoin (opcional)
                  </label>
                  <input
                    id="bitcoinAddress"
                    name="bitcoinAddress"
                    type="text"
                    value={formData.bitcoinAddress}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors"
                    placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                  />
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
                disabled={isSubmitting}
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
        ) : null}

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