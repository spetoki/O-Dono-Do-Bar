
'use client';

import type { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getWineRecommendation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Grape, Wine, ChefHat } from 'lucide-react';

const initialState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Thinking...' : 'Get Recommendation'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

const WineRecommender: FC = () => {
  const [state, formAction] = useFormState(getWineRecommendation, initialState);

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-2xl font-semibold text-primary">AI Sommelier</h3>
      <p className="text-sm text-muted-foreground">
        Describe the flavors, aromas, or types of wine you enjoy, and our AI will find the perfect bottle for you. (e.g., "I like dry, fruity red wines with a hint of oak.")
      </p>
      <form action={formAction} className="space-y-4">
        <Textarea
          name="tastePreferences"
          placeholder="e.g., dry, fruity, full-bodied..."
          required
          rows={3}
        />
        <SubmitButton />
        {state.isError && <p className="text-sm font-medium text-destructive">{state.message}</p>}
      </form>
      
      {state.recommendation && (
        <Card className="mt-4 animate-fade-in bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-primary">
              <Wine /> {state.recommendation.recommendation}
            </CardTitle>
            <CardDescription>Our AI Sommelier suggests:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2"><Grape className="text-primary/70" /> Why you'll love it:</h4>
              <p className="text-sm text-foreground/80">{state.recommendation.reasoning}</p>
            </div>
             <div>
              <h4 className="font-semibold flex items-center gap-2"><ChefHat className="text-primary/70" /> Food Pairing:</h4>
              <p className="text-sm text-foreground/80">This wine pairs wonderfully with grilled red meats, aged cheeses, or a hearty pasta dish.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WineRecommender;
