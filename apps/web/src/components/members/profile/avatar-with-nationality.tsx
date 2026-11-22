import { UserRound } from "lucide-react";

import { NationalityFlag } from "@/components/members/nationality-flag";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";

type AvatarWithNationalityProps = {
  avatarUrl: string | null;
  countryCode: string | null;
};

export function AvatarWithNationality({ avatarUrl, countryCode }: Readonly<AvatarWithNationalityProps>) {
  return (
    <div className="relative w-fit">
      <Avatar className="size-16">
        {avatarUrl && <AvatarImage src={avatarUrl} />}
        <AvatarFallback>
          <UserRound className="size-8" />
        </AvatarFallback>
      </Avatar>
      {countryCode && (
        <NationalityFlag
          className="absolute -right-1 -bottom-1 size-6 rounded-full ring-2 ring-background"
          countryCode={countryCode}
          shape="circle"
        />
      )}
    </div>
  );
}
