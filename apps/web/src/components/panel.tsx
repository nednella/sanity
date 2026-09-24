import type { ReactNode } from "react";

import { H4 } from "@/lib/ui/typography/h4";
import { Muted } from "@/lib/ui/typography/muted";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export function Panel({ title, children }: Readonly<PanelProps>) {
  return (
    <section className="flex flex-col gap-4 rounded-xs border border-base-300 p-4">
      <H4>{title}</H4>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

type PanelEmptyMessageProps = {
  children: ReactNode;
};

export function PanelEmptyMessage({ children }: Readonly<PanelEmptyMessageProps>) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Muted className="text-center">{children}</Muted>
    </div>
  );
}
