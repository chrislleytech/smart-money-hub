// Página de Login do MoneyPro

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/login/LoginForm';
import { GeometricShapes } from '@/components/login/GeometricShapes';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Se já está logado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Formas geométricas decorativas */}
      <GeometricShapes />

      {/* Formulário de login */}
      <LoginForm />

      {/* Créditos */}
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-xs text-foreground/50">
          MoneyPro © 2025 - Seu organizador financeiro
        </p>
      </div>
    </div>
  );
};

export default Login;
