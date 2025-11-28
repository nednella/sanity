import { easeInOut, motion } from "motion/react"

export function ScrollIndicator() {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="text-muted-foreground flex flex-col items-center gap-2">
                <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 p-1">
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: easeInOut }}
                        className="bg-muted-foreground h-2 w-1 rounded-full"
                    />
                </div>
            </div>
        </div>
    )
}
