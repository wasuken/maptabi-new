import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/user';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/register', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};
