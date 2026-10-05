import api from './api';
import { Movie, MovieRequest, MovieStatus } from '../types';

export const movieService = {
  getAll: async (params?: { title?: string; language?: string; genre?: string; status?: MovieStatus }): Promise<Movie[]> => {
    const response = await api.get<Movie[]>('/movies', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  create: async (data: MovieRequest): Promise<Movie> => {
    const response = await api.post<Movie>('/movies', data);
    return response.data;
  },

  update: async (id: number, data: MovieRequest): Promise<Movie> => {
    const response = await api.put<Movie>(`/movies/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/movies/${id}`);
  },
};
