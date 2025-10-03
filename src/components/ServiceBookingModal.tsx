import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, User, DollarSign, CreditCard, Smartphone, Bitcoin, AlertCircle } from 'lucide-react'
import { usePayments } from '../hooks/usePayments'
import type { PaymentMethod, PaymentData } from '../hooks/usePayments'
import type { Profissional, Booking } from '../types'
import { Loading } from './Loading'

interface ServiceBookingModalProps {
  isOpen: boolean
  onClose: () => void
  professional: Profissional
  onBookingSuccess: (booking: Booking) => void
}

interface BookingFormData {
  serviceDate: string
  serviceTime: string
  duration: number
  jobDescription: string
  location: string
  estimatedPrice: number
}

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  professional,
  onBookingSuccess
}) => {
  const { loading, error, processPayment, calculateCommission } = usePayments()
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment' | 'confirmation'>('booking')
  const [bookingData, setBookingData] = useState<BookingFormData>({
    serviceDate: '',
    serviceTime: '',
    duration: 2,
    jobDescription: '',
    location: '',
    estimatedPrice: professional.valor_hora || 50
  })
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('pix')
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    document: ''
  })
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holderName: ''
  })
  const [paymentResult, setPaymentResult] = useState<any>(null)

  // Calcular valores automaticamente
  const totalServiceValue = bookingData.estimatedPrice * bookingData.duration
  const commission = calculateCommission(totalServiceValue)
  const advancePayment = totalServiceValue * 0.3 // 30% de entrada

  useEffect(() => {
    if (professional.valor_hora) {
      setBookingData(prev => ({
        ...prev,
        estimatedPrice: professional.valor_hora
      }))
    }
  }, [professional.valor_hora])

  if (!isOpen) return null

  const paymentMethods = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pagamento instantâneo',
      fee: '0,49%'
    },
    {
      id: 'credit_card' as PaymentMethod,
      name: 'Cartão de Crédito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, Elo',
      fee: '4,98%'
    },
    {
      id: 'debit_card' as PaymentMethod,
      name: 'Cartão de Débito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Débito em conta',
      fee: '1,99%'
    },
    {
      id: 'bitcoin' as PaymentMethod,
      name: 'Bitcoin',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Criptomoeda',
      fee: '0%'
    }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4} \d{4})(\d)/, '$1 $2')
      .replace(/(\d{4} \d{4} \d{4})(\d)/, '$1 $2')
      .substring(0, 19)
  }

  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5)
  }

  const handleBookingInputChange = (field: keyof BookingFormData, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const handleCardInputChange = (field: string, value: string) => {
    if (field === 'number') {
      value = formatCardNumber(value)
    } else if (field === 'expiry') {
      value = formatExpiry(value)
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4)
    }
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const validateBookingForm = () => {
    return bookingData.serviceDate && 
           bookingData.serviceTime && 
           bookingData.jobDescription.trim() && 
           bookingData.location.trim()
  }

  const validatePaymentForm = () => {
    const hasCustomerData = customerData.name && customerData.email
    
    if (selectedPaymentMethod === 'pix' || selectedPaymentMethod === 'bitcoin') {
      return hasCustomerData
    }
    
    return hasCustomerData && 
           cardData.number && 
           cardData.expiry && 
           cardData.cvv && 
           cardData.holderName
  }

  const handleNextStep = () => {
    if (currentStep === 'booking' && validateBookingForm()) {
      setCurrentStep('payment')
    } else if (currentStep === 'payment' && validatePaymentForm()) {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    try {
      const paymentData: PaymentData = {
        amount: advancePayment,
        method: selectedPaymentMethod,
        description: `Entrada para serviço: ${bookingData.jobDescription}`,
        customerEmail: customerData.email,
        customerName: customerData.name,
        customerDocument: customerData.document,
        provider_id: professional.id,
        is_advance_payment: true
      }

      const result = await processPayment(paymentData)
      
      if (result.success) {
        setPaymentResult(result)
        setCurrentStep('confirmation')
        
        // Criar booking no banco de dados
        const booking: Partial<Booking> = {
          service_date: `${bookingData.serviceDate}T${bookingData.serviceTime}`,
          price: totalServiceValue,
          job_description: bookingData.jobDescription,
          provider_id: professional.id,
          status: 'pending',
          payment_status: 'paid'
        }
        
        // Aqui você chamaria a API para salvar o booking
        // const savedBooking = await createBooking(booking)
        // onBookingSuccess(savedBooking)
      }
    } catch (err) {
      console.error('Erro no pagamento:', err)
    }
  }

  const renderBookingStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <img 
          src={professional.avatar_url || '/default-avatar.png'} 
          alt={professional.nome_completo}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{professional.nome_completo}</h3>
          <p className="text-gray-600">{professional.categoria}</p>
          <p className="text-sm text-gray-500">{formatCurrency(professional.valor_hora || 0)}/hora</p>
        </div>
      </div>

      {/* Data e Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data do Serviço
          </label>
          <input
            type="date"
            value={bookingData.serviceDate}
            onChange={(e) => handleBookingInputChange('serviceDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Horário
          </label>
          <input
            type="time"
            value={bookingData.serviceTime}
            onChange={(e) => handleBookingInputChange('serviceTime', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Duração */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duração Estimada (horas)
        </label>
        <select
          value={bookingData.duration}
          onChange={(e) => handleBookingInputChange('duration', Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
            <option key={hour} value={hour}>
              {hour} {hour === 1 ? 'hora' : 'horas'}
            </option>
          ))}
        </select>
      </div>

      {/* Local */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Local do Serviço
        </label>
        <input
          type="text"
          value={bookingData.location}
          onChange={(e) => handleBookingInputChange('location', e.target.value)}
          placeholder="Endereço completo onde o serviço será realizado"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Serviço
        </label>
        <textarea
          value={bookingData.jobDescription}
          onChange={(e) => handleBookingInputChange('jobDescription', e.target.value)}
          placeholder="Descreva detalhadamente o serviço que você precisa..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
      </div>

      {/* Resumo de Valores */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Resumo de Valores</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Valor por hora:</span>
            <span>{formatCurrency(bookingData.estimatedPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Duração:</span>
            <span>{bookingData.duration}h</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total do serviço:</span>
            <span>{formatCurrency(totalServiceValue)}</span>
          </div>
          <div className="flex justify-between text-blue-600">
            <span>Entrada (30%):</span>
            <span>{formatCurrency(advancePayment)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Restante (após confirmação):</span>
            <span>{formatCurrency(totalServiceValue - advancePayment)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      {/* Resumo do Serviço */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Resumo da Reserva</h4>
        <div className="text-sm space-y-1">
          <p><strong>Profissional:</strong> {professional.nome_completo}</p>
          <p><strong>Data:</strong> {new Date(bookingData.serviceDate).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> {bookingData.serviceTime}</p>
          <p><strong>Duração:</strong> {bookingData.duration}h</p>
          <p><strong>Local:</strong> {bookingData.location}</p>
        </div>
      </div>

      {/* Valor a Pagar */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Valor da entrada</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(advancePayment)}</p>
        <p className="text-xs text-gray-500">30% do valor total ({formatCurrency(totalServiceValue)})</p>
      </div>

      {/* Métodos de Pagamento */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Método de Pagamento</h4>
        <div className="grid grid-cols-1 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`p-4 border rounded-lg text-left transition-all ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Taxa: {method.fee}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dados do Cliente */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Dados do Cliente</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => handleCustomerInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => handleCustomerInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF/CNPJ (opcional)
            </label>
            <input
              type="text"
              value={customerData.document}
              onChange={(e) => handleCustomerInputChange('document', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Dados do Cartão (se necessário) */}
      {(selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card') && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Dados do Cartão</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Cartão
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => handleCardInputChange('number', e.target.value)}
                placeholder="0000 0000 0000 0000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                  placeholder="MM/AA"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                  placeholder="000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no Cartão
              </label>
              <input
                type="text"
                value={cardData.holderName}
                onChange={(e) => handleCardInputChange('holderName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Informações Importantes */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Informações Importantes:</p>
            <ul className="mt-1 text-yellow-700 space-y-1">
              <li>• Você está pagando 30% de entrada para reservar o serviço</li>
              <li>• O restante será pago após a confirmação do serviço</li>
              <li>• O profissional receberá 85% do valor total</li>
              <li>• Em caso de cancelamento, consulte nossa política de reembolso</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Reserva Confirmada!</h3>
        <p className="text-gray-600">Seu pagamento foi processado com sucesso</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h4 className="font-semibold text-gray-900 mb-3">Detalhes da Reserva</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Profissional:</span>
            <span>{professional.nome_completo}</span>
          </div>
          <div className="flex justify-between">
            <span>Data:</span>
            <span>{new Date(bookingData.serviceDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span>Horário:</span>
            <span>{bookingData.serviceTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor pago (entrada):</span>
            <span className="font-semibold text-green-600">{formatCurrency(advancePayment)}</span>
          </div>
          {paymentResult?.transactionId && (
            <div className="flex justify-between">
              <span>ID da Transação:</span>
              <span className="font-mono text-xs">{paymentResult.transactionId}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Próximos Passos</h4>
        <ul className="text-sm text-blue-800 space-y-1 text-left">
          <li>• O profissional foi notificado sobre sua reserva</li>
          <li>• Você receberá uma confirmação por e-mail</li>
          <li>• O profissional entrará em contato para confirmar detalhes</li>
          <li>• O pagamento restante será feito após a conclusão do serviço</li>
        </ul>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStep === 'booking' && 'Reservar Serviço'}
            {currentStep === 'payment' && 'Pagamento'}
            {currentStep === 'confirmation' && 'Confirmação'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'booking' ? 'text-blue-600' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'booking' ? 'bg-blue-100' : currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Detalhes</span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-200' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-blue-600' : currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'payment' ? 'bg-blue-100' : currentStep === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Pagamento</span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep === 'confirmation' ? 'bg-green-200' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirmação</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'booking' && renderBookingStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={currentStep === 'payment' ? () => setCurrentStep('booking') : onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {currentStep === 'payment' ? 'Voltar' : 'Cancelar'}
            </button>
            <button
              onClick={handleNextStep}
              disabled={loading || (currentStep === 'booking' && !validateBookingForm()) || (currentStep === 'payment' && !validatePaymentForm())}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <Loading />}
              <span>
                {currentStep === 'booking' ? 'Continuar' : 'Confirmar Pagamento'}
              </span>
            </button>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="flex justify-center p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceBookingModal