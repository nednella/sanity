type Props = React.ComponentPropsWithoutRef<"div">

export function BackgroundGradient({ children, ...props }: Readonly<Props>) {
    return (
        <div
            className="relative"
            {...props}
        >
            {/* Base gradient with blue/black theme */}
            <div className="from-background via-background absolute inset-0 -z-1 bg-linear-to-b to-cyan-950/50" />
            {/* Blue accent gradients - Sanity colors */}
            <div
                className="absolute inset-0 -z-1
                    bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_70%)]
                    dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_70%)]"
            />
            <div
                className="absolute inset-0 -z-1
                    bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.06),transparent_70%)]
                    dark:bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_70%)]"
            />
            {/* Subtle black accent for depth */}
            <div
                className="absolute inset-0 -z-1
                    bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.02),transparent_80%)]
                    dark:bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.15),transparent_80%)]"
            />
            {children}
        </div>
    )
}
