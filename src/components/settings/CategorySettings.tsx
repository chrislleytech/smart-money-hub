// Componente de configurações de categorias personalizadas

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tag, Plus, Trash2, Edit2, Palette } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
  '#78716c', // stone
];

export function CategorySettings() {
  const { customCategories, addCustomCategory, updateCustomCategory, deleteCustomCategory } = useSettings();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      toast.error('Digite o nome da categoria');
      return;
    }

    const existing = customCategories.find(
      c => c.name.toLowerCase() === newName.toLowerCase()
    );
    if (existing) {
      toast.error('Esta categoria já existe');
      return;
    }

    await addCustomCategory(newName.trim(), newColor);
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Digite o nome da categoria');
      return;
    }
    await updateCustomCategory(id, editName.trim(), editColor);
    setEditingId(null);
  };

  const startEditing = (category: { id: string; name: string; color: string }) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categorias Personalizadas
          </CardTitle>
          <CardDescription>
            Crie e gerencie suas próprias categorias de gastos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para criar nova categoria */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <Label>Nova Categoria</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleAddCategory} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Categoria
            </Button>
          </div>

          {/* Lista de categorias */}
          <div className="space-y-3">
            <Label>Suas Categorias</Label>
            {customCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Você ainda não criou nenhuma categoria personalizada.
                <br />
                Crie categorias para organizar melhor seus gastos!
              </p>
            ) : (
              customCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg"
                >
                  {editingId === category.id ? (
                    <div className="flex-1 space-y-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="max-w-xs"
                      />
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-muted-foreground" />
                        <div className="flex gap-1">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEditColor(color)}
                              className={`w-5 h-5 rounded-full transition-transform ${
                                editColor === color ? 'ring-2 ring-offset-1 ring-primary scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCategory(category.id)}
                        >
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCustomCategory(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
