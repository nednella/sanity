type Props = React.ComponentPropsWithoutRef<"div">

export function BackgroundGradient({ children, ...props }: Readonly<Props>) {
    return (
        <div
            className="relative"
            {...props}
        >
            <div className="from-background absolute inset-0 z-[-1] bg-linear-to-b to-cyan-500/40" />
            {children}
        </div>
    )
}
