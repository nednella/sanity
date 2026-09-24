import { useState } from "react";

type MetricIconProps = {
  src: string;
  size?: number;
};

export function MetricIcon({ src, size = 16 }: Readonly<MetricIconProps>) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 object-contain"
      onError={() => setHasError(true)}
    />
  );
}
