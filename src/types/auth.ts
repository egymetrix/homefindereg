export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
