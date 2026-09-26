import { Link } from "@tanstack/react-router";

import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";
import { cn } from "@/lib/ui/utils";

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
    <Hero
      size="sm"
      title={title}
      description={description}
      className={cn("flex items-center justify-center", fullScreen ? "min-h-screen" : "min-h-[60vh]")}
      reducedMotion
    >
      <Button
        asChild
        size="sm"
        variant="outline"
      >
        <Link to="/">Go back home</Link>
      </Button>
    </Hero>
  );
}
