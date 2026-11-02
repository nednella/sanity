import type { ReactNode } from "react";

import type { MemberProfile } from "@sanity/api";
import { DASH, formatNumber } from "@sanity/utils";

import { Tooltip } from "@/lib/ui/tooltip";
import { diaryTierIconUrl, statIconUrl } from "@/utils/icons";

type ProfileSummaryBarProps = {
  profile: MemberProfile;
};

export function ProfileSummaryBar({ profile }: Readonly<ProfileSummaryBarProps>) {
  const { diary, membership, wom } = profile;

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
      <Stat
        icon={<StatIcon src={statIconUrl("clan-points")} />}
        label="Clan Points"
        value={formatNumber(membership.points)}
      />
      <Stat
        icon={<StatIcon src={statIconUrl("diary-points")} />}
        label="Diary Points"
        value={`${formatNumber(diary.points)} / ${formatNumber(diary.maxPoints)}`}
      />
      <Stat
        icon={<StatIcon src={diaryTierIconUrl("master")} />}
        label="Master Diaries"
        value={`${formatNumber(diary.masterDiaries)} / ${formatNumber(diary.maxMasterDiaries)}`}
      />
      <Stat
        icon={diary.claimedTier && <StatIcon src={diaryTierIconUrl(diary.claimedTier.name)} />}
        label="Claimed Diary Tier"
        value={diary.claimedTier?.name ?? DASH}
      />
      <Stat
        icon={<StatIcon src={statIconUrl("overall")} />}
        label="Total Level"
        value={formatNumber(wom?.totalLevel)}
      />
      <Stat
        icon={<StatIcon src={statIconUrl("overall")} />}
        label="Total XP"
        title={formatNumber(wom?.totalExp)}
        value={formatNumber(wom?.totalExp, 0, "compact")}
      />
      <Stat
        icon={<StatIcon src={statIconUrl("ehp")} />}
        label="EHP"
        value={formatNumber(wom?.totalEhp, 1)}
      />
      <Stat
        icon={<StatIcon src={statIconUrl("ehb")} />}
        label="EHB"
        value={formatNumber(wom?.totalEhb, 1)}
      />
    </dl>
  );
}

type StatProps = {
  icon?: ReactNode;
  label: string;
  title?: string;
  value: string;
};

function Stat({ icon, label, title, value }: Readonly<StatProps>) {
  return (
    <div className="flex items-center gap-x-2.5 rounded-xs border border-base-300 p-3">
      <span className="flex size-5 shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <dt className="text-xs text-base-content/60">{label}</dt>
        <dd className="text-sm font-medium tabular-nums">{title ? <Tooltip tip={title}>{value}</Tooltip> : value}</dd>
      </div>
    </div>
  );
}

type StatIconProps = {
  src: string;
};

function StatIcon({ src }: Readonly<StatIconProps>) {
  return (
    <img
      src={src}
      alt=""
      className="size-5 object-contain"
    />
  );
}
