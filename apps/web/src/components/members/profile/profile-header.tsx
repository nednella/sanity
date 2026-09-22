import { ProfileDetails } from "@/components/members/profile/profile-details";
import { RankBadge } from "@/components/members/rank-badge";
import type { MemberProfile } from "@/lib/api/types";
import { Avatar } from "@/lib/ui/avatar";
import { H1 } from "@/lib/ui/typography/h1";
import { Muted } from "@/lib/ui/typography/muted";

type ProfileHeaderProps = {
  profile: MemberProfile;
};

export function ProfileHeader({ profile }: Readonly<ProfileHeaderProps>) {
  const { discord, displayName, membership } = profile;

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-x-6">
        <Avatar src={discord.avatarUrl} />

        <div className="flex flex-col gap-1">
          <H1 className="text-start">{displayName}</H1>
          <Muted>
            <RankBadge rank={membership.rank} />
          </Muted>
          <ProfileDetails profile={profile} />
        </div>
      </div>
    </div>
  );
}
