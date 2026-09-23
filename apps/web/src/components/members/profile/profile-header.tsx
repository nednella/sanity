import { ProfileDetails } from "@/components/members/profile/profile-details";
import { WomSyncButton } from "@/components/members/profile/wom-sync-button";
import { RankBadge } from "@/components/members/rank-badge";
import type { MemberProfile } from "@/lib/api/types";
import { Avatar } from "@/lib/ui/avatar";
import { H1 } from "@/lib/ui/typography/h1";
import { Muted } from "@/lib/ui/typography/muted";

type ProfileHeaderProps = {
  profile: MemberProfile;
};

export function ProfileHeader({ profile }: Readonly<ProfileHeaderProps>) {
  const { discord, displayName, id, membership, rsn } = profile;

  return (
    <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_auto]">
      <div className="self-end *:w-full sm:col-start-2 sm:*:w-auto">
        {rsn.main && (
          <WomSyncButton
            memberId={id}
            username={rsn.main}
          />
        )}
      </div>

      <div className="flex min-w-0 items-center gap-x-6 sm:col-start-1 sm:row-start-1">
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
