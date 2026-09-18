import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/api/query-client";
import { ThemeProvider } from "@/lib/theme/theme-provider";

interface Props {
  children: React.ReactNode;
}

export function AppProvider({ children }: Readonly<Props>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ThemeProvider />
    </QueryClientProvider>
  );
}
