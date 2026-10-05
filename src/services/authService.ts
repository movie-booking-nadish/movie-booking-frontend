import api from './api';
import { AuthResponse, SignInRequest, SignUpRequest, User } from '../types';

export const authService = {
  signUp: async (data: SignUpRequest): Promise<User> => {
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },
};
