import { AuthProvider } from "@/lib/auth/auth-provider";
import { MediaProvider } from "@/lib/media/media-provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { TooltipProvider } from "@/lib/ui/tooltip";
import { ApiProvider } from "@/providers/query-client-provider";
import { ToastProvider } from "@/providers/sonner-provider";

interface Props {
  children: React.ReactNode;
}

export function AppProvider({ children }: Readonly<Props>) {
  return (
    <ApiProvider>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
      <MediaProvider />
      <ThemeProvider />
      <ToastProvider />
    </ApiProvider>
  );
}
