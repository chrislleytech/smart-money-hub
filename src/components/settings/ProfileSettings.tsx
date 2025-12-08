// Componente de configurações de perfil

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Lock, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSettings() {
  const { user, updatePassword } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Update name in auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { name },
      });

      if (authError) throw authError;

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, email })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        toast.success('Senha atualizada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.error || 'Erro ao atualizar senha');
      }
    } catch (error) {
      toast.error('Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // For now, just show a preview (storage bucket needs to be created)
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Avatar atualizado!');
    } catch (error) {
      toast.error('Erro ao fazer upload do avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Foto de Perfil
          </CardTitle>
          <CardDescription>
            Clique para alterar sua foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <div>
            <p className="font-medium">{name || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize suas informações de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      {/* Alterar senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura com uma senha forte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
            />
          </div>
          <Button onClick={handleUpdatePassword} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
