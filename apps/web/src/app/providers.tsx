import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/api/query-client.js";

interface Props {
  children: React.ReactNode;
}

export function AppProvider({ children }: Readonly<Props>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
