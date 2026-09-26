import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { PanelEmptyMessage } from "@/components/panel";
import type { MemberDiary } from "@/lib/api/types";
import { useMediaStore } from "@/lib/media/media.store";
import { metricName } from "@/lib/metrics";
import { Tooltip } from "@/lib/ui/tooltip";
import { DASH } from "@/utils/dash";
import { formatTickTime } from "@/utils/dates";
import { bossIconUrl, diaryTierIconUrl } from "@/utils/icons";

type AchievementDiaryPanelProps = {
  diaries: MemberDiary[] | undefined;
};

export function AchievementDiaryPanel({ diaries }: Readonly<AchievementDiaryPanelProps>) {
  const { showMedia } = useMediaStore();

  if (!diaries || diaries.length === 0) return <PanelEmptyMessage>No diaries are being tracked.</PanelEmptyMessage>;

  const openScreenshot = ({ content, scale, pb }: MemberDiary) => {
    if (!pb?.imageUrl) return;

    showMedia({
      alt: `${metricName(content.name)}, ${scale} man, in ${formatTickTime(pb.timeSeconds)}`,
      src: pb.imageUrl
    });
  };

  const openScreenshotOnKey = (event: React.KeyboardEvent, diary: MemberDiary) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openScreenshot(diary);
  };

  return (
    <table className="table table-sm">
      <tbody>
        {diaries.map((diary) => {
          const { content, scale, pb, tier, nextTier } = diary;
          const hasScreenshot = Boolean(pb?.imageUrl);

          return (
            <tr
              key={`${content.id}:${scale}`}
              tabIndex={hasScreenshot ? 0 : undefined}
              className={hasScreenshot ? "cursor-pointer hover:bg-base-200" : undefined}
              onClick={() => openScreenshot(diary)}
              onKeyDown={(event) => openScreenshotOnKey(event, diary)}
            >
              <td>
                <span className="inline-flex items-center gap-2">
                  <MetricIcon src={bossIconUrl(content.name)} />
                  {metricName(content.name)}
                  <span className="text-base-content/60">{scale} man</span>
                </span>
              </td>
              <td className="font-medium tabular-nums">
                {nextTier ? (
                  <Tooltip tip={`${nextTier.name} at ${formatTickTime(nextTier.timeSeconds)}`}>
                    {formatTickTime(pb?.timeSeconds)}
                  </Tooltip>
                ) : (
                  formatTickTime(pb?.timeSeconds)
                )}
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
          );
        })}
      </tbody>
    </table>
  );
}
