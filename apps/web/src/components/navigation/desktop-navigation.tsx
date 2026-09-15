import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

import { navigationSections } from "./navigation.config.js";

export function DesktopNavigation() {
  return (
    <nav className="hidden gap-1 lg:flex">
      {navigationSections.map((section) => (
        <div
          key={section.label}
          className="dropdown dropdown-center dropdown-hover"
        >
          <div
            tabIndex={0}
            role="button"
            className="btn gap-1 btn-ghost"
          >
            {section.label}
            <ChevronDown className="size-4" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-10 w-72 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
          >
            {section.links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex flex-col items-start gap-0"
                >
                  <span className="font-medium">{link.title}</span>
                  <span className="text-sm text-base-content/60">{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
