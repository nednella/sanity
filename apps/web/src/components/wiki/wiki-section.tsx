import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import type { WikiSection, WikiSubsection } from "@/components/wiki/types";

export function WikiSection({ section }: Readonly<{ section: WikiSection }>) {
  return (
    <section className="mb-10 flow-root">
      <Collapsible
        id={section.id}
        level="h2"
        title={section.title}
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

type CollapsibleProps = {
  children: React.ReactNode;
  id: string;
  level: "h2" | "h3";
  title: string;
};

function Collapsible({ id, title, level: Heading, children }: Readonly<CollapsibleProps>) {
  return (
    <details
      className="group"
      open
    >
      <summary
        className="
          mb-4 flex cursor-pointer list-none items-baseline justify-between gap-3 border-b pb-2
          [&::-webkit-details-marker]:hidden
        "
      >
        <Heading
          className={cn("scroll-mt-20", Heading === "h2" ? "text-2xl font-bold" : "text-lg font-bold")}
          id={id}
        >
          {title}
        </Heading>
        <ChevronDown
          aria-hidden="true"
          className="
            size-4 shrink-0 rotate-180 self-center text-muted-foreground/70 transition-transform
            group-open:rotate-0
          "
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
        level="h3"
        title={title}
      >
        {content}
      </Collapsible>
    </div>
  );
}
