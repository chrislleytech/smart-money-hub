// Formulário de login e cadastro do MoneyPro

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login(email, password);
        if (result.success) {
          toast({
            title: 'Bem-vindo ao MoneyPro!',
            description: 'Login realizado com sucesso.',
          });
          navigate('/dashboard');
        } else {
          toast({
            title: 'Erro no login',
            description: result.error || 'Email ou senha incorretos.',
            variant: 'destructive',
          });
        }
      } else {
        // Cadastro
        if (password !== confirmPassword) {
          toast({
            title: 'Erro',
            description: 'As senhas não coincidem.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast({
            title: 'Erro',
            description: 'A senha deve ter pelo menos 6 caracteres.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const result = await register(name, email, password);
        if (result.success) {
          if (result.error) {
            // Email confirmation required
            toast({
              title: 'Conta criada!',
              description: result.error,
            });
          } else {
            toast({
              title: 'Conta criada!',
              description: 'Sua conta foi criada com sucesso.',
            });
            navigate('/dashboard');
          }
        } else {
          toast({
            title: 'Erro no cadastro',
            description: result.error || 'Não foi possível criar a conta. Tente novamente.',
            variant: 'destructive',
          });
        }
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-slide-up">
      {/* Logo e título */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-card-foreground">MoneyPro</h1>
      </div>

      {/* Título do formulário */}
      <h2 className="text-lg font-semibold text-card-foreground mb-6">
        {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
      </h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome (apenas no cadastro) */}
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground font-medium">
              Nome
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="glass"
                className="pl-10"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        {/* Campo Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-card-foreground font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="glass"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-card-foreground font-medium">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
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

        {/* Campo Confirmar Senha (apenas no cadastro) */}
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-card-foreground font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="glass"
                className="pl-10 pr-10"
                required={!isLogin}
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
        )}

        <Button
          type="submit"
          variant="premium"
          size="lg"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (isLogin ? 'Entrando...' : 'Criando conta...') : (isLogin ? 'Entrar' : 'Criar Conta')}
        </Button>

        {isLogin && (
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center"
          >
            Esqueceu a senha?
          </button>
        )}
      </form>

      {/* Modal de recuperação de senha */}
      <ForgotPasswordModal
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
      {/* Alternar entre login e cadastro */}
      <div className="mt-6 pt-4 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-1 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            {isLogin ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}
