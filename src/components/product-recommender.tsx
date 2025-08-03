
'use client';

import type { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getProductRecommendation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, GlassWater, Cigarette, Beer } from 'lucide-react';

const initialState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Pensando...' : 'Obter Recomendação'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

const ProductRecommender: FC = () => {
  const [state, formAction] = useFormState(getProductRecommendation, initialState);

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-2xl font-semibold text-primary">Recomendação da IA</h3>
      <p className="text-sm text-muted-foreground">
        Descreva os sabores, marcas ou tipos de bebidas ou produtos de tabacaria que você gosta, e nossa IA encontrará a opção perfeita para você. (ex: "Gosto de cervejas IPA amargas" ou "Prefiro um tabaco mais suave").
      </p>
      <form action={formAction} className="space-y-4">
        <Textarea
          name="tastePreferences"
          placeholder="e.g., cerveja pilsen, tabaco de menta..."
          required
          rows={3}
          className="bg-input text-foreground"
        />
        <SubmitButton />
        {state.isError && <p className="text-sm font-medium text-destructive">{state.message}</p>}
      </form>
      
      {state.recommendation && (
        <Card className="mt-4 animate-fade-in bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-primary">
              <Beer /> {state.recommendation.recommendation}
            </CardTitle>
            <CardDescription>Nosso especialista de IA sugere:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2"><GlassWater className="text-primary/70" /> Por que você vai gostar:</h4>
              <p className="text-sm text-foreground/80">{state.recommendation.reasoning}</p>
            </div>
             <div>
              <h4 className="font-semibold flex items-center gap-2"><Cigarette className="text-primary/70" /> Harmonização:</h4>
              <p className="text-sm text-foreground/80">Este produto combina perfeitamente com um bom churrasco, petiscos ou uma conversa com amigos.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductRecommender;
