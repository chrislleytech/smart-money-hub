// Contexto de autenticação do MoneyPro

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/finance';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simular armazenamento de usuários (em produção, conectar com Lovable Cloud)
const users: Map<string, { name: string; password: string }> = new Map();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Verificar se o usuário existe
    const storedUser = users.get(email);
    
    if (storedUser && storedUser.password === password) {
      setUser({
        id: email,
        email,
        name: storedUser.name,
      });
      return true;
    }
    
    // Para demonstração, permitir login com qualquer email/senha válidos
    if (email && password.length >= 6) {
      setUser({
        id: email,
        email,
        name: email.split('@')[0],
      });
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Verificar se o email já está cadastrado
    if (users.has(email)) {
      return false;
    }

    // Validações
    if (!name || !email || password.length < 6) {
      return false;
    }

    // Registrar novo usuário
    users.set(email, { name, password });
    
    // Fazer login automaticamente após cadastro
    setUser({
      id: email,
      email,
      name,
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
