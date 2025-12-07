// Página de redefinição de senha

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GeometricShapes } from '@/components/login/GeometricShapes';
import { ThemeToggle } from '@/components/login/ThemeToggle';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não há sessão (usuário não clicou no link do email), redireciona
    if (!isAuthenticated && !window.location.hash.includes('access_token')) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);
      
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: 'Senha atualizada!',
          description: 'Sua senha foi alterada com sucesso.',
        });
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível atualizar a senha.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4 relative overflow-hidden">
        <ThemeToggle />
        <GeometricShapes />
        
        <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-slide-up text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-display font-bold text-card-foreground mb-2">
            Senha atualizada!
          </h2>
          <p className="text-muted-foreground mb-6">
            Sua senha foi alterada com sucesso.
          </p>
          <Button
            variant="premium"
            size="lg"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Ir para o Dashboard
          </Button>
        </div>

        <div className="absolute bottom-4 text-center w-full">
          <p className="text-xs text-foreground/50">
            MoneyPro © 2025 - Seu organizador financeiro
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <ThemeToggle />
      <GeometricShapes />

      <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-slide-up">
        {/* Logo e título */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-card-foreground">MoneyPro</h1>
        </div>

        <h2 className="text-lg font-semibold text-card-foreground mb-2">
          Criar nova senha
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Digite sua nova senha abaixo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-card-foreground font-medium">
              Nova senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="glass"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password" className="text-card-foreground font-medium">
              Confirmar nova senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="glass"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="premium"
            size="lg"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar senha'}
          </Button>
        </form>
      </div>

      <div className="absolute bottom-4 text-center w-full">
        <p className="text-xs text-foreground/50">
          MoneyPro © 2025 - Seu organizador financeiro
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
