import { useThemeStore } from "@/lib/theme/theme.store"
import { resolveTheme } from "@/lib/theme/utils"
import { cn } from "@/lib/ui/utils"

export function BackgroundContent() {
    const { theme } = useThemeStore()

    return (
        <div className={cn("absolute inset-0")}>
            <div className="absolute -z-1 size-full bg-black/10" />
            <video
                src="/bg/Fishinglofi.webm"
                className={cn(
                    "absolute -z-2 size-full object-cover transition-opacity duration-1000",
                    resolveTheme(theme) === "dark" && "opacity-0"
                )}
                autoPlay
                muted
                loop
                playsInline
            />
            <video
                src="/bg/Fishinglofi2.webm"
                className={cn(
                    "absolute -z-2 size-full object-cover transition-opacity duration-1000",
                    resolveTheme(theme) === "light" && "opacity-0"
                )}
                autoPlay
                muted
                loop
                playsInline
            />
        </div>
    )
}
