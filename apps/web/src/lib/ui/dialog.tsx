import { useImperativeHandle, useRef } from "react";

import { H3 } from "@/lib/ui/typography/h3";
import { cn } from "@/lib/ui/utils";

export type DialogHandle = {
  close: () => void;
  open: () => void;
};

type DialogProps = {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  ref: React.Ref<DialogHandle>;
  title: string;
};

export function Dialog({ ref, title, children, className, onClose }: Readonly<DialogProps>) {
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
      <div className={cn("modal-box rounded-xs border border-base-300", className)}>
        <H3>{title}</H3>
        <div className="py-4">{children}</div>
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
