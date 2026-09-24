import { Fragment } from "react";

import { ProgressBar } from "@/components/members/profile/overview/progress-bar";
import { RankBadge } from "@/components/members/rank-badge";
import { PanelEmptyMessage } from "@/components/panel";
import type { MemberProfile } from "@/lib/api/types";
import { Separator } from "@/lib/ui/separator";
import { Overline } from "@/lib/ui/typography/overline";
import { Small } from "@/lib/ui/typography/small";

type NextRank = NonNullable<MemberProfile["progression"]["nextRank"]["points"]>;

type RankProgressionPanelProps = {
  profile: MemberProfile;
};

export function RankProgressionPanel({ profile }: Readonly<RankProgressionPanelProps>) {
  const { diary, membership, progression } = profile;
  const { nextRank } = progression;

  const standing = {
    clanPoints: membership.points,
    diaryPoints: diary.points,
    masterDiaries: diary.masterDiaries
  };

  const canRankUp = nextRank.points ?? nextRank.diary;

  return (
    <div className="flex flex-1 flex-col">
      {canRankUp ? (
        <div className="flex flex-col gap-6">
          <NextRankCard
            title="Next Rank (Clan Points)"
            nextRank={nextRank.points}
            standing={standing}
          />
          {nextRank.points && nextRank.diary && <Separator />}
          <NextRankCard
            title="Next Rank (Clan Points + Diaries)"
            nextRank={nextRank.diary}
            standing={standing}
          />
        </div>
      ) : (
        <PanelEmptyMessage>No further ranks to progress toward.</PanelEmptyMessage>
      )}
    </div>
  );
}

type NextRankCardProps = {
  title: string;
  nextRank: NextRank | null;
  standing: {
    clanPoints: number;
    diaryPoints: number;
    masterDiaries: number;
  };
};

function NextRankCard({ title, nextRank, standing }: Readonly<NextRankCardProps>) {
  if (!nextRank) return null;

  const { requirements } = nextRank;

  // A diary rank is earned with clan points plus either target, so whichever the member reaches first promotes them.
  const eitherOr = [
    requirements.diaryPoints > 0 && {
      label: "Diary Points",
      value: standing.diaryPoints,
      target: requirements.diaryPoints
    },
    requirements.masterDiaries > 0 && {
      label: "Master Diaries",
      value: standing.masterDiaries,
      target: requirements.masterDiaries
    }
  ].filter((requirement) => requirement !== false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-base-content/60">{title}</span>
        <Small>
          <RankBadge rank={nextRank} />
        </Small>
      </div>

      {requirements.clanPoints > 0 && (
        <ProgressBar
          label="Clan Points"
          value={standing.clanPoints}
          target={requirements.clanPoints}
        />
      )}

      {eitherOr.length > 0 && (
        <>
          <Overline>and</Overline>
          <div className="flex flex-col gap-2 border-l border-base-300 pl-3">
            {eitherOr.map((requirement, index) => (
              <Fragment key={requirement.label}>
                {index > 0 && <Overline>or</Overline>}
                <ProgressBar {...requirement} />
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
