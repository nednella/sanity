import type { MemberDiary } from "@sanity/api";
import { DASH, formatTickTime, teamScale } from "@sanity/utils";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { PanelEmptyMessage } from "@/components/panel";
import { useMediaStore } from "@/lib/media/media.store";
import { screenshotAlt } from "@/lib/records/screenshot";
import { Table, TableBody, TableCell, TableRow } from "@/lib/ui/table";
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
      alt: screenshotAlt(content.name, scale, pb.timeSeconds),
      src: pb.imageUrl
    });
  }

  return (
    <Table>
      <TableBody>
        {diaries.map((diary) => (
          <DiaryRow
            diary={diary}
            key={`${diary.content.id}:${diary.scale}`}
            onOpenScreenshot={() => openScreenshot(diary)}
          />
        ))}
      </TableBody>
    </Table>
  );
}

type DiaryRowProps = {
  diary: MemberDiary;
  onOpenScreenshot: () => void;
};

function DiaryRow({ diary, onOpenScreenshot }: Readonly<DiaryRowProps>) {
  const { content, scale, pb, tier, nextTier } = diary;
  const hasScreenshot = Boolean(pb?.imageUrl);

  function openScreenshotOnKey(event: React.KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onOpenScreenshot();
  }

  return (
    <TableRow
      className={hasScreenshot ? "cursor-zoom-in" : "hover:bg-transparent"}
      onClick={onOpenScreenshot}
      onKeyDown={openScreenshotOnKey}
      tabIndex={hasScreenshot ? 0 : undefined}
    >
      <TableCell>
        <span className="inline-flex items-center gap-2">
          {content.metric && <MetricIcon src={bossIconUrl(content.metric)} />}
          {content.name}
          <span className="text-muted-foreground">{teamScale(scale)}</span>
        </span>
      </TableCell>
      <TableCell className="font-medium tabular-nums">
        {nextTier ? (
          <Tooltip tip={`${nextTier.name} at ${formatTickTime(nextTier.timeSeconds)}`}>
            {formatTickTime(pb?.timeSeconds)}
          </Tooltip>
        ) : (
          formatTickTime(pb?.timeSeconds)
        )}
      </TableCell>
      <TableCell>
        {tier ? (
          <span className="inline-flex items-center gap-2">
            <MetricIcon src={diaryTierIconUrl(tier.name)} />
            {tier.name}
          </span>
        ) : (
          DASH
        )}
      </TableCell>
    </TableRow>
  );
}
