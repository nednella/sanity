import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { DiscordLogo } from "@/components/logos/discord-logo"
import { TwitterLogo } from "@/components/logos/twitter-logo"
import { Button } from "@/lib/ui/components/button"
import { Card } from "@/lib/ui/components/card"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

export function CallToAction() {
    return (
        <Section className="pb-48">
            <Container className="text-center lg:max-w-4xl">
                <Card className="hover:border-foreground/20 p-12 transition-all hover:shadow-md">
                    <H3 className="mb-2">Get Involved</H3>
                    <Muted className="mb-8 text-lg">join our community, connect with members and learn more</Muted>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            variant="custom"
                            className="group rounded-full bg-[#5865F2] px-8! text-white hover:opacity-90"
                        >
                            <a
                                href="https://discord.gg/sanity"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <DiscordLogo className="mr-2 size-4 fill-white" />
                                <span>Join our Discord</span>
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="group rounded-full px-8! transition-none"
                        >
                            <a
                                href="https://twitter.com/sanityosrs"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterLogo className="fill-foreground mr-2 size-4" />
                                <span>Follow us on X</span>
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </Card>
            </Container>
        </Section>
    )
}
