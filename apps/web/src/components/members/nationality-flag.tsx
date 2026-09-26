import { Tooltip } from "@/lib/ui/tooltip";
import { FLAG_CDN_URL } from "@/utils/links";

type NationalityFlagProps = {
  countryCode: string;
};

const isCountryCode = (countryCode: string) => /^[a-z]{2}$/i.test(countryCode);

export function NationalityFlag({ countryCode }: Readonly<NationalityFlagProps>) {
  if (!isCountryCode(countryCode))
    return <span className="text-xs font-normal text-base-content/60">{countryCode}</span>;

  const code = countryCode.toLowerCase();

  return (
    <Tooltip tip={countryCode.toUpperCase()}>
      <img
        src={`${FLAG_CDN_URL}/${code}.svg`}
        width={16}
        height={12}
        alt={countryCode.toUpperCase()}
        loading="lazy"
        className="inline-block"
      />
    </Tooltip>
  );
}
