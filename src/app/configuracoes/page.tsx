
'use client';

import { useTheme } from '@/context/theme-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X, Check } from 'lucide-react';
import { themes } from '@/lib/themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Personalize a aparência do seu aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Cor do Tema</h3>
            <p className="text-sm text-muted-foreground">
              Escolha uma cor principal para a interface do sistema.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pt-2">
              {themes.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setTheme(item.name)}
                  className="flex flex-col items-center justify-center gap-2 group"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{ 
                        backgroundColor: `hsl(${item.light.primary})`,
                        borderColor: theme.name === item.name ? `hsl(${item.light.primary})` : 'hsl(var(--border))'
                    }}
                  >
                    {theme.name === item.name && (
                      <Check className="h-6 w-6 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
                <Link href="/" passHref>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
