import { cn } from "@/lib/ui/utils";

export function LandingContent() {
  return (
    <div className={cn("absolute inset-0")}>
      <div className="absolute -z-1 size-full bg-black/10" />
      <video
        autoPlay
        className="absolute -z-2 size-full object-cover"
        loop
        muted
        playsInline
        poster="/bg/fishing-v1.jpg"
        src="/bg/fishing-v1.webm"
      />
    </div>
  );
}
