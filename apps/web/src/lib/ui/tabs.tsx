import { createLink } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/ui/utils";

type TabsProps = {
  actions?: ReactNode;
  children: ReactNode;
};

export function Tabs({ actions, children }: Readonly<TabsProps>) {
  return (
    <nav className="flex flex-wrap items-end justify-between gap-3 border-b border-base-300">
      <div className="flex flex-wrap">{children}</div>
      {actions}
    </nav>
  );
}

function TabAnchor({ className, ...props }: Readonly<React.ComponentPropsWithRef<"a">>) {
  return (
    <a
      className={cn(
        "-mb-px rounded-t-xs border border-b-0 border-transparent px-4 py-2 text-sm text-base-content/60",
        "hover:text-base-content focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
        "data-[status=active]:border-base-300 data-[status=active]:bg-base-100 data-[status=active]:font-semibold data-[status=active]:text-base-content",
        className
      )}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const Tab = createLink(TabAnchor);
