import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/lib/ui/sidebar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: Readonly<SiteLayoutProps>) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-h-screen">
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
  );
}
