import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithoutRef<"div"> & { flex?: boolean; center?: boolean }

export function Content({ className, flex = false, center = false, ...props }: Readonly<Props>) {
    return (
        <main
            className={cn("flex-1 overflow-y-auto", flex && "flex", center && "items-center justify-center", className)}
            {...props}
        />
    )
}
