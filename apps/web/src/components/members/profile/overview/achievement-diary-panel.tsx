import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { PanelEmptyMessage } from "@/components/panel";
import type { MemberDiary } from "@/lib/api/types";
import { metricName } from "@/lib/metrics";
import { DASH } from "@/utils/dash";
import { formatTickTime } from "@/utils/dates";
import { bossIconUrl, diaryTierIconUrl } from "@/utils/icons";

type AchievementDiaryPanelProps = {
  diaries: MemberDiary[] | undefined;
};

export function AchievementDiaryPanel({ diaries }: Readonly<AchievementDiaryPanelProps>) {
  if (!diaries || diaries.length === 0) return <PanelEmptyMessage>No diaries are being tracked.</PanelEmptyMessage>;

  return (
    <table className="table table-sm">
      <tbody>
        {diaries.map(({ content, scale, timeSeconds, tier, nextTier }) => (
          <tr key={`${content.id}:${scale}`}>
            <td>
              <span className="inline-flex items-center gap-2">
                <MetricIcon src={bossIconUrl(content.name)} />
                {metricName(content.name)}
                <span className="text-base-content/60">{scale} man</span>
              </span>
            </td>
            <td
              className="font-medium tabular-nums"
              title={nextTier ? `${nextTier.name} at ${formatTickTime(nextTier.timeSeconds)}` : undefined}
            >
              {formatTickTime(timeSeconds)}
            </td>
            <td>
              {tier ? (
                <span className="inline-flex items-center gap-2">
                  <MetricIcon src={diaryTierIconUrl(tier.name)} />
                  {tier.name}
                </span>
              ) : (
                DASH
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
