import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/lib/ui/card";
import { H4 } from "@/lib/ui/typography/h4";
import { Muted } from "@/lib/ui/typography/muted";

type PanelProps = {
  children: ReactNode;
  title: string;
};

export function Panel({ title, children }: Readonly<PanelProps>) {
  return (
    <Card>
      <CardHeader>
        <H4>{title}</H4>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">{children}</CardContent>
    </Card>
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
