import { useState } from 'react'
import { createPayment, getPaymentStatus } from '../lib/mercadopago';
import { supabase } from '../lib/supabase';

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'bitcoin'

export interface PaymentData {
  amount: number
  method: PaymentMethod
  description: string
  customerEmail: string
  customerName: string
  customerDocument?: string
  booking_id?: string
  provider_id?: string
  client_id?: string
}

export interface PaymentCommission {
  platform_fee_percentage: number
  provider_percentage: number
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
  
  // Configuração padrão de comissões
  const defaultCommission: PaymentCommission = {
    platform_fee_percentage: 10, // 10% para a plataforma
    provider_percentage: 90, // 90% para o prestador
  }
  
  // Função para calcular valores com comissão
  const calculateCommission = (amount: number, commission: PaymentCommission = defaultCommission) => {
    const platformFee = (amount * commission.platform_fee_percentage) / 100
    const providerAmount = (amount * commission.provider_percentage) / 100
    
    return {
      platformFee,
      providerAmount,
    }
  }

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    setLoading(true)
    setError(null)

    try {
      // Para Bitcoin, usamos a simulação como antes
      if (paymentData.method === 'bitcoin') {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const transactionId = `btc_${Date.now()}`
        
        // Se tiver booking_id, registrar no banco de dados
        if (paymentData.booking_id && paymentData.provider_id && paymentData.client_id) {
          const { platformFee, providerAmount } = calculateCommission(paymentData.amount)
          
          await supabase
            .from('payments')
            .insert([
              {
                booking_id: paymentData.booking_id,
                amount: paymentData.amount,
                provider_id: paymentData.provider_id,
                client_id: paymentData.client_id,
                payment_method: paymentData.method,
                external_id: transactionId,
                status: 'pending',
                platform_fee: platformFee,
                provider_amount: providerAmount,
              },
            ])
        }
        
        return {
          success: true,
          transactionId,
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
        // Se tiver booking_id, registrar no banco de dados com comissões
        if (paymentData.booking_id && paymentData.provider_id && paymentData.client_id) {
          const { platformFee, providerAmount } = calculateCommission(paymentData.amount)
          
          await supabase
            .from('payments')
            .insert([
              {
                booking_id: paymentData.booking_id,
                amount: paymentData.amount,
                provider_id: paymentData.provider_id,
                client_id: paymentData.client_id,
                payment_method: paymentData.method,
                external_id: result.id.toString(),
                status: 'pending',
                platform_fee: platformFee,
                provider_amount: providerAmount,
              },
            ])
            
          // Atualizar status da reserva
          await supabase
            .from('bookings')
            .update({ payment_status: 'pending' })
            .eq('id', paymentData.booking_id)
        }
        
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

  // Função para verificar status de pagamento
  const checkPaymentStatus = async (paymentId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (dbError) throw dbError
      
      if (data.external_id) {
        // Verificar status no gateway de pagamento
        const paymentStatus = await getPaymentStatus(data.external_id)
        
        // Atualizar status no banco se necessário
        if (paymentStatus !== data.status) {
          await supabase
            .from('payments')
            .update({ status: paymentStatus })
            .eq('id', paymentId)
            
          // Se o pagamento foi concluído, atualizar a data de conclusão
          if (paymentStatus === 'completed') {
            await supabase
              .from('payments')
              .update({ completed_at: new Date().toISOString() })
              .eq('id', paymentId)
              
            // Atualizar status da reserva
            await supabase
              .from('bookings')
              .update({ payment_status: 'paid' })
              .eq('id', data.booking_id)
          }
        }
        
        return {
          ...data,
          status: paymentStatus,
        }
      }
      
      return data
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar status do pagamento'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    processPayment,
    checkPaymentStatus,
    calculateCommission,
    validatePaymentData
  }
}