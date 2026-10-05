import { CIRCLE_FLAG_CDN_URL, RECTANGLE_FLAG_CDN_URL } from "@sanity/urls";

import { Tooltip } from "@/lib/ui/tooltip";

const shapes = {
  circle: { className: "block size-full rounded-full", cdn: CIRCLE_FLAG_CDN_URL, height: 16 },
  rectangle: { className: "block h-3 w-4", cdn: RECTANGLE_FLAG_CDN_URL, height: 12 }
};

type NationalityFlagProps = {
  className?: string;
  countryCode: string;
  shape?: keyof typeof shapes;
};

const isCountryCode = (countryCode: string) => /^[a-z]{2}$/i.test(countryCode);

export function NationalityFlag({ className, countryCode, shape = "rectangle" }: Readonly<NationalityFlagProps>) {
  if (!isCountryCode(countryCode))
    return <span className="text-xs font-normal text-base-content/60">{countryCode}</span>;

  const code = countryCode.toLowerCase();
  const { cdn, className: shapeClassName, height } = shapes[shape];

  // The wrapper carries the placement: `.tooltip` is positioned, so anything absolute inside it
  // would settle against the tooltip rather than against the avatar.
  return (
    <Tooltip
      tip={countryCode.toUpperCase()}
      className={className}
    >
      <img
        src={`${cdn}/${code}.svg`}
        width={16}
        height={height}
        alt={countryCode.toUpperCase()}
        loading="lazy"
        className={shapeClassName}
      />
    </Tooltip>
  );
}
