
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X, Check, Save, Paintbrush, Building, ShoppingCart, Sun, Moon } from 'lucide-react';
import { themes } from '@/lib/themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const { toast } = useToast();

  // State for all settings
  const [settings, setSettings] = useState({
    companyName: '',
    companyCnpj: '',
    companyAddress: '',
    companyPhone: '',
    taxRate: '0.00',
    receiptMessage: 'Obrigado pela preferência! Volte sempre!',
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadedSettings = localStorage.getItem('appSettings');
    if (loadedSettings) {
      setSettings(JSON.parse(loadedSettings));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: 'Configurações Salvas!',
      description: 'Suas novas configurações foram salvas com sucesso.',
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs defaultValue="appearance" className="w-full">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Personalize a aparência e as informações do seu aplicativo.</CardDescription>
            </div>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="appearance"><Paintbrush className="mr-2 h-4 w-4 hidden sm:inline-block"/>Aparência</TabsTrigger>
              <TabsTrigger value="company"><Building className="mr-2 h-4 w-4 hidden sm:inline-block"/>Empresa</TabsTrigger>
              <TabsTrigger value="sales"><ShoppingCart className="mr-2 h-4 w-4 hidden sm:inline-block"/>Vendas</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="appearance" className="space-y-6">
               <div className="space-y-2">
                <h3 className="text-lg font-semibold">Modo de Exibição</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha entre o tema claro ou escuro para a interface.
                </p>
                 <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as 'light' | 'dark')} className="pt-2">
                    <ToggleGroupItem value="light" aria-label="Tema Claro" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Tema Escuro" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                    </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Cor de Destaque</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha uma cor principal para os botões e destaques do sistema.
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-4 pt-2">
                  {themes.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setTheme(item.name)}
                      className="flex flex-col items-center justify-center gap-2 group"
                      aria-label={`Select ${item.label} theme`}
                    >
                      <div
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: `hsl(${mode === 'dark' ? item.dark.primary : item.light.primary})`,
                          borderColor: theme.name === item.name ? `hsl(${mode === 'dark' ? item.dark.primary : item.light.primary})` : 'hsl(var(--border))'
                        }}
                      >
                        {theme.name === item.name && (
                          <Check className="h-6 w-6 text-primary-foreground" style={{ color: `hsl(${mode === 'dark' ? 'var(--primary-foreground)' : 'var(--primary-foreground)'})` }} />
                        )}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
               <div>
                  <h3 className="text-lg font-semibold">Informações da Empresa</h3>
                  <p className="text-sm text-muted-foreground">
                    Estes dados aparecerão no recibo da venda.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input id="companyName" name="companyName" value={settings.companyName} onChange={handleInputChange} placeholder="Ex: O Dono Do Bar" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="companyCnpj">CNPJ</Label>
                        <Input id="companyCnpj" name="companyCnpj" value={settings.companyCnpj} onChange={handleInputChange} placeholder="00.000.000/0001-00" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="companyAddress">Endereço</Label>
                    <Input id="companyAddress" name="companyAddress" value={settings.companyAddress} onChange={handleInputChange} placeholder="Ex: Rua da Cerveja, 123 - Cascavel, PR" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefone</Label>
                    <Input id="companyPhone" name="companyPhone" value={settings.companyPhone} onChange={handleInputChange} placeholder="Ex: (45) 99999-8888" />
                </div>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-4">
                 <div>
                  <h3 className="text-lg font-semibold">Configurações de Venda</h3>
                  <p className="text-sm text-muted-foreground">
                    Personalize as opções relacionadas a impostos e recibos.
                  </p>
                </div>
                <div className="max-w-xs space-y-2">
                    <Label htmlFor="taxRate">Taxa de Imposto Padrão (%)</Label>
                    <Input id="taxRate" name="taxRate" type="number" step="0.01" value={settings.taxRate} onChange={handleInputChange} placeholder="Ex: 8.00" />
                    <p className="text-xs text-muted-foreground">Este valor será usado para calcular os tributos no recibo.</p>
                </div>
                <div className="space-y-2">
                     <Label htmlFor="receiptMessage">Mensagem do Recibo</Label>
                     <Textarea id="receiptMessage" name="receiptMessage" value={settings.receiptMessage} onChange={handleInputChange} placeholder="Mensagem para aparecer no rodapé do recibo." />
                </div>
            </TabsContent>

             <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                  <Link href="/" passHref>
                    <Button variant="outline" type="button">
                        <X className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                  </Link>
                   <Button type="button" onClick={handleSaveSettings}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                    </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

    