import type { ReactNode } from "react";

import type { MemberProfile } from "@/lib/api/types";
import { DIARY_POINTS_MAX } from "@/lib/members/diary";
import { statIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

type ProfileSummaryBarProps = {
  profile: MemberProfile;
};

export function ProfileSummaryBar({ profile }: Readonly<ProfileSummaryBarProps>) {
  const { diary, membership, wom } = profile;

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
      <Stat
        icon={<StatIcon stat="clan-points" />}
        label="Clan Points"
        value={formatNumber(membership.points)}
      />
      <Stat
        icon={<StatIcon stat="diary-points" />}
        label="Diary Points"
        value={`${formatNumber(diary.points)} / ${formatNumber(DIARY_POINTS_MAX)}`}
      />
      <Stat
        icon={<StatIcon stat="overall" />}
        label="Total Level"
        value={formatNumber(wom?.totalLevel)}
      />
      <Stat
        icon={<StatIcon stat="overall" />}
        label="Total XP"
        title={formatNumber(wom?.totalExp)}
        value={formatNumber(wom?.totalExp, 0, "compact")}
      />
      <Stat
        icon={<StatIcon stat="ehp" />}
        label="EHP"
        value={formatNumber(wom?.totalEhp, 1)}
      />
      <Stat
        icon={<StatIcon stat="ehb" />}
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
      {icon}
      <div className="flex flex-col gap-0.5">
        <dt className="text-xs text-base-content/60">{label}</dt>
        <dd
          title={title}
          className="text-sm font-medium tabular-nums"
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

type StatIconProps = {
  stat: string;
};

function StatIcon({ stat }: Readonly<StatIconProps>) {
  return (
    <img
      src={statIconUrl(stat)}
      alt=""
      className="size-5 object-contain"
    />
  );
}
