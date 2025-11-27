import { ThemeProvider } from "@/lib/theme/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { DialogProvider } from "@/providers/dialog-provider"

interface Props {
    children: React.ReactNode
}

export function AppProvider({ children }: Readonly<Props>) {
    return (
        <AuthProvider>
            {children}
            <DialogProvider />
            <ThemeProvider />
        </AuthProvider>
    )
}
