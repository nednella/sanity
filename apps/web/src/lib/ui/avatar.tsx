import { UserRound } from "lucide-react";

import { cn } from "@/lib/ui/utils";

const sizes = {
  md: {
    frame: "size-16",
    icon: "size-8"
  },
  sm: {
    frame: "size-8",
    icon: "size-4"
  }
};

type AvatarProps = {
  className?: string;
  size?: keyof typeof sizes;
  src: string | null;
};

export function Avatar({ className, size = "md", src }: Readonly<AvatarProps>) {
  if (!src) {
    return (
      <div className={cn("avatar avatar-placeholder", className)}>
        <div className={cn("rounded-full bg-base-200 text-base-content/40", sizes[size].frame)}>
          <UserRound className={sizes[size].icon} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("avatar", className)}>
      <div className={cn("rounded-full", sizes[size].frame)}>
        <img
          alt=""
          src={src}
        />
      </div>
    </div>
  );
}
