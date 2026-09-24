import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api/openapi-client";
import { memberProfileOptions } from "@/lib/api/queries/members";
import { Button } from "@/lib/ui/button";
import { cn } from "@/lib/ui/utils";

type WomSyncButtonProps = {
  memberId: string;
  username: string;
};

export function WomSyncButton({ memberId, username }: Readonly<WomSyncButtonProps>) {
  const queryClient = useQueryClient();

  const sync = api.useMutation("post", "/v1/wom/players/{username}/sync", {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberProfileOptions(memberId).queryKey }),
    onError: (error) => toast.error("Couldn't update this clan member", { description: (error as Error).message })
  });

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={sync.isPending}
      onClick={() => sync.mutate({ params: { path: { username } } })}
    >
      <RefreshCw className={cn("size-4", sync.isPending && "animate-spin")} />
      Sync
    </Button>
  );
}
