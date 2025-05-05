import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import useFood from '@/hooks/useFood';
import { Leaf, Apple, Flame, Pizza } from 'lucide-react';
import { useState } from 'react';

export default function FoodButtons() {
  const { counts, recordFoodChoice } = useFood();
  const [loadingStates, setLoadingStates] = useState({
    healthy: false,
    moderate: false,
    unhealthy: false,
    junk: false
  });

  const handleRecordChoice = async (type: keyof typeof counts) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    try {
      await recordFoodChoice(type);
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const foodTypes = [
    {
      type: 'healthy' as const,
      label: 'Saludable',
      icon: <Leaf className="w-6 h-6" />,
      variant: "secondary" as const
    },
    {
      type: 'moderate' as const,
      label: 'Moderada',
      icon: <Apple className="w-6 h-6" />,
      variant: "outline" as const
    },
    {
      type: 'unhealthy' as const,
      label: 'Calórica',
      icon: <Flame className="w-6 h-6" />,
      variant: "outline" as const
    },
    {
      type: 'junk' as const,
      label: 'Chatarra',
      icon: <Pizza className="w-6 h-6" />,
      variant: "outline" as const
    }
  ];

  return (
    <div className=" p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Registro de Alimentos</CardTitle>
          <CardDescription className="text-center">
            ¿Qué tipo de comida consumiste hoy?
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {foodTypes.map((food) => (
              <Button
                key={food.type}
                variant={food.variant}
                onClick={() => handleRecordChoice(food.type)}
                className="h-24 flex flex-col gap-2"
                disabled={loadingStates[food.type]}
              >
                {loadingStates[food.type] ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center">
                      {food.icon}
                    </div>
                    <span>{food.label}</span>
                    <span className="text-xs font-normal">
                      {counts[food.type]} registros
                    </span>
                  </>
                )}
              </Button>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {foodTypes.map((food) => (
                <div key={food.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {food.icon}
                    <span>{food.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {loadingStates[food.type] && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-foreground"></div>
                    )}
                    <span className="font-medium">{counts[food.type]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}