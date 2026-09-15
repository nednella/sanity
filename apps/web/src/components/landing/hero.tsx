import { motion } from "motion/react";

import { Container } from "@/components/layout/container.js";
import { Section } from "@/components/layout/section.js";
import { H1 } from "@/lib/ui/typography/h1.js";
import { Lead } from "@/lib/ui/typography/lead.js";
import { cn } from "@/lib/ui/utils.js";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
};

const MContainer = motion.create(Container);
const MH1 = motion.create(H1);
const MLead = motion.create(Lead);

type HeroProps = {
  title: string;
  description: string;
  className?: string;
  reduceMotion?: boolean;
  isOverMedia?: boolean;
  children?: React.ReactNode;
};

export function Hero({
  title,
  description,
  className,
  reduceMotion = false,
  isOverMedia = false,
  children
}: Readonly<HeroProps>) {
  return (
    <Section className={className}>
      <MContainer
        variants={reduceMotion ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center lg:max-w-5xl"
      >
        <MH1
          variants={reduceMotion ? undefined : itemVariants}
          className={cn("mb-4", isOverMedia && "text-white drop-shadow-md")}
        >
          {title}
        </MH1>
        <MLead
          variants={reduceMotion ? undefined : itemVariants}
          className={cn("text-2xl", children && "mb-12", isOverMedia && "text-white/90 drop-shadow-md")}
        >
          {description}
        </MLead>
        <motion.div
          variants={reduceMotion ? undefined : itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {children}
        </motion.div>
      </MContainer>
    </Section>
  );
}
