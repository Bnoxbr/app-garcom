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