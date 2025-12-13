import { motion } from "motion/react"

import { Container } from "@/components/layout/container"
import { ItemGrid } from "@/components/layout/item-grid"
import { Section } from "@/components/layout/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
}

const imageVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1 }
    }
}

const MContainer = motion.create(Container)
const MH3 = motion.create(H3)
const MMuted = motion.create(Muted)

type Item = {
    fileName: string
    alt: string
}

const itemRequirements: Item[] = [
    {
        fileName: "torva_set",
        alt: "Torva Armour Set"
    },
    {
        fileName: "masori_set",
        alt: "Masori Armour Set"
    },
    {
        fileName: "ancestral_set",
        alt: "Ancestral Robe Set"
    },
    {
        fileName: "oathplate_set",
        alt: "Oathplate Armour Set"
    },
    {
        fileName: "elite_void_set",
        alt: "Elite Void Range Set"
    },
    {
        fileName: "scythe_of_vitur",
        alt: "Scythe of Vitur"
    },
    {
        fileName: "twisted_bow",
        alt: "Twisted Bow"
    },
    {
        fileName: "tumekens_shadow",
        alt: "Tumeken's Shadow"
    },
    {
        fileName: "glove_set",
        alt: "Ferocious Gloves, Confliction Gauntlets & Zaryte Vambraces"
    },
    {
        fileName: "avernic_treads",
        alt: "Avernic Treads (Max)"
    },
    {
        fileName: "infernal_cape",
        alt: "Infernal Cape"
    },
    {
        fileName: "quiver",
        alt: "Dizana's Quiver"
    },
    {
        fileName: "mage_arena_cape",
        alt: "Imbued God Cape"
    },
    {
        fileName: "amulet_set",
        alt: "Amulet of Rancour, Occult Necklace & Necklace of Anguish"
    },
    {
        fileName: "misc_strength_gear",
        alt: "Ultor Ring & Avernic Defender"
    },
    {
        fileName: "defence_reducing_gear",
        alt: "Elder Maul & Bandos Godsword"
    },
    {
        fileName: "zaryte_crossbow",
        alt: "Zaryte Crossbow"
    },

    {
        fileName: "eye_of_ayak",
        alt: "Eye of Ayak"
    },
    {
        fileName: "dragon_claws",
        alt: "Dragon Claws"
    },
    {
        fileName: "voidwaker",
        alt: "Voidwaker"
    },
    {
        fileName: "rigour",
        alt: "Rigour Prayer"
    },
    {
        fileName: "augury",
        alt: "Augury Prayer"
    },
    {
        fileName: "rite_of_vile_transference",
        alt: "Rite of Vile Transference Spell"
    }
]

export function GearRequirements() {
    return (
        <Section className="pb-24">
            <MContainer
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center lg:max-w-5xl"
            >
                <MH3
                    variants={itemVariants}
                    className="mb-2"
                >
                    Gear Checklist
                </MH3>
                <MMuted
                    variants={itemVariants}
                    className="mb-8 text-lg"
                >
                    we maintain a minimum gear requirement in line with the current best-in-slot items for all active
                    clan members, so you should ensure you meet the following checklist before you consider applying.
                </MMuted>
                <ItemGrid cols="grid-cols-3 xs:grid-cols-4 sm:grid-cols-5">
                    {itemRequirements.map((item, index) => (
                        <GearCard
                            key={`${item.fileName}-${index}`}
                            item={item}
                        />
                    ))}
                </ItemGrid>
            </MContainer>
        </Section>
    )
}

type GearCardProps = {
    item: Item
}

function GearCard({ item }: Readonly<GearCardProps>) {
    const imagePath = `/requirements/items/${item.fileName}.webp`

    return (
        <motion.div
            variants={itemVariants}
            className="group flex aspect-square max-w-64 items-center justify-center overflow-hidden rounded-2xl border
                p-3 shadow-md transition-all hover:scale-110 hover:shadow-xl lg:p-6"
        >
            <motion.div
                variants={imageVariants}
                className="flex size-full items-center justify-center"
            >
                <img
                    src={imagePath}
                    alt={item.alt}
                    className="size-full object-contain transition-transform select-none group-hover:scale-115"
                    onError={(event) => {
                        const target = event.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = document.createElement("div")
                        fallback.className = "text-muted-foreground text-xs text-center"
                        fallback.textContent = item.alt
                        target.parentElement?.append(fallback)
                    }}
                />
            </motion.div>
        </motion.div>
    )
}
