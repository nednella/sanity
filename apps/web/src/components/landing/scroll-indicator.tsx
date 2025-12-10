import { ChevronDown } from "lucide-react"
import { easeInOut, motion } from "motion/react"

export function ScrollIndicator() {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="text-muted-foreground flex flex-col items-center -space-y-2">
                <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: easeInOut }}
                >
                    <ChevronDown className="size-5" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: easeInOut }}
                >
                    <ChevronDown className="size-5" />
                </motion.div>
            </div>
        </div>
    )
}
