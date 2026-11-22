import { cn } from "cn";
import { type Variants, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

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
  const isStill = useReducedMotion() || reducedMotion;
  const containerVariants = isStill ? undefined : container;
  const itemVariants = isStill ? undefined : item;

  return (
    <section className={className}>
      <motion.div
        animate="visible"
        className="
          container mx-auto px-4 text-center
          lg:max-w-5xl
        "
        initial="hidden"
        variants={containerVariants}
      >
        <HeroTitle
          overlay={overlay}
          size={size}
          variants={itemVariants}
        >
          {title}
        </HeroTitle>

        {description && (
          <HeroDescription
            hasActions={Boolean(children)}
            overlay={overlay}
            size={size}
            variants={itemVariants}
          >
            {description}
          </HeroDescription>
        )}

        {children && <HeroActions variants={itemVariants}>{children}</HeroActions>}
      </motion.div>
    </section>
  );
}

type HeroTitleProps = {
  children: ReactNode;
  overlay: boolean;
  size: keyof typeof sizes;
  variants: Variants | undefined;
};

function HeroTitle({ children, overlay, size, variants }: Readonly<HeroTitleProps>) {
  return (
    <motion.h1
      className={cn(
        "mb-4 scroll-m-20 font-bold tracking-tight text-balance",
        sizes[size].title,
        overlay && "text-white drop-shadow-md"
      )}
      variants={variants}
    >
      {children}
    </motion.h1>
  );
}

type HeroDescriptionProps = {
  children: ReactNode;
  hasActions: boolean;
  overlay: boolean;
  size: keyof typeof sizes;
  variants: Variants | undefined;
};

function HeroDescription({ children, hasActions, overlay, size, variants }: Readonly<HeroDescriptionProps>) {
  const scale = sizes[size];

  return (
    <motion.p
      className={cn(
        "text-muted-foreground",
        scale.description,
        hasActions && scale.gap,
        overlay && "text-white/90 drop-shadow-md"
      )}
      variants={variants}
    >
      {children}
    </motion.p>
  );
}

type HeroActionsProps = {
  children: ReactNode;
  variants: Variants | undefined;
};

function HeroActions({ children, variants }: Readonly<HeroActionsProps>) {
  return (
    <motion.div
      className="
        flex flex-col items-center justify-center gap-4
        sm:flex-row
      "
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
