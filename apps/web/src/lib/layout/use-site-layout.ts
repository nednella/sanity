import { createContext, useContext, useEffect } from "react";

export type SiteLayoutOptions = {
  hiddenSidebar?: boolean;
};

export const SiteLayoutContext = createContext<((options: SiteLayoutOptions) => void) | null>(null);

export function useSiteLayout({ hiddenSidebar }: SiteLayoutOptions) {
  const setOptions = useContext(SiteLayoutContext);
  if (!setOptions) throw new Error("useSiteLayout must be used inside a SiteLayout");

  useEffect(() => {
    setOptions({ hiddenSidebar });
    return () => setOptions({});
  }, [hiddenSidebar, setOptions]);
}
