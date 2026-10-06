import { Skull, Sparkles, Swords, TrendingUp, Trophy, UserPlus } from "lucide-react";
import type { ComponentType } from "react";

type PlaceholderEntry = {
  icon: ComponentType<{ className?: string }>;
  description: string;
  timeAgo: string;
};

// Placeholder until an activity feed endpoint exists.
const PLACEHOLDER_ACTIVITY: PlaceholderEntry[] = [
  { icon: Trophy, description: "Reached level 99 in Woodcutting", timeAgo: "2 hours ago" },
  { icon: Skull, description: "Killed Vorkath for the 100th time", timeAgo: "1 day ago" },
  { icon: Sparkles, description: "Claimed the Master diary tier", timeAgo: "3 days ago" },
  { icon: TrendingUp, description: "Gained 2.1M experience in Slayer", timeAgo: "5 days ago" },
  { icon: Swords, description: "Recorded a new personal best at Theatre of Blood", timeAgo: "1 week ago" },
  { icon: UserPlus, description: "Joined the clan", timeAgo: "3 months ago" }
];

export function RecentActivity() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-base-content/40">Placeholder data — an activity feed is coming soon.</p>

      <ul className="flex flex-col divide-y divide-base-content/5">
        {PLACEHOLDER_ACTIVITY.map((entry) => (
          <li
            key={entry.description}
            className="flex items-center gap-3 py-2 text-sm"
          >
            <entry.icon className="size-4 shrink-0 text-base-content/60" />
            <span className="flex-1">{entry.description}</span>
            <span className="text-xs text-base-content/40">{entry.timeAgo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
