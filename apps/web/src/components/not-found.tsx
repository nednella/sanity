import { Link } from "@tanstack/react-router";

import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";

type NotFoundProps = {
  description?: string;
  title?: string;
};

export function NotFound({
  description = "we can't find the page you're looking for",
  title = "Page not found"
}: Readonly<NotFoundProps>) {
  return (
    <Hero
      size="sm"
      title={title}
      description={description}
      className="flex h-full items-center justify-center"
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
