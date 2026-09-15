import { Link } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/theme/theme-toggle.js";

import { DesktopNavigation } from "./desktop-navigation.js";
import { MobileNavigation } from "./mobile-navigation.js";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 lg:px-4 lg:pt-4">
      <div className="navbar mx-auto max-w-7xl border-b border-base-300 bg-base-100 px-4 shadow-md lg:rounded-2xl lg:border">
        <div className="navbar-start">
          <Link
            to="/"
            className="text-lg font-bold"
          >
            Sanity
          </Link>
        </div>
        <div className="navbar-center">
          <DesktopNavigation />
        </div>
        <div className="navbar-end gap-1">
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
