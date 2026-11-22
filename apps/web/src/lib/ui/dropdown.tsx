import { cn } from "cn";
import { useId } from "react";

const alignments = {
  center: "dropdown-center",
  end: "dropdown-end",
  start: "dropdown-start"
};

type DropdownProps = {
  align?: keyof typeof alignments;
  children: React.ReactNode;
  className?: string;
  label: React.ReactNode;
  triggerClassName?: string;
};

export function Dropdown({ align = "start", label, children, className, triggerClassName }: Readonly<DropdownProps>) {
  const id = useId();
  const anchor = `--${id.replaceAll(":", "")}`;

  return (
    <>
      <button
        className={cn("btn btn-sm", triggerClassName)}
        popoverTarget={id}
        style={{ anchorName: anchor } as React.CSSProperties}
        type="button"
      >
        {label}
      </button>
      <ul
        className={cn("menu dropdown w-56 border bg-background p-2 shadow-sm", alignments[align], className)}
        id={id}
        popover=""
        style={{ positionAnchor: anchor } as React.CSSProperties}
      >
        {children}
      </ul>
    </>
  );
}
