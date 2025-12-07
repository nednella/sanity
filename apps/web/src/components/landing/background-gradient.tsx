type Props = React.ComponentPropsWithoutRef<"div">

export function BackgroundGradient({ children, ...props }: Readonly<Props>) {
    return (
        <div
            className="relative"
            {...props}
        >
            {/* Subtle gradient overlay */}
            <div className="from-background via-background to-muted/10 absolute inset-0 z-[-1] bg-gradient-to-b" />
            {/* Decorative gradient accents */}
            <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.08),transparent_100%)]" />
            <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.08),transparent_100%)]" />
            {children}
        </div>
    )
}
