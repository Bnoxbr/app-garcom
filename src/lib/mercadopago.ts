import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: import.meta.env.VITE_MP_ACCESS_TOKEN! });

export const createPayment = async (paymentData: any) => {
  const payment = new Payment(client);

  try {
    const result = await payment.create({ body: paymentData });
    return result;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  const payment = new Payment(client);

  try {
    const result = await payment.get({ id: paymentId });
    
    // Mapear status do Mercado Pago para nosso sistema
    const statusMap: Record<string, string> = {
      'approved': 'completed',
      'authorized': 'pending',
      'in_process': 'pending',
      'in_mediation': 'pending',
      'rejected': 'failed',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'charged_back': 'charged_back'
    };
    
    return statusMap[result.status] || 'pending';
  } catch (error) {
    console.error('Error getting payment status:', error);
    return 'pending'; // Em caso de erro, assumimos que o pagamento ainda está pendente
  }
};