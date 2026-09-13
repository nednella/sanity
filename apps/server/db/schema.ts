import {
  bigint,
  boolean,
  char,
  date,
  doublePrecision,
  index,
  integer,
  interval,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

export const ranks = pgTable("ranks", {
  id: smallint().primaryKey(),
  name: text().notNull(),
  inGameName: text().unique("ranks_in_game_name_unique"),
  discordRoleId: bigint({ mode: "bigint" }).unique("ranks_discord_role_id_unique"),
  clanPointRequirement: integer().notNull().default(0),
  diaryPointRequirement: integer().notNull().default(0),
  masterDiaryRequirement: integer().notNull().default(0),
  maintenancePointRequirement: integer().notNull().default(0)
});

export const members = pgTable(
  "members",
  {
    id: bigint({ mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),
    displayName: text().notNull(),
    mainRsn: text(),
    altRsn: text(),
    rankId: smallint()
      .notNull()
      .references(() => ranks.id),
    clanPoints: integer().notNull().default(0),
    claimedDiaryTierId: smallint().references(() => speedrunDiaryTiers.id),
    isActive: boolean().notNull().default(false),
    joinedAt: timestamp({ withTimezone: true }),
    leftAt: timestamp({ withTimezone: true }),
    birthday: date(),
    nationality: char({ length: 2 }).notNull().default("AQ")
  },
  (table) => [index().on(table.rankId), index().on(table.clanPoints.desc()), index().on(table.displayName)]
);

export const membersDiscordAccounts = pgTable("members_discord_accounts", {
  memberId: bigint({ mode: "bigint" })
    .primaryKey()
    .references(() => members.id, { onDelete: "cascade" }),
  discordId: bigint({ mode: "bigint" }).notNull().unique("members_discord_accounts_discord_id_unique"),
  avatarUrl: text()
});

export const submissionStatus = pgEnum("submission_status", [
  "pending",
  "submitted",
  "approved",
  "approved_missing_member",
  "denied",
  "deleted_by_user"
]);

export const submissionEvent = pgEnum("submission_event", ["bingo", "leagues"]);

export const items = pgTable("items", {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  name: text().notNull().unique("items_name_unique")
});

export const submissions = pgTable(
  "submissions",
  {
    id: integer().generatedByDefaultAsIdentity().primaryKey(),
    memberId: bigint({ mode: "bigint" })
      .notNull()
      .references(() => members.id),
    itemId: integer().references(() => items.id),
    itemName: text(),
    valueMillions: integer(),
    imageUrl: text(),
    discordMessageUrl: text(),
    event: submissionEvent(),
    status: submissionStatus().notNull(),
    submittedAt: timestamp({ withTimezone: true }).notNull(),
    reviewedBy: bigint({ mode: "bigint" }).references(() => members.id),
    reviewedAt: timestamp({ withTimezone: true }),
    reviewNote: text()
  },
  (table) => [
    index().on(table.memberId),
    index().on(table.itemId),
    index().on(table.status),
    index().on(table.submittedAt.desc())
  ]
);

export const submissionParticipants = pgTable(
  "submission_participants",
  {
    submissionId: integer()
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    memberId: bigint({ mode: "bigint" })
      .notNull()
      .references(() => members.id)
  },
  (table) => [primaryKey({ columns: [table.submissionId, table.memberId] }), index().on(table.memberId)]
);

export const points = pgTable(
  "points",
  {
    id: bigint({ mode: "bigint" }).generatedByDefaultAsIdentity().primaryKey(),
    memberId: bigint({ mode: "bigint" })
      .notNull()
      .references(() => members.id),
    submissionId: integer().references(() => submissions.id),
    value: integer().notNull(),
    notes: text(),
    awardedAt: timestamp({ withTimezone: true }).notNull()
  },
  (table) => [index().on(table.memberId, table.awardedAt.desc()), index().on(table.submissionId)]
);

export const pointsTimelineEvents = pgTable("points_timeline_events", {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  name: text().notNull(),
  occurredAt: timestamp({ withTimezone: true }).notNull()
});

export const speedrunContent = pgTable("speedrun_content", {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  name: text().notNull().unique("speedrun_content_name_unique"),
  imageUrl: text()
});

export const speedrunDiaryTiers = pgTable("speedrun_diary_tiers", {
  id: smallint().primaryKey(),
  name: text().notNull().unique("speedrun_diary_tiers_name_unique"),
  points: smallint().notNull()
});

export const speedrunDiaryTimes = pgTable(
  "speedrun_diary_times",
  {
    contentId: integer()
      .notNull()
      .references(() => speedrunContent.id),
    scale: smallint().notNull(),
    tierId: smallint()
      .notNull()
      .references(() => speedrunDiaryTiers.id),
    time: interval().notNull()
  },
  (table) => [primaryKey({ columns: [table.contentId, table.scale, table.tierId] })]
);

export const speedrunDiaryRewards = pgTable("speedrun_diary_rewards", {
  tierId: smallint()
    .primaryKey()
    .references(() => speedrunDiaryTiers.id),
  requiredDiaryPoints: smallint().notNull(),
  clanPoints: integer().notNull()
});

export const personalBests = pgTable(
  "personal_bests",
  {
    id: integer().generatedByDefaultAsIdentity().primaryKey(),
    memberId: bigint({ mode: "bigint" })
      .notNull()
      .references(() => members.id),
    contentId: integer()
      .notNull()
      .references(() => speedrunContent.id),
    scale: smallint().notNull(),
    time: interval().notNull(),
    imageUrl: text(),
    status: submissionStatus().notNull(),
    submittedAt: timestamp({ withTimezone: true }),
    reviewedBy: bigint({ mode: "bigint" }).references(() => members.id),
    reviewedAt: timestamp({ withTimezone: true }),
    reviewNote: text()
  },
  (table) => [index().on(table.memberId), index().on(table.contentId, table.scale, table.time)]
);

export const personalBestParticipants = pgTable(
  "personal_best_participants",
  {
    personalBestId: integer()
      .notNull()
      .references(() => personalBests.id, { onDelete: "cascade" }),
    memberId: bigint({ mode: "bigint" })
      .notNull()
      .references(() => members.id)
  },
  (table) => [primaryKey({ columns: [table.personalBestId, table.memberId] }), index().on(table.memberId)]
);

export const womPlayers = pgTable("wom_players", {
  womPlayerId: integer().primaryKey(),
  memberId: bigint({ mode: "bigint" })
    .notNull()
    .unique("wom_players_member_id_unique")
    .references(() => members.id, { onDelete: "cascade" }),
  username: text().notNull(),
  displayName: text().notNull(),
  type: text().notNull(),
  build: text().notNull(),
  totalExp: bigint({ mode: "number" }).notNull(),
  totalEhp: doublePrecision().notNull(),
  totalEhb: doublePrecision().notNull(),
  registeredAt: timestamp({ withTimezone: true }).notNull(),
  updatedAt: timestamp({ withTimezone: true })
});

export const womSnapshots = pgTable(
  "wom_snapshots",
  {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    womPlayerId: integer()
      .notNull()
      .references(() => womPlayers.womPlayerId, { onDelete: "cascade" }),
    totalExp: bigint({ mode: "number" }).notNull(),
    totalEhp: doublePrecision(),
    totalEhb: doublePrecision(),
    createdAt: timestamp({ withTimezone: true }).notNull()
  },
  (table) => [unique("wom_snapshots_wom_player_id_created_at_unique").on(table.womPlayerId, table.createdAt)]
);

export const womSnapshotSkills = pgTable(
  "wom_snapshot_skills",
  {
    womSnapshotId: integer()
      .notNull()
      .references(() => womSnapshots.id, { onDelete: "cascade" }),
    skill: text().notNull(),
    experience: bigint({ mode: "number" }).notNull(),
    level: smallint().notNull(),
    rank: integer(),
    ehp: doublePrecision().notNull()
  },
  (table) => [primaryKey({ columns: [table.womSnapshotId, table.skill] })]
);

export const womSnapshotBosses = pgTable(
  "wom_snapshot_bosses",
  {
    womSnapshotId: integer()
      .notNull()
      .references(() => womSnapshots.id, { onDelete: "cascade" }),
    boss: text().notNull(),
    kills: integer().notNull(),
    rank: integer(),
    ehb: doublePrecision().notNull()
  },
  (table) => [primaryKey({ columns: [table.womSnapshotId, table.boss] })]
);

export const womSnapshotActivities = pgTable(
  "wom_snapshot_activities",
  {
    womSnapshotId: integer()
      .notNull()
      .references(() => womSnapshots.id, { onDelete: "cascade" }),
    activity: text().notNull(),
    score: integer().notNull(),
    rank: integer()
  },
  (table) => [primaryKey({ columns: [table.womSnapshotId, table.activity] })]
);
