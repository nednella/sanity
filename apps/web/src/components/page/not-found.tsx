import { Link } from "@tanstack/react-router"

import { Hero } from "@/components/layout/hero"
import { Button } from "@/lib/ui/components/button"

export function NotFound() {
    // TODO: add logo
    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden">
            <Hero
                title="Page not found"
                description="we can't seem to find the page you are looking for."
            >
                <Button
                    asChild
                    size="lg"
                    className="w-64 rounded-full px-8 sm:w-fit"
                >
                    <Link to="/">Go back home</Link>
                </Button>
            </Hero>
        </div>
    )
}
