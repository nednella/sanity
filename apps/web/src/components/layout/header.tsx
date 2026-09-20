import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/lib/ui/button";

type HeaderProps = {
  drawerId: string;
};

export function Header({ drawerId }: Readonly<HeaderProps>) {
  return (
    <header className="navbar sticky top-0 z-30 min-h-12 bg-base-100 px-4 py-1">
      <div className="navbar-start">
        <label
          htmlFor={drawerId}
          aria-label="Open sidebar"
          className="btn btn-square btn-ghost btn-sm lg:hidden"
        >
          <Menu className="size-5" />
        </label>
      </div>
      <div className="navbar-end gap-1">
        <ThemeToggle />
        <Button
          asChild
          size="sm"
          variant="ghost"
        >
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    </header>
  );
}
