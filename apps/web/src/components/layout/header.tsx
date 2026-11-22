import { Menu } from "lucide-react";

import { AccountMenu } from "@/components/account-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLoginDialog } from "@/lib/login/use-login-dialog";
import { Button } from "@/lib/ui/button";

type HeaderProps = {
  drawerId: string;
};

export function Header({ drawerId }: Readonly<HeaderProps>) {
  const { open } = useLoginDialog();

  return (
    <header
      className="
        navbar sticky top-0 z-30 min-h-12 bg-background px-4 py-1
        lg:px-8
      "
    >
      <div className="navbar-start">
        <label
          aria-label="Open sidebar"
          className="
            btn btn-square btn-ghost btn-sm
            lg:hidden
          "
          htmlFor={drawerId}
        >
          <Menu className="size-5" />
        </label>
      </div>
      <div className="navbar-end gap-1">
        <ThemeToggle />
        <AccountMenu>
          <Button
            onClick={open}
            size="sm"
            variant="ghost"
          >
            Log in
          </Button>
        </AccountMenu>
      </div>
    </header>
  );
}
