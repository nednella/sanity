import { UserRound } from "lucide-react";

import { cn } from "@/lib/ui/utils";

type AvatarProps = {
  className?: string;
  src: string | null;
};

export function Avatar({ className, src }: Readonly<AvatarProps>) {
  if (!src) {
    return (
      <div className={cn("avatar avatar-placeholder", className)}>
        <div className="size-16 rounded-full bg-base-200 text-base-content/40">
          <UserRound className="size-8" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("avatar", className)}>
      <div className="size-16 rounded-full">
        <img
          src={src}
          alt=""
        />
      </div>
    </div>
  );
}
