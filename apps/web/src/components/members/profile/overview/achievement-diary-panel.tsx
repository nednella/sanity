import type { MemberDiary } from "@sanity/api";
import { DASH, formatTickTime, teamScale } from "@sanity/utils";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { PanelEmptyMessage } from "@/components/panel";
import { useMediaStore } from "@/lib/media/media.store";
import { Tooltip } from "@/lib/ui/tooltip";
import { bossIconUrl, diaryTierIconUrl } from "@/utils/icons";

type AchievementDiaryPanelProps = {
  diaries: MemberDiary[] | undefined;
};

export function AchievementDiaryPanel({ diaries }: Readonly<AchievementDiaryPanelProps>) {
  const { showMedia } = useMediaStore();

  if (!diaries || diaries.length === 0) return <PanelEmptyMessage>No diaries are being tracked.</PanelEmptyMessage>;

  function openScreenshot({ content, scale, pb }: MemberDiary) {
    if (!pb?.imageUrl) return;

    showMedia({
      alt: `${content.name}, ${teamScale(scale)}, in ${formatTickTime(pb.timeSeconds)}`,
      src: pb.imageUrl
    });
  }

  function openScreenshotOnKey(event: React.KeyboardEvent, diary: MemberDiary) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openScreenshot(diary);
  }

  return (
    <table className="table table-sm">
      <tbody>
        {diaries.map((diary) => {
          const { content, scale, pb, tier, nextTier } = diary;
          const hasScreenshot = Boolean(pb?.imageUrl);

          return (
            <tr
              className={hasScreenshot ? "cursor-zoom-in hover:bg-base-200" : undefined}
              key={`${content.id}:${scale}`}
              onClick={() => openScreenshot(diary)}
              onKeyDown={(event) => openScreenshotOnKey(event, diary)}
              tabIndex={hasScreenshot ? 0 : undefined}
            >
              <td>
                <span className="inline-flex items-center gap-2">
                  {content.metric && <MetricIcon src={bossIconUrl(content.metric)} />}
                  {content.name}
                  <span className="text-base-content/60">{teamScale(scale)}</span>
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
