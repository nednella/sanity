import { type ClassValue, clsx } from "clsx";
import type { MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A menu item is not a form control, so picking one has to dismiss the popover
// it sits in.
export function closeDropdown(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover();
}
