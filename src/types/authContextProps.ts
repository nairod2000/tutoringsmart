export interface AuthContextProps {
    isAuthenticated: boolean;
    authChecked: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  }