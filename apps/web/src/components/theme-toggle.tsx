import { Monitor, Moon, Sun } from "lucide-react";

import { useThemeStore } from "@/lib/theme/theme.store";
import { Button } from "@/lib/ui/button";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: Readonly<ThemeToggleProps>) {
  const { theme: activeTheme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    if (activeTheme === "light") setTheme("dark");
    else if (activeTheme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    if (activeTheme === "light") return <Sun className="size-4" />;
    if (activeTheme === "dark") return <Moon className="size-4" />;
    return <Monitor className="size-4" />;
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={cycleTheme}
    >
      {getThemeIcon()}
    </Button>
  );
}
