import { createLink } from "@tanstack/react-router";
import { cn } from "cn";
import type { ReactNode } from "react";

// oxlint-disable-next-line react/only-export-components
export const Tab = createLink(TabAnchor);

type TabsProps = {
  actions?: ReactNode;
  children: ReactNode;
};

export function Tabs({ actions, children }: Readonly<TabsProps>) {
  return (
    <nav className="flex flex-wrap items-end justify-between gap-3 border-b">
      <div className="flex flex-wrap">{children}</div>
      {actions}
    </nav>
  );
}

function TabAnchor({ className, ...props }: Readonly<React.ComponentPropsWithRef<"a">>) {
  return (
    <a
      className={cn(
        "-mb-px border border-b-0 border-transparent px-4 py-2 text-sm text-muted-foreground",
        `
          hover:text-foreground
          outline-none
          focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset
        `,
        `
          data-[status=active]:border-border data-[status=active]:bg-background data-[status=active]:font-semibold
          data-[status=active]:text-foreground
        `,
        className
      )}
      {...props}
    />
  );
}
