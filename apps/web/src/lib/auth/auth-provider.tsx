import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api/client";
import { authenticatedMemberOptions } from "@/lib/api/queries/members";
import { AuthContext } from "@/lib/auth/use-auth";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const queryClient = useQueryClient();

  const { data: member, isPending } = useQuery(authenticatedMemberOptions());

  const logout = api.useMutation("post", "/v1/auth/logout", {
    onSuccess: () => queryClient.resetQueries({ queryKey: authenticatedMemberOptions().queryKey }),
    onError: () => toast.error("Something went wrong", { description: "Please try again later" })
  });

  return (
    <AuthContext
      value={{
        isLoading: isPending || logout.isPending,
        logout: () => logout.mutate({}),
        member
      }}
    >
      {children}
    </AuthContext>
  );
}
