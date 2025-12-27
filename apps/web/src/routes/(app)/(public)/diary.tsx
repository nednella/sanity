import { createFileRoute } from "@tanstack/react-router"

import { CallToAction } from "@/components/landing/call-to-action"
import { Hero } from "@/components/landing/hero"
import { TextWithImage } from "@/components/landing/text-with-image"
import { Container } from "@/components/layout/container"
import { ItemGrid } from "@/components/layout/item-grid"
import { Section } from "@/components/layout/section"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/ui/components/table"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Large } from "@/lib/ui/components/typography/large"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/diary")({
    component: AchievementDiaryPage
})

type Reward = {
    tier: "Easy" | "Medium" | "Hard" | "Elite" | "Master"
    tierPoints: number
    tierCompletion: number
    clanPoints: number
}

const rewards: Reward[] = [
    {
        tier: "Easy",
        tierPoints: 1,
        tierCompletion: 18,
        clanPoints: 50
    },
    {
        tier: "Medium",
        tierPoints: 2,
        tierCompletion: 45,
        clanPoints: 150
    },
    {
        tier: "Hard",
        tierPoints: 3,
        tierCompletion: 90,
        clanPoints: 250
    },
    {
        tier: "Elite",
        tierPoints: 4,
        tierCompletion: 135,
        clanPoints: 500
    },
    {
        tier: "Master",
        tierPoints: 5,
        tierCompletion: 180,
        clanPoints: 1000
    }
]

type Diary = {
    title: string
    easy: string
    medium: string
    hard: string
    elite: string
    master: string
}

const diary: Diary[] = [
    {
        title: "Chambers of Xeric (Challenge Mode) - 1 man",
        easy: "30:00",
        medium: "28:30",
        hard: "27:00",
        elite: "26:00",
        master: "24:30"
    },
    {
        title: "Chambers of Xeric (Challenge Mode) - 3 man",
        easy: "23:00",
        medium: "21:30",
        hard: "20:00",
        elite: "19:00",
        master: "18:00"
    },
    {
        title: "Chambers of Xeric (Challenge Mode) - 5 man",
        easy: "22:00",
        medium: "20:00",
        hard: "18:30",
        elite: "17:45",
        master: "16:45"
    },
    {
        title: "Corrupted Gauntlet - 1 man",
        easy: "8:00",
        medium: "7:15",
        hard: "6:15",
        elite: "5:30",
        master: "5:00"
    },
    {
        title: "Fortis Colosseum - 1 man",
        easy: "20:00",
        medium: "19:00",
        hard: "18:00",
        elite: "17:00",
        master: "16:00"
    },
    {
        title: "Theatre of Blood - 2 man",
        easy: "25:00",
        medium: "23:00",
        hard: "21:30",
        elite: "20:45",
        master: "19:45"
    },
    {
        title: "Theatre of Blood - 3 man",
        easy: "18:00",
        medium: "16:30",
        hard: "15:30",
        elite: "15:00",
        master: "14:15"
    },
    {
        title: "Theatre of Blood - 4 man",
        easy: "16:15",
        medium: "15:00",
        hard: "14:00",
        elite: "13:00",
        master: "12:45"
    },
    {
        title: "Theatre of Blood - 5 man",
        easy: "13:15",
        medium: "13:00",
        hard: "12:45",
        elite: "12:30",
        master: "12:00"
    },
    {
        title: "Tombs of Amascut (Expert) - 1 man",
        easy: "22:30",
        medium: "21:00",
        hard: "20:00",
        elite: "19:00",
        master: "17:30"
    },
    {
        title: "TzKal-Zuk - 1 man",
        easy: "52:00",
        medium: "50:00",
        hard: "47:00",
        elite: "45:00",
        master: "42:00"
    },
    {
        title: "TzTok-Jad - 1 man",
        easy: "24:00",
        medium: "22:30",
        hard: "21:15",
        elite: "20:15",
        master: "19:15"
    }
]

function AchievementDiaryPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Achievement Diary"
                description="for those looking to push themselves beyond the in-game Grandmaster achievements"
                className="pt-36 pb-24"
                reduceMotion
            />

            {/* about */}
            <Section className="pb-24">
                <Container>
                    <TextWithImage
                        title="About the Achievement Diary"
                        imageSrc=""
                        imageAlt=""
                    >
                        <P>
                            The Sanity Achievement Diary simply exists as a means to provide players with some
                            benchmarks to push their skills and game knowledge well beyond what the in-game{" "}
                            <a
                                href="https://oldschool.runescape.wiki/w/Combat_Achievements/Grandmaster"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Grandmaster Combat Achievements
                            </a>{" "}
                            require.
                        </P>
                        <P>
                            With our diary — unlike the in-game variant — we focus only on completion time of
                            hand-selected PvM content, and we regularly update our benchmarks in line with power creep.
                        </P>
                        <P>
                            We use the diary internally as a competitive challenge for our members, but this doesn't
                            mean you have to be a member to benefit. Feel free to use our proposed times as a means to
                            benchmark yourself!
                        </P>
                    </TextWithImage>
                </Container>
            </Section>

            {/* guidelines & rewards */}
            <Section className="pb-24">
                <Container>
                    <H3>Guidelines & Rewards</H3>
                    <Muted className="mt-2">This section only applies to active Sanity members</Muted>
                    <ItemGrid
                        cols="lg:grid-cols-2"
                        className="mt-6"
                    >
                        <div>
                            <Large>Guidelines</Large>
                            <P>
                                Team-based tasks <strong>must</strong> be completed with Sanity members{" "}
                                <strong>only</strong>, and any PBs acquired before joining the clan will{" "}
                                <strong>not</strong> count (this excludes solo tasks).
                            </P>
                            <P>
                                You must have a screenshot of the PB for it to be acknowledged — either the board itself
                                or the POH log. Chat commands such as{" "}
                                <code className="bg-foreground text-background rounded px-1 py-0.5">!pb</code> are
                                explicitly ignored.
                            </P>
                            {/* TODO: example submission screenshot */}
                            <P>
                                PB submission screenshots <strong>must</strong> display your boss KC, all participating
                                members, and obviously the completion time itself.
                            </P>
                            <P>
                                If any Sanity members that formed the team for a previous PB leave the clan, that PB{" "}
                                <strong>will</strong> remain valid.
                            </P>
                            <P>
                                Trial members <strong>cannot</strong> claim clan points for diary tier completion until
                                they become a full member.
                            </P>
                        </div>
                        <div>
                            <Large>Rewards</Large>
                            <Table className="mt-6">
                                <TableCaption></TableCaption>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-center">Tier</TableHead>
                                        <TableHead className="text-center">Task Points</TableHead>
                                        <TableHead className="text-center">Tier Completion</TableHead>
                                        <TableHead className="text-center">Clan Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-center">
                                    {rewards.map((item) => (
                                        <TableRow key={item.tier}>
                                            <TableCell>{item.tier}</TableCell>
                                            <TableCell>{item.tierPoints}</TableCell>
                                            <TableCell>{item.tierCompletion}</TableCell>
                                            <TableCell>{item.clanPoints}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ItemGrid>
                </Container>
            </Section>

            {/* diary */}
            <Section className="pb-24">
                <Container>
                    <H3>Achievement Diary</H3>
                    <Table className="mt-6">
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Content</TableHead>
                                <TableHead>Easy</TableHead>
                                <TableHead>Medium</TableHead>
                                <TableHead>Hard</TableHead>
                                <TableHead>Elite</TableHead>
                                <TableHead>Master</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {diary.map((item) => (
                                <TableRow key={item.title}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.easy}</TableCell>
                                    <TableCell>{item.medium}</TableCell>
                                    <TableCell>{item.hard}</TableCell>
                                    <TableCell>{item.elite}</TableCell>
                                    <TableCell>{item.master}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Section>

            <CallToAction />
        </>
    )
}
