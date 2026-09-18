import { ChevronDown } from "lucide-react";

import type { WikiSection, WikiSubsection } from "@/components/wiki/types.js";
import { cn } from "@/lib/ui/utils.js";

type CollapsibleProps = {
  id: string;
  title: string;
  level: "h2" | "h3";
  children: React.ReactNode;
};

function Collapsible({ id, title, level: Heading, children }: Readonly<CollapsibleProps>) {
  return (
    <details
      open
      className="group"
    >
      <summary className="mb-4 flex cursor-pointer list-none items-baseline justify-between gap-3 border-b border-base-300 pb-2 [&::-webkit-details-marker]:hidden">
        <Heading
          id={id}
          className={cn("scroll-mt-20", Heading === "h2" ? "text-2xl font-bold" : "text-lg font-bold")}
        >
          {title}
        </Heading>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 rotate-180 self-center text-base-content/40 transition-transform group-open:rotate-0"
        />
      </summary>
      {children}
    </details>
  );
}

function WikiSubsection({ id, title, content }: Readonly<WikiSubsection>) {
  return (
    <div className="mt-8 flow-root">
      <Collapsible
        id={id}
        title={title}
        level="h3"
      >
        {content}
      </Collapsible>
    </div>
  );
}

export function WikiSection({ section }: Readonly<{ section: WikiSection }>) {
  return (
    <section className="mb-10 flow-root">
      <Collapsible
        id={section.id}
        title={section.title}
        level="h2"
      >
        {section.content}
        {section.subsections?.map((subsection) => (
          <WikiSubsection
            key={subsection.id}
            {...subsection}
          />
        ))}
      </Collapsible>
    </section>
  );
}
