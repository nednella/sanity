import { CalendarDays, Hourglass, Swords } from "lucide-react";
import type { ReactNode } from "react";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { WomNoSync } from "@/components/members/profile/wom-no-sync";
import type { Boss, MemberProfile } from "@/lib/api/types";
import { metricName } from "@/lib/metrics";
import { DASH } from "@/utils/dash";
import { formatRelativeDate } from "@/utils/dates";
import { bossIconUrl, statIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

type BossStats = {
  totalKills: number;
  mostEhb: Boss | null;
  mostKilled: Boss | null;
};

function bossStats(bosses: Boss[]): BossStats {
  const totals: BossStats = { totalKills: 0, mostEhb: null, mostKilled: null };

  for (const boss of bosses) {
    totals.totalKills += boss.kills;
    if (!totals.mostEhb || boss.ehb > totals.mostEhb.ehb) totals.mostEhb = boss;
    if (!totals.mostKilled || boss.kills > totals.mostKilled.kills) totals.mostKilled = boss;
  }

  return totals;
}

// Wise Old Man reports EHP to maxed and 200m, so nothing left means completed.
const formatRemaining = (hours: number | null, completed: string) => {
  if (hours === null) return DASH;
  if (hours === 0) return completed;
  return `${formatNumber(hours)}h`;
};

type WomSummaryPanelProps = {
  profile: MemberProfile;
};

export function WomSummaryPanel({ profile }: Readonly<WomSummaryPanelProps>) {
  const { wom } = profile;

  const bosses = wom?.latestSnapshot?.bosses ?? [];
  const { totalKills, mostEhb, mostKilled } = bossStats(bosses);

  return (
    <div className="flex flex-1 flex-col gap-2">
      {wom ? (
        <>
          <FactRow
            icon={<CalendarDays className="size-4" />}
            label="Last Active"
            value={formatRelativeDate(wom.lastChangedAt)}
          />
          <FactRow
            icon={<Hourglass className="size-4" />}
            label="Time to Max"
            value={formatRemaining(wom.timeToMax, "Maxed")}
          />
          <FactRow
            icon={<Hourglass className="size-4" />}
            label="Time to 200m All"
            value={formatRemaining(wom.timeTo200m, "Complete")}
          />
          <FactRow
            icon={<MetricIcon src={statIconUrl("overall")} />}
            label="Total Level"
            value={formatNumber(wom.totalLevel)}
          />
          <FactRow
            icon={<MetricIcon src={statIconUrl("overall")} />}
            label="Total XP"
            value={formatNumber(wom.totalExp)}
          />
          <FactRow
            icon={<MetricIcon src={statIconUrl("ehp")} />}
            label="EHP"
            value={formatNumber(wom.totalEhp, 1)}
          />
          <FactRow
            icon={<MetricIcon src={statIconUrl("ehb")} />}
            label="EHB"
            value={formatNumber(wom.totalEhb, 1)}
          />
          <FactRow
            icon={<Swords className="size-4" />}
            label="Boss Kills"
            value={formatNumber(totalKills)}
          />
          {mostEhb && (
            <FactRow
              icon={<MetricIcon src={bossIconUrl(mostEhb.boss)} />}
              label="Most EHB"
              value={`${metricName(mostEhb.boss)} (${formatNumber(mostEhb.ehb, 1)})`}
            />
          )}
          {mostKilled && (
            <FactRow
              icon={<MetricIcon src={bossIconUrl(mostKilled.boss)} />}
              label="Most Killed"
              value={`${metricName(mostKilled.boss)} (${formatNumber(mostKilled.kills)})`}
            />
          )}
        </>
      ) : (
        <WomNoSync />
      )}
    </div>
  );
}

type FactRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

function FactRow({ icon, label, value }: Readonly<FactRowProps>) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="inline-flex items-center gap-2 text-base-content/60">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
