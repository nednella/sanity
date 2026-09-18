import { createFileRoute } from "@tanstack/react-router";

import { ApplicationProcess } from "@/components/landing/application-process";
import { CallToAction } from "@/components/landing/call-to-action";
import { ExperienceRequirements } from "@/components/landing/experience-requirements";
import { GearRequirements } from "@/components/landing/gear-requirements";
import { Hero } from "@/components/landing/hero";
import { HeaderSpacer } from "@/components/site/header-spacer";

export const Route = createFileRoute("/(old)/requirements")({
  component: RequirementsPage
});

function RequirementsPage() {
  return (
    <>
      <HeaderSpacer />
      <Hero
        title="Clan Requirements"
        description="find out what it takes to join our community"
        className="pt-36 pb-24"
        reduceMotion
      />
      <GearRequirements />
      <ExperienceRequirements />
      <ApplicationProcess />
      <CallToAction />
    </>
  );
}
