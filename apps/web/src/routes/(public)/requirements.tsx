import { createFileRoute } from "@tanstack/react-router";

import { ApplicationProcess } from "@/components/landing/application-process.js";
import { CallToAction } from "@/components/landing/call-to-action.js";
import { ExperienceRequirements } from "@/components/landing/experience-requirements.js";
import { GearRequirements } from "@/components/landing/gear-requirements.js";
import { Hero } from "@/components/landing/hero.js";
import { NavbarSpacer } from "@/components/navigation/navbar-spacer.js";

export const Route = createFileRoute("/(public)/requirements")({
  component: RequirementsPage
});

function RequirementsPage() {
  return (
    <>
      <NavbarSpacer />
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
