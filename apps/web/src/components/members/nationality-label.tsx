type NationalityLabelProps = {
  value: string;
};

// Plain text until nationality-to-flag mapping lands; swap the span contents then.
export function NationalityLabel({ value }: Readonly<NationalityLabelProps>) {
  return <span className="text-xs font-normal text-base-content/60">{value}</span>;
}
