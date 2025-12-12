import { ThemeProvider } from "@/lib/theme/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"

interface Props {
    children: React.ReactNode
}

export function AppProvider({ children }: Readonly<Props>) {
    return (
        <AuthProvider>
            {children}
            <ThemeProvider />
        </AuthProvider>
    )
}
