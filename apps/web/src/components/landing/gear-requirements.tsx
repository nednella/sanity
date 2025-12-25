import { Container } from "@/components/layout/container"
import { ItemGrid } from "@/components/layout/item-grid"
import { Section } from "@/components/layout/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

type Item = {
    fileName: string
    alt: string
}

const items: Item[] = [
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
            <Container className="text-center lg:max-w-5xl">
                <H3 className="mb-2">Gear Checklist</H3>
                <Muted className="mb-8 text-lg">
                    we maintain a minimum gear requirement in line with the current best-in-slot items for all active
                    clan members, so you should ensure you meet the following checklist before you consider applying.
                </Muted>
                <ItemGrid cols="grid-cols-3 xs:grid-cols-4 sm:grid-cols-5">
                    {items.map((item, index) => (
                        <GearCard
                            key={`${item.fileName}-${index}`}
                            item={item}
                        />
                    ))}
                </ItemGrid>
            </Container>
        </Section>
    )
}

type GearCardProps = {
    item: Item
}

function GearCard({ item }: Readonly<GearCardProps>) {
    const imagePath = `/requirements/items/${item.fileName}.webp`

    return (
        <div
            className="group flex aspect-square max-w-64 items-center justify-center overflow-hidden rounded-2xl border
                p-3 shadow-md transition-all hover:scale-110 hover:shadow-xl lg:p-6"
        >
            <div className="flex size-full items-center justify-center">
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
            </div>
        </div>
    )
}
