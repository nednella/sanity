import { DiscordLogo } from "@/components/logos/discord-logo"
import { TwitterLogo } from "@/components/logos/twitter-logo"
import { Button } from "@/lib/ui/components/button"
import { Container } from "@/lib/ui/components/container"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Lead } from "@/lib/ui/components/typography/lead"

export function Cta() {
    return (
        <Container className="max-w-3xl pt-24 pb-48 text-center">
            <div className="mx-auto max-w-4xl text-center">
                <div className="bg-background rounded-3xl border p-12">
                    <H3 className="mb-6">Get Involved</H3>
                    <Lead className="mb-6 text-lg">Join our community to connect with members and learn more</Lead>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            variant="custom"
                            className="gap-2 rounded-full bg-[#5865F2] px-8! text-white hover:opacity-90 md:w-fit"
                        >
                            <a
                                href="https://discord.gg/sanity"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <DiscordLogo className="size-4 fill-white" />
                                <span>Join Discord</span>
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="gap-2 rounded-full px-8! transition-none hover:opacity-90 md:w-fit"
                        >
                            <a
                                href="https://twitter.com/sanityosrs"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterLogo className="fill-text-foreground size-4" />
                                <span>Follow on X</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}
