import { MediaProvider } from "@/lib/media/media-provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { ApiProvider } from "@/providers/query-client-provider";
import { ToastProvider } from "@/providers/sonner-provider";

interface Props {
  children: React.ReactNode;
}

export function AppProvider({ children }: Readonly<Props>) {
  return (
    <ApiProvider>
      {children}
      <MediaProvider />
      <ThemeProvider />
      <ToastProvider />
    </ApiProvider>
  );
}
