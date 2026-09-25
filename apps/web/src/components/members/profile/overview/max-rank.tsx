import { Sparkles } from "lucide-react";

import type { RankSummary } from "@/lib/api/types";
import { H3 } from "@/lib/ui/typography/h3";
import { Overline } from "@/lib/ui/typography/overline";

type MaxRankProps = {
  rank: RankSummary;
};

export function MaxRank({ rank }: Readonly<MaxRankProps>) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 text-center">
      {/* A gradient rather than a blurred shape, so the glow fades out instead of meeting a clipped edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 bg-[radial-gradient(circle_at_center,var(--color-base-300),transparent_65%)] opacity-50"
      />

      <div className="relative flex size-20 items-center justify-center rounded-full border border-base-300 bg-base-200/40">
        <Sparkles
          aria-hidden="true"
          className="absolute top-0 right-1 size-4 text-primary/70 motion-safe:animate-pulse"
        />
        {rank.iconUrl && (
          <img
            src={rank.iconUrl}
            alt=""
            className="size-10 object-contain [image-rendering:pixelated]"
          />
        )}
      </div>

      <div className="relative flex flex-col items-center gap-1">
        <Overline>Maxed rank</Overline>
        <H3>{rank.name}</H3>
      </div>
    </div>
  );
}
