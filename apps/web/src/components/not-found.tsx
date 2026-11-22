import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";

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
      className={cn("flex items-center justify-center", fullScreen ? "min-h-screen" : "min-h-[60vh]")}
      description={description}
      reducedMotion
      size="sm"
      title={title}
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
