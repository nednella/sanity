import { Link } from "@tanstack/react-router"

import { Button } from "@/lib/ui/components/button"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Lead } from "@/lib/ui/components/typography/lead"

export function NotFound() {
    // TODO: add logo
    return (
        <section className="bg-background flex min-h-screen items-center justify-center">
            <div className="container mx-auto">
                <div className="text-center">
                    <H1 className="mb-6">Page not found</H1>
                    <Lead className="mb-6 text-xl">we can't seem to find the page you are looking for</Lead>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="w-64 rounded-full px-8 sm:w-fit"
                        >
                            <Link to="/">Go back home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
