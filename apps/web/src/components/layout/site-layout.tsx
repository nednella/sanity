import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

type SiteLayoutProps = {
  children: ReactNode;
};

const DRAWER_ID = "site-drawer";

export function SiteLayout({ children }: Readonly<SiteLayoutProps>) {
  return (
    <div className="drawer lg:drawer-open">
      <input
        className="drawer-toggle"
        id={DRAWER_ID}
        type="checkbox"
      />
      <div className="drawer-content flex min-h-screen flex-col">
        <Header drawerId={DRAWER_ID} />
        <main className="flex-1 px-4 lg:px-8">{children}</main>
        <Footer />
      </div>
      <div className="drawer-side z-40">
        <label
          aria-label="Close sidebar"
          className="drawer-overlay"
          htmlFor={DRAWER_ID}
        />
        <Sidebar />
      </div>
    </div>
  );
}
