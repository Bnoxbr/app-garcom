import { useState } from 'react'
import { createPayment } from '../lib/mercadopago';

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
      // Para Bitcoin, usamos a simulação como antes
      if (paymentData.method === 'bitcoin') {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return {
          success: true,
          transactionId: `btc_${Date.now()}`,
          paymentUrl: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001'
        }
      }

      // Para outros métodos, integramos com Mercado Pago
      const mpPaymentData = {
        transaction_amount: paymentData.amount,
        description: paymentData.description,
        payment_method_id: paymentData.method === 'credit_card' ? 'master' : paymentData.method, // Ex: 'master', 'visa', 'pix'
        payer: {
          email: paymentData.customerEmail,
          first_name: paymentData.customerName.split(' ')[0],
          last_name: paymentData.customerName.split(' ').slice(1).join(' ')
        }
      }

      const result = await createPayment(mpPaymentData)

      if (result.id) {
        return {
          success: true,
          transactionId: result.id.toString(),
          qrCode: result.point_of_interaction?.transaction_data?.qr_code_base64,
          paymentUrl: result.point_of_interaction?.transaction_data?.ticket_url
        }
      } else {
        // A resposta de erro do Mercado Pago pode não ter uma propriedade 'error' direta.
        // Em vez disso, a resposta de erro geralmente tem 'message' e 'status'.
        const errorMessage = (result as any).message || 'Falha no pagamento com Mercado Pago';
        throw new Error(errorMessage);
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