import type { RankSummary } from "@/lib/api/types";

type RankBadgeProps = {
  rank: RankSummary;
};

export function RankBadge({ rank }: Readonly<RankBadgeProps>) {
  return (
    <span className="inline-flex items-center gap-2">
      {rank.iconUrl && (
        <img
          src={rank.iconUrl}
          alt={rank.name}
          className="size-4"
        />
      )}
      {rank.name}
    </span>
  );
}
