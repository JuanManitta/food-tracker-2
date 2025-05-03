import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FoodButtons from "./components/FoodButtons";
import StatsView from "./components/StatsView";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, login, logout } = useAuth();
  const [activeView, setActiveView] = useState<"tracker" | "stats">("tracker");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Registro de Alimentación</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={login} className="gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src="https://www.google.com/favicon.ico" />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              Iniciar con Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Button
              variant={activeView === "tracker" ? "secondary" : "ghost"}
              onClick={() => setActiveView("tracker")}
              className="text-neutral-900 cursor-pointer"
            >
              Registro
            </Button>
            <Button
              variant={activeView === "stats" ? "secondary" : "ghost"}
              onClick={() => setActiveView("stats")}
              className="text-neutral-900 cursor-pointer"
            >
              Estadísticas
            </Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>
                    {user.displayName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-neutral-900">{user.displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout} className="text-neutral-900">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container py-8 px-4">
        {activeView === "tracker" ? <FoodButtons /> : <StatsView />}
      </main>
    </div>
  );
}