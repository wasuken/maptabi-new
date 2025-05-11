import { createContext } from 'react';
import { User } from '../types/user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

// デフォルト値は型アサーションで仮の値を提供
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
