import { Menu } from "lucide-react";

import { AccountMenu } from "@/components/account-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLoginDialog } from "@/lib/login/use-login-dialog";
import { Button } from "@/lib/ui/button";
import { useSidebar } from "@/lib/ui/sidebar";

export function Header() {
  const { open } = useLoginDialog();
  const { toggleSidebar } = useSidebar();

  return (
    <header
      className="
        sticky top-0 z-30 flex h-12 items-center gap-1 bg-background px-4
        lg:px-8
      "
    >
      <Button
        aria-label="Open the sidebar"
        className="
          -ml-1.5
          md:hidden
        "
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <Menu className="size-5" />
      </Button>
      <div className="ms-auto flex items-center gap-1">
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
