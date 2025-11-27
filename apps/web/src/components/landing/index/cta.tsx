import { MessageCircle } from "lucide-react"

import { Button } from "@/lib/ui/components/button"
import { Container } from "@/lib/ui/components/container"

export function Cta() {
    return (
        <Container className="max-w-3xl pt-24 pb-48 text-center">
            <div className="mx-auto max-w-4xl text-center transition-all duration-1000">
                <div className="bg-accent/50 border-border rounded-3xl border p-12">
                    <h2 className="text-foreground mb-6 text-3xl md:text-5xl">Get Started</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Join our Discord community to connect with members and learn more
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a
                            href="https://discord.gg/sanity"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                size="lg"
                                className="w-full gap-2 px-8 md:w-fit"
                            >
                                <MessageCircle className="size-4" />
                                Join Discord
                            </Button>
                        </a>
                        <a
                            href="https://twitter.com/sanityosrs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full gap-2 px-8 md:w-fit"
                            >
                                <svg
                                    className="size-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Follow on X
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    )
}
