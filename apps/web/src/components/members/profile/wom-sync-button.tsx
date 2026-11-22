import { useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api/client";
import { memberProfileOptions } from "@/lib/api/queries/members";
import { Button } from "@/lib/ui/button";

type WomSyncButtonProps = {
  memberId: string;
  username: string;
};

export function WomSyncButton({ memberId, username }: Readonly<WomSyncButtonProps>) {
  const queryClient = useQueryClient();

  const sync = api.useMutation("post", "/v1/wom/players/{username}/sync", {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberProfileOptions(memberId).queryKey }),
    onError: (error) => toast.error("Couldn't update this clan member", { description: error.message })
  });

  return (
    <Button
      disabled={sync.isPending}
      onClick={() => sync.mutate({ params: { path: { username } } })}
      size="sm"
      variant="outline"
    >
      <RefreshCw className={cn("size-4", sync.isPending && "animate-spin")} />
      Sync
    </Button>
  );
}
