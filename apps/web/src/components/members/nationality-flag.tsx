import { FLAG_CDN_URL } from "@/lib/links.js";

type NationalityFlagProps = {
  value: string;
};

const isCountryCode = (value: string) => /^[a-z]{2}$/i.test(value);

export function NationalityFlag({ value }: Readonly<NationalityFlagProps>) {
  if (!isCountryCode(value)) return <span className="text-xs font-normal text-base-content/60">{value}</span>;

  const code = value.toLowerCase();

  return (
    <img
      src={`${FLAG_CDN_URL}/16x12/${code}.png`}
      srcSet={`${FLAG_CDN_URL}/32x24/${code}.png 2x, ${FLAG_CDN_URL}/48x36/${code}.png 3x`}
      width={16}
      height={12}
      alt={value.toUpperCase()}
      title={value.toUpperCase()}
      loading="lazy"
      className="inline-block rounded-xs"
    />
  );
}
