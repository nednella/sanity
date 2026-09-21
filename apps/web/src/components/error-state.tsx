import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";

type ErrorStateProps = {
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  tag?: string;
  title?: string;
};

export function ErrorState({
  description = "Please try again",
  error,
  onRetry,
  tag,
  title = "Oops, something went wrong"
}: Readonly<ErrorStateProps>) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const details = error instanceof Error ? (error.stack ?? error.message) : JSON.stringify(error);

  return (
    <Hero
      size="sm"
      title={title}
      description={description}
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry ?? (() => location.reload())}
        >
          Try again
        </Button>

        {isDevelopment && error != null && (
          <div className="flex flex-col items-start gap-2">
            {tag && (
              <Badge
                size="sm"
                variant="error"
              >
                {tag}
              </Badge>
            )}
            <code className="max-w-2xl overflow-x-auto rounded-xs border border-error/40 bg-error/10 p-4 text-left text-xs whitespace-pre-wrap">
              {details}
            </code>
          </div>
        )}
      </div>
    </Hero>
  );
}
