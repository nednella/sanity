import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/api/query-client";

type ApiProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function ApiProvider({ children }: ApiProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
