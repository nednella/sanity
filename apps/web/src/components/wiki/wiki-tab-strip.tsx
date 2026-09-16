import { Link, useLocation } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { articleFromSlug, defaultArticleSlug } from "@/lib/navigation/article.js";

const tab = "-mb-px border border-b-0 px-4 py-2 text-sm";

const activeProps = {
  className: "border-base-300 bg-base-100 font-semibold"
};

const inactiveProps = {
  className: "border-transparent text-base-content/60 hover:text-base-content"
};

const slugFromPathname = (pathname: string) => {
  const slug = pathname.split("/", 3).at(-1) ?? "";
  if (articleFromSlug(slug)) return slug;
  return defaultArticleSlug;
};

export function WikiTabStrip() {
  const { pathname } = useLocation();
  const slug = slugFromPathname(pathname);
  const article = articleFromSlug(slug);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-base-300">
      <div
        role="tablist"
        className="flex"
      >
        <Link
          to={article}
          role="tab"
          className={tab}
          activeProps={activeProps}
          inactiveProps={inactiveProps}
          activeOptions={{ exact: true }}
        >
          Article
        </Link>
        <Link
          to="/wiki/$article/discussion"
          params={{ article: slug }}
          role="tab"
          className={tab}
          activeProps={activeProps}
          inactiveProps={inactiveProps}
        >
          Discussion
        </Link>
      </div>

      <label className="input -mb-px h-9 rounded-b-none border-base-300">
        <Search className="size-3.5 opacity-50" />
        <input
          type="search"
          placeholder="Search the Sanity wiki"
          aria-label="Search the Sanity wiki"
        />
      </label>
    </div>
  );
}
