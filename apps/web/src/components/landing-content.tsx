import { cn } from "@/lib/ui/utils";

export function LandingContent() {
  return (
    <div className={cn("absolute inset-0")}>
      <div className="absolute -z-1 size-full bg-black/10" />
      <video
        src="/bg/fishing-v1.webm"
        poster="/bg/fishing-v1.jpg"
        className="absolute -z-2 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
