import { createFileRoute } from "@tanstack/react-router";

import { FloatingActions } from "@/components/landing/floating-actions";
import { LandingContent } from "@/components/landing/landing-content";
import { LandingHero } from "@/components/landing/landing-hero";

export const Route = createFileRoute("/")({
  component: Page
});

function Page() {
  return (
    <>
      <LandingContent />
      <FloatingActions />
      <LandingHero />
    </>
  );
}
