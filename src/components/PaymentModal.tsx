import React, { useState } from 'react'
import { X, CreditCard, Smartphone, Bitcoin } from 'lucide-react'
import { usePayments } from '../hooks/usePayments'
import type { PaymentMethod, PaymentData } from '../hooks/usePayments'
import { Loading } from './Loading'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  onPaymentSuccess: (transactionId: string) => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  onPaymentSuccess
}) => {
  const { loading, error, processPayment, validatePaymentData } = usePayments()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix')
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

  if (!isOpen) return null

  const paymentMethods = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pagamento instantâneo'
    },
    {
      id: 'credit_card' as PaymentMethod,
      name: 'Cartão de Crédito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, Elo'
    },
    {
      id: 'debit_card' as PaymentMethod,
      name: 'Cartão de Débito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Débito em conta'
    },
    {
      id: 'bitcoin' as PaymentMethod,
      name: 'Bitcoin',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Criptomoeda'
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

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('card.')) {
      const cardField = field.split('.')[1]
      if (cardField === 'number') {
        value = formatCardNumber(value)
      } else if (cardField === 'expiry') {
        value = formatExpiry(value)
      } else if (cardField === 'cvv') {
        value = value.replace(/\D/g, '').substring(0, 4)
      }
      setCardData(prev => ({ ...prev, [cardField]: value }))
    } else {
      setCustomerData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handlePayment = async () => {
    const paymentData: PaymentData = {
      amount,
      method: selectedMethod,
      description,
      customerEmail: customerData.email,
      customerName: customerData.name,
      customerDocument: customerData.document
    }

    const validationError = validatePaymentData(paymentData)
    if (validationError) {
      alert(validationError)
      return
    }

    const result = await processPayment(paymentData)
    setPaymentResult(result)

    if (result.success && result.transactionId) {
      onPaymentSuccess(result.transactionId)
    }
  }

  if (paymentResult?.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pagamento Realizado!
            </h3>
            <p className="text-gray-600 mb-4">
              Transação: {paymentResult.transactionId}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Pagamento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do Pagamento</h3>
            <p className="text-gray-600 mb-2">{description}</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</p>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Método de Pagamento</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-gray-800 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${selectedMethod === method.id ? 'text-gray-800' : 'text-gray-500'}`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Data */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Dados do Cliente</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF/CNPJ (opcional)
                </label>
                <input
                  type="text"
                  value={customerData.document}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>

          {/* Card Data (if card payment) */}
          {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dados do Cartão</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => handleInputChange('card.number', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="0000 0000 0000 0000"
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
                      onChange={(e) => handleInputChange('card.expiry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleInputChange('card.cvv', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="000"
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
                    onChange={(e) => handleInputChange('card.holderName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Nome como está no cartão"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PIX QR Code */}
          {selectedMethod === 'pix' && paymentResult?.qrCode && (
            <div className="mb-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-4">QR Code PIX</h3>
              <img src={paymentResult.qrCode} alt="QR Code PIX" className="mx-auto" />
              <p className="text-sm text-gray-600 mt-2">
                Escaneie o código com seu app de banco
              </p>
            </div>
          )}

          {/* Bitcoin Payment */}
          {selectedMethod === 'bitcoin' && paymentResult?.paymentUrl && (
            <div className="mb-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Pagamento Bitcoin</h3>
              <a
                href={paymentResult.paymentUrl}
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Abrir Carteira Bitcoin
              </a>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loading size="sm" />
                <span className="ml-2">Processando...</span>
              </>
            ) : (
              `Pagar ${formatCurrency(amount)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal