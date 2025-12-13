import { createFileRoute } from "@tanstack/react-router"

import { ApplicationProcess } from "@/components/landing/application-process"
import { CallToAction } from "@/components/landing/call-to-action"
import { ExperienceRequirements } from "@/components/landing/experience-requirements"
import { GearRequirements } from "@/components/landing/gear-requirements"
import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"

export const Route = createFileRoute("/(app)/(public)/requirements")({
    component: RequirementsPage
})

function RequirementsPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Clan Requirements"
                description="find out what it takes to join us."
                className="pt-36 pb-24"
            />
            <GearRequirements />
            <ExperienceRequirements />
            <ApplicationProcess />
            <CallToAction />
        </>
    )
}
