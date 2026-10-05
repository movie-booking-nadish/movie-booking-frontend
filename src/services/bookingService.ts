import api from './api';
import { Booking, BookingRequest, BookingStatus } from '../types';

export const bookingService = {
  create: async (data: BookingRequest): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/my-bookings');
    return response.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  updateStatus: async (id: number, status: BookingStatus): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  },
};
