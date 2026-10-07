import api from './api';
import { SeatAvailability, Show, ShowRequest, ShowStatus } from '../types';

export const showService = {
  getAll: async (params?: { movieId?: number; theatreId?: number; showDate?: string; status?: ShowStatus }): Promise<Show[]> => {
    const response = await api.get<Show[]>('/shows', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Show> => {
    const response = await api.get<Show>(`/shows/${id}`);
    return response.data;
  },

  getByMovieId: async (movieId: number): Promise<Show[]> => {
    const response = await api.get<Show[]>(`/shows/movie/${movieId}`);
    return response.data;
  },

  create: async (data: ShowRequest): Promise<Show> => {
    const response = await api.post<Show>('/shows', data);
    return response.data;
  },

  update: async (id: number, data: ShowRequest): Promise<Show> => {
    const response = await api.put<Show>(`/shows/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/shows/${id}`);
  },

  getSeatAvailability: async (showId: number): Promise<SeatAvailability> => {
    const response = await api.get<SeatAvailability>(`/shows/${showId}/seats`);
    return response.data;
  },
};
