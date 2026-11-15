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
      alt=""
      className="shrink-0 object-contain"
      height={size}
      onError={() => setHasError(true)}
      src={src}
      style={{ width: size, height: size }}
      width={size}
    />
  );
}
