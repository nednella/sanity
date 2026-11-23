import { Link } from "@tanstack/react-router";

import { Button } from "@/lib/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/lib/ui/empty";

type NotFoundProps = {
  description?: string;
  fullScreen?: boolean;
  title?: string;
};

export function NotFound({
  description = "we can't find the page you're looking for",
  fullScreen = false,
  title = "Page not found"
}: Readonly<NotFoundProps>) {
  return (
    <Empty className={fullScreen ? "min-h-dvh" : "min-h-[60vh]"}>
      <EmptyHeader>
        <EmptyTitle className="text-2xl font-semibold">{title}</EmptyTitle>
        <EmptyDescription className="text-base">{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          nativeButton={false}
          render={<Link to="/" />}
          size="sm"
          variant="outline"
        >
          Go back home
        </Button>
      </EmptyContent>
    </Empty>
  );
}
