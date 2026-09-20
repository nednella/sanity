import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/ui/utils";

const sizes = {
  lg: {
    title: "text-4xl sm:text-5xl",
    description: "text-lg sm:text-xl",
    gap: "mb-8"
  },
  sm: {
    title: "text-2xl",
    description: "text-base",
    gap: "mb-6"
  }
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
};

type HeroProps = {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  overlay?: boolean;
  reducedMotion?: boolean;
  size?: keyof typeof sizes;
  title: ReactNode;
};

export function Hero({
  children,
  className,
  description,
  overlay = false,
  reducedMotion,
  size = "lg",
  title
}: Readonly<HeroProps>) {
  const scale = sizes[size];

  const isStill = useReducedMotion() || reducedMotion;
  const containerVariants = isStill ? undefined : container;
  const itemVariants = isStill ? undefined : item;

  return (
    <section className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 text-center lg:max-w-5xl"
      >
        <motion.h1
          variants={itemVariants}
          className={cn(
            "mb-4 scroll-m-20 font-bold tracking-tight text-balance",
            scale.title,
            overlay && "text-white drop-shadow-md"
          )}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={itemVariants}
            className={cn(
              "text-base-content/60",
              scale.description,
              children && scale.gap,
              overlay && "text-white/90 drop-shadow-md"
            )}
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
