import { ThemeProvider } from "@/lib/theme/theme-provider"
import { SanityClerkProvider } from "@/providers/clerk-provider"

interface Props {
    children: React.ReactNode
}

export function AppProvider({ children }: Readonly<Props>) {
    return (
        <SanityClerkProvider>
            {children}
            <ThemeProvider />
        </SanityClerkProvider>
    )
}
