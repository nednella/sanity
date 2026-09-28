import { NationalityFlag } from "@/components/members/nationality-flag";
import { Avatar } from "@/lib/ui/avatar";

type AvatarWithNationalityProps = {
  avatarUrl: string | null;
  countryCode: string | null;
};

export function AvatarWithNationality({ avatarUrl, countryCode }: Readonly<AvatarWithNationalityProps>) {
  return (
    <div className="relative w-fit">
      <Avatar src={avatarUrl} />
      {countryCode && (
        <NationalityFlag
          className="absolute -right-1 -bottom-1 size-6 rounded-full ring-2 ring-base-100"
          countryCode={countryCode}
          shape="circle"
        />
      )}
    </div>
  );
}
