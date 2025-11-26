import { MessageCircle } from "lucide-react"

import { Button } from "@/lib/ui/components/button"
import { Container } from "@/lib/ui/components/container"

export function Cta() {
    return (
        <Container className="max-w-3xl py-32 text-center">
            <div className="relative">
                <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-12 backdrop-blur-sm">
                    <h2 className="mb-6 text-slate-200">Ready to Join?</h2>
                    <p className="mb-8 text-lg text-slate-400">
                        Connect with our community on Discord and Twitter. Stay updated with events, competitions, and
                        clan announcements.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a
                            href="https://discord.gg/sanity"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                size="lg"
                                className="bg-[#5865F2] px-8 text-white hover:bg-[#4752C4]"
                            >
                                <MessageCircle className="mr-2 size-5" />
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
                                className="border-slate-700 px-8 text-slate-300 hover:bg-slate-800"
                            >
                                <svg
                                    className="mr-2 size-5"
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
