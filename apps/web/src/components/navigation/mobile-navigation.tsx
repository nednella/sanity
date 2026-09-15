import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { navigationSections } from "./navigation.config.js";

export function MobileNavigation() {
  return (
    <div className="dropdown dropdown-end lg:hidden">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-square btn-ghost"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-10 mt-2 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        {navigationSections.map((section) => (
          <li key={section.label}>
            <h2 className="menu-title">{section.label}</h2>
            <ul>
              {section.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
