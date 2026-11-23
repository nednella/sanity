import { type ReactNode, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SiteLayoutContext, type SiteLayoutOptions } from "@/lib/layout/use-site-layout";
import { SidebarInset, SidebarProvider } from "@/lib/ui/sidebar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: Readonly<SiteLayoutProps>) {
  const [options, setOptions] = useState<SiteLayoutOptions>({});

  return (
    <SiteLayoutContext.Provider value={setOptions}>
      <SidebarProvider open={!options.hiddenSidebar}>
        <Sidebar />
        <SidebarInset className="min-h-dvh">
          <Header />
          <div
            className="
              flex-1 px-4
              lg:px-8
            "
          >
            {children}
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </SiteLayoutContext.Provider>
  );
}
