export interface User {
  id: number;
  email: string;
  displayName: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}
