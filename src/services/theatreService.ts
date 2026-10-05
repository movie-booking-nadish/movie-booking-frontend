import api from './api';
import { Theatre, TheatreRequest, TheatreStatus } from '../types';

export const theatreService = {
  getAll: async (status?: TheatreStatus): Promise<Theatre[]> => {
    const response = await api.get<Theatre[]>('/theatres', { params: status ? { status } : undefined });
    return response.data;
  },

  getById: async (id: number): Promise<Theatre> => {
    const response = await api.get<Theatre>(`/theatres/${id}`);
    return response.data;
  },

  create: async (data: TheatreRequest): Promise<Theatre> => {
    const response = await api.post<Theatre>('/theatres', data);
    return response.data;
  },

  update: async (id: number, data: TheatreRequest): Promise<Theatre> => {
    const response = await api.put<Theatre>(`/theatres/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/theatres/${id}`);
  },
};
