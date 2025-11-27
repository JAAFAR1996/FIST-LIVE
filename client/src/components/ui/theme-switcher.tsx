import { useEffect, useState } from "react";
import { Moon, Sun, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeOption } from "@/types";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeOption>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeOption | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === 'dark' || savedTheme === 'neon-ocean') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const changeTheme = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    
    // Handle Tailwind's dark mode class
    if (newTheme === 'dark' || newTheme === 'neon-ocean') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {theme === "light" && <Sun className="h-5 w-5" />}
          {theme === "dark" && <Moon className="h-5 w-5" />}
          {theme === "neon-ocean" && <Zap className="h-5 w-5 text-cyan-400" />}
          {theme === "pastel" && <Palette className="h-5 w-5 text-pink-400" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("neon-ocean")}>
          <Zap className="mr-2 h-4 w-4" />
          <span>Neon Ocean</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("pastel")}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Pastel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("monochrome")}>
          <div className="mr-2 h-4 w-4 rounded-full border border-current bg-zinc-500" />
          <span>Monochrome</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
