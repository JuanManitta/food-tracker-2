import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { useStats } from "@/hooks/useStats";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Leaf, Apple, Flame, Pizza } from "lucide-react";
import useStats from "@/hooks/useStats";

const COLORS = [
  "hsl(0 0% 20%)",  // dark gray
  "hsl(0 0% 40%)",  // medium gray
  "hsl(0 0% 60%)",  // light gray
  "hsl(0 0% 80%)"   // very light gray
];

const iconMap = {
  healthy: <Leaf className="w-4 h-4" />,
  moderate: <Apple className="w-4 h-4" />,
  unhealthy: <Flame className="w-4 h-4" />,
  junk: <Pizza className="w-4 h-4" />
};

export default function StatsView() {
  const { stats, percentages } = useStats();

  const data = [
    { name: "Saludable", value: percentages.healthy, type: "healthy" },
    { name: "Moderada", value: percentages.moderate, type: "moderate" },
    { name: "No saludable", value: percentages.unhealthy, type: "unhealthy" },
    { name: "Chatarra", value: percentages.junk, type: "junk" },
  ];

  return (
    <div className="container p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-foreground">Estadísticas de Consumo</CardTitle>
          <CardDescription>
            Registros acumulados por {stats.daysTracked} días
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="hsl(0 0% 90%)"
                    />
                  ))}
                </Pie>
                <Legend 
                  formatter={(value) => <span className="text-foreground">{value}</span>}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    `${props.payload.name} (${stats[props.payload.type as keyof typeof stats]})`
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 100%)",
                    borderColor: "hsl(0 0% 80%)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.map((item) => (
              <Card key={item.name} className="p-4 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      {iconMap[item.type as keyof typeof iconMap]}
                    </div>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground">{item.value}%</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({stats[item.type as keyof typeof stats]})
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}