import { CIRCLE_FLAG_CDN_URL, RECTANGLE_FLAG_CDN_URL } from "@sanity/urls";
import { isCountryCode } from "@sanity/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";

const shapes = {
  circle: { className: "block size-full rounded-full", cdn: CIRCLE_FLAG_CDN_URL, height: 16 },
  rectangle: { className: "block h-3 w-4", cdn: RECTANGLE_FLAG_CDN_URL, height: 12 }
};

type NationalityFlagProps = {
  className?: string;
  countryCode: string;
  shape?: keyof typeof shapes;
};

export function NationalityFlag({ className, countryCode, shape = "rectangle" }: Readonly<NationalityFlagProps>) {
  if (!isCountryCode(countryCode)) {
    return <span className="text-xs font-normal text-muted-foreground">{countryCode}</span>;
  }

  const code = countryCode.toLowerCase();
  const { cdn, className: shapeClassName, height } = shapes[shape];

  return (
    <Tooltip>
      <TooltipTrigger render={<span className={className} />}>
        <img
          alt={countryCode.toUpperCase()}
          className={shapeClassName}
          height={height}
          loading="lazy"
          src={`${cdn}/${code}.svg`}
          width={16}
        />
      </TooltipTrigger>
      <TooltipContent>{countryCode.toUpperCase()}</TooltipContent>
    </Tooltip>
  );
}
