import { useState } from 'react'

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'bitcoin'

export interface PaymentData {
  amount: number
  method: PaymentMethod
  description: string
  customerEmail: string
  customerName: string
  customerDocument?: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  qrCode?: string
  error?: string
}

export const usePayments = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    setLoading(true)
    setError(null)

    try {
      // Simular processamento de pagamento
      // Em produção, aqui seria feita a integração real com Mercado Pago/Bitcoin
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (paymentData.method === 'pix') {
        return {
          success: true,
          transactionId: `pix_${Date.now()}`,
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        }
      }

      if (paymentData.method === 'bitcoin') {
        return {
          success: true,
          transactionId: `btc_${Date.now()}`,
          paymentUrl: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001'
        }
      }

      // Cartão de crédito/débito
      return {
        success: true,
        transactionId: `card_${Date.now()}`
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no processamento do pagamento'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const validatePaymentData = (data: PaymentData): string | null => {
    if (!data.amount || data.amount <= 0) {
      return 'Valor deve ser maior que zero'
    }
    if (!data.customerEmail || !data.customerEmail.includes('@')) {
      return 'Email inválido'
    }
    if (!data.customerName || data.customerName.trim().length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres'
    }
    if (!data.description || data.description.trim().length < 5) {
      return 'Descrição deve ter pelo menos 5 caracteres'
    }
    return null
  }

  return {
    loading,
    error,
    processPayment,
    validatePaymentData
  }
}