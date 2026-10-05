import api from './api';
import { Payment, PaymentRequest } from '../types';

export const paymentService = {
  create: async (data: PaymentRequest): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  getByBookingId: async (bookingId: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/booking/${bookingId}`);
    return response.data;
  },
};
