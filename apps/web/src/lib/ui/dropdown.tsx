import { useId } from "react";

import { cn } from "@/lib/ui/utils";

const alignments = {
  center: "dropdown-center",
  end: "dropdown-end",
  start: "dropdown-start"
};

type DropdownProps = {
  align?: keyof typeof alignments;
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Dropdown({ align = "start", label, children, className }: Readonly<DropdownProps>) {
  const id = useId();
  const anchor = `--${id.replaceAll(":", "")}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        className="btn btn-sm"
        style={{ anchorName: anchor } as React.CSSProperties}
      >
        {label}
      </button>
      <ul
        id={id}
        popover=""
        className={cn(
          "menu dropdown w-56 rounded-xs border border-base-300 bg-base-100 p-2 shadow-sm",
          alignments[align],
          className
        )}
        style={{ positionAnchor: anchor } as React.CSSProperties}
      >
        {children}
      </ul>
    </>
  );
}
