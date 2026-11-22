import { cn } from "cn";
import { useImperativeHandle, useRef } from "react";

import { H3 } from "@/lib/ui/typography/h3";

export type DialogHandle = {
  close: () => void;
  open: () => void;
};

type DialogProps = {
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  ref: React.Ref<DialogHandle>;
  title: string;
};

export function Dialog({ aside, ref, title, children, className, onClose }: Readonly<DialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    close: () => dialogRef.current?.close(),
    open: () => dialogRef.current?.showModal()
  }));

  return (
    <dialog
      className="modal"
      onClose={onClose}
      ref={dialogRef}
    >
      <div className={cn("modal-box rounded-xs border border-base-300", aside && "grid p-0", className)}>
        {aside}
        <div className={cn(aside && "flex flex-col p-8 text-center")}>
          <H3>{title}</H3>
          <div className={cn("flex-1", aside ? "pt-4" : "py-4")}>{children}</div>
        </div>
      </div>
      <form
        className="modal-backdrop"
        method="dialog"
      >
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}
