import { type ComponentType, createContext, useContext, useEffect } from "react";

export type SiteLayoutOptions = {
  hiddenSidebar?: boolean;
  secondarySidebar?: ComponentType;
};

export const SiteLayoutContext = createContext<((options: SiteLayoutOptions) => void) | null>(null);

export function useSiteLayout({ hiddenSidebar, secondarySidebar }: SiteLayoutOptions) {
  const setOptions = useContext(SiteLayoutContext);
  if (!setOptions) throw new Error("useSiteLayout must be used inside a SiteLayout");

  useEffect(() => {
    setOptions({ hiddenSidebar, secondarySidebar });
    return () => setOptions({});
  }, [hiddenSidebar, secondarySidebar, setOptions]);
}
