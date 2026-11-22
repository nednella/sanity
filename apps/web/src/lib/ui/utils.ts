import type { MouseEvent } from "react";

export function closeDropdown(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover();
}
