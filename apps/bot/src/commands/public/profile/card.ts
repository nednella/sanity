import { readFile } from "node:fs/promises";
import { render } from "takumi-js";

import type { MemberDiary, MemberProfile, RankSummary } from "@sanity/api";
import { CIRCLE_FLAG_CDN_URL } from "@sanity/urls";
import { escapeHtml, formatDate, formatNumber, formatTickTime, isCountryCode, teamScale } from "@sanity/utils";

import { config } from "@config";

type NextRank = NonNullable<MemberProfile["progression"]["nextRank"]["points"]>;

// Fixed card size to ensure clarity on the image without needing to expand it
const HEIGHT = 750;
const WIDTH = 1200;

const DIARY_ROW_HEIGHT = 37;
const DIARY_COLUMN_WIDTHS = ["40%", "12%", "14%", "16%", "18%"];

const COLOURS = {
  background: "#0a0a0a",
  border: "#262626",
  faint: "rgba(250, 250, 250, 0.5)",
  muted: "rgba(250, 250, 250, 0.6)",
  progress: "#e5e5e5",
  text: "#fafafa"
};

const STANDINGS = {
  climbing: "Climbing",
  maxed: "Maxed rank",
  manual: "Off the ladder",
  trial: "On trial"
};

const FONTS = [
  {
    name: "Inter",
    data: await readFile(new URL("../../../../assets/fonts/Inter.ttf", import.meta.url))
  }
];

const webIconUrl = (path: string) => `${config.webUrl}/icons/${path}.png`;

const overline = (text: string) =>
  `<span style="font-size:15px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:${COLOURS.faint}">${text}</span>`;

const rankBadge = ({ iconUrl, name }: RankSummary) => `
  <span style="display:flex;align-items:center;gap:10px">
    ${iconUrl ? `<img src="${escapeHtml(iconUrl)}" style="width:22px;height:22px" />` : ""}
    ${escapeHtml(name)}
  </span>`;

const avatar = (avatarUrl: string, nationality: string | null) => {
  const flag =
    nationality && isCountryCode(nationality)
      ? `<img src="${CIRCLE_FLAG_CDN_URL}/${nationality.toLowerCase()}.svg" style="position:absolute;right:-4px;bottom:-4px;width:40px;height:40px;border-radius:20px;border:4px solid ${COLOURS.background}" />`
      : "";

  return `
  <div style="display:flex;position:relative;width:112px;height:112px">
    <img src="${escapeHtml(avatarUrl)}" style="width:112px;height:112px;border-radius:56px" />
    ${flag}
  </div>`;
};

const header = ({ displayName, membership, nationality, rsn }: MemberProfile, avatarUrl: string) => {
  const details = [
    [rsn.main, rsn.alt].filter((name) => name !== null).join(" / "),
    membership.joinedAt && `Joined ${formatDate(membership.joinedAt)}`
  ].filter(Boolean);

  return `
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div style="display:flex;align-items:center;gap:26px">
      ${avatar(avatarUrl, nationality)}
      <div style="display:flex;flex-direction:column;gap:6px">
        <span style="font-size:54px;font-weight:700;letter-spacing:-1px;line-height:1.05">${escapeHtml(displayName)}</span>
        <span style="font-size:22px;color:${COLOURS.muted}">${rankBadge(membership.rank)}</span>
        <span style="font-size:20px;color:${COLOURS.muted}">${escapeHtml(details.join("  ·  "))}</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-size:26px;font-weight:800;letter-spacing:-0.5px">Sanity</span>
      <span style="font-size:12px;font-weight:500;letter-spacing:3px;color:${COLOURS.faint}">THE SANITY WIKI</span>
    </div>
  </div>`;
};

const stat = (iconPath: string | null, label: string, value: string, width = "23.9%") => `
  <div style="display:flex;align-items:center;gap:14px;width:${width};padding:16px;border:1px solid ${COLOURS.border};border-radius:3px">
    ${
      iconPath
        ? `<img src="${webIconUrl(iconPath)}" style="width:28px;height:28px;object-fit:contain" />`
        : `<div style="width:28px;height:28px"></div>`
    }
    <div style="display:flex;flex-direction:column;gap:3px">
      <span style="font-size:16px;color:${COLOURS.muted}">${label}</span>
      <span style="font-size:22px;font-weight:600">${escapeHtml(value)}</span>
    </div>
  </div>`;

const statBar = ({ diary, membership, wom }: MemberProfile) => `
  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;row-gap:12px">
    ${stat("stats/clan-points", "Clan Points", formatNumber(membership.points))}
    ${stat("stats/diary-points", "Diary Points", `${formatNumber(diary.points)} / ${formatNumber(diary.maxPoints)}`)}
    ${stat("diary/master", "Master Diaries", `${formatNumber(diary.masterDiaries)} / ${formatNumber(diary.maxMasterDiaries)}`)}
    ${stat(diary.claimedTier && `diary/${diary.claimedTier.name.toLowerCase()}`, "Claimed Diary Tier", diary.claimedTier?.name ?? "—")}
    ${stat("stats/overall", "Total Level", formatNumber(wom?.totalLevel))}
    ${stat("stats/overall", "Total XP", formatNumber(wom?.totalExp, 0, "compact"))}
    ${stat("stats/ehp", "EHP", formatNumber(wom?.totalEhp, 1))}
    ${stat("stats/ehb", "EHB", formatNumber(wom?.totalEhb, 1))}
  </div>`;

const progressBar = (label: string, value: number, target: number) => `
  <div style="display:flex;flex-direction:column;gap:7px">
    <div style="display:flex;justify-content:space-between;font-size:18px;color:${COLOURS.muted}">
      <span>${label}</span>
      <span>${formatNumber(value)} / ${formatNumber(target)}</span>
    </div>
    <div style="display:flex;height:8px;border-radius:4px;background:${COLOURS.border}">
      <div style="width:${Math.min(100, (value / target) * 100)}%;border-radius:4px;background:${COLOURS.progress}"></div>
    </div>
  </div>`;

// A diary rank is earned with clan points plus either diary target, as on the website.
const nextRankCard = (title: string, nextRank: NextRank, { diary, membership }: MemberProfile) => {
  const { requirements } = nextRank;
  const eitherOr = [
    requirements.diaryPoints > 0 && progressBar("Diary Points", diary.points, requirements.diaryPoints),
    requirements.masterDiaries > 0 && progressBar("Master Diaries", diary.masterDiaries, requirements.masterDiaries)
  ].filter((bar) => bar !== false);

  return `
  <div style="display:flex;flex-direction:column;gap:12px;flex:1">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:17px;color:${COLOURS.muted}">${title}</span>
      <span style="font-size:20px;font-weight:600">${rankBadge(nextRank)}</span>
    </div>
    ${requirements.clanPoints > 0 ? progressBar("Clan Points", membership.points, requirements.clanPoints) : ""}
    ${
      eitherOr.length > 0
        ? `${overline("and")}
          <div style="display:flex;flex-direction:column;gap:12px;padding-left:16px;border-left:1px solid ${COLOURS.border}">
            ${eitherOr.join(overline("or"))}
          </div>`
        : ""
    }
  </div>`;
};

const standing = ({ membership, progression }: MemberProfile) => `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;flex:1">
    <div style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:52px;border:1px solid ${COLOURS.border}">
      ${membership.rank.iconUrl ? `<img src="${escapeHtml(membership.rank.iconUrl)}" style="width:52px;height:52px" />` : ""}
    </div>
    ${overline(STANDINGS[progression.status])}
    <span style="font-size:30px;font-weight:700">${escapeHtml(membership.rank.name)}</span>
  </div>`;

const rankProgression = (profile: MemberProfile) => {
  const { points, diary } = profile.progression.nextRank;
  const cards = [
    points && nextRankCard("Next Rank (Clan Points)", points, profile),
    diary && nextRankCard("Next Rank (Clan Points + Diaries)", diary, profile)
  ].filter((card) => card !== null);

  return `
  <div style="display:flex;flex-direction:column;gap:18px;flex:1;padding:22px 24px;border:1px solid ${COLOURS.border};border-radius:3px">
    ${overline("Rank progression")}
    ${
      cards.length > 0
        ? `<div style="display:flex;gap:28px">${cards.join(`<div style="width:1px;background:${COLOURS.border}"></div>`)}</div>`
        : standing(profile)
    }
  </div>`;
};

const tierBadge = (name: string) => `
  <span style="display:flex;align-items:center;gap:8px">
    <img src="${webIconUrl(`diary/${name.toLowerCase()}`)}" style="width:22px;height:22px;object-fit:contain" />
    ${escapeHtml(name)}
  </span>`;

const diaryHeader = ({ diary, displayName }: MemberProfile, avatarUrl: string) => `
  <div style="display:flex;flex-direction:column;gap:22px;margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:20px">
      <img src="${escapeHtml(avatarUrl)}" style="width:72px;height:72px;border-radius:36px" />
      <div style="display:flex;flex-direction:column;gap:4px">
        <span style="font-size:36px;font-weight:700;letter-spacing:-0.5px">${escapeHtml(displayName)}</span>
        ${overline("Speedrun diary")}
      </div>
    </div>
    <div style="display:flex;justify-content:space-between">
      ${stat("stats/diary-points", "Diary Points", `${formatNumber(diary.points)} / ${formatNumber(diary.maxPoints)}`, "32.6%")}
      ${stat("diary/master", "Master Diaries", `${formatNumber(diary.masterDiaries)} / ${formatNumber(diary.maxMasterDiaries)}`, "32.6%")}
      ${stat(diary.claimedTier && `diary/${diary.claimedTier.name.toLowerCase()}`, "Claimed Diary Tier", diary.claimedTier?.name ?? "—", "32.6%")}
    </div>
  </div>`;

const diaryRow = (cells: string[], colour = COLOURS.text) => `
  <div style="display:flex;align-items:center;height:${DIARY_ROW_HEIGHT}px;border-bottom:1px solid ${COLOURS.border};color:${colour}">
    ${cells.map((cell, index) => `<div style="display:flex;width:${DIARY_COLUMN_WIDTHS[index]}">${cell}</div>`).join("")}
  </div>`;

const diaryEntry = ({ content, nextTier, pb, scale, tier }: MemberDiary) =>
  diaryRow([
    escapeHtml(content.name),
    teamScale(scale),
    formatTickTime(pb?.timeSeconds),
    tier ? tierBadge(tier.name) : "—",
    `<span style="color:${COLOURS.faint}">${nextTier ? `${formatTickTime(nextTier.timeSeconds)} (${escapeHtml(nextTier.name)})` : "—"}</span>`
  ]);

// The avatar comes from Discord at render time, because the one saved with the member can be out of date.
export const renderProfileCard = (profile: MemberProfile, avatarUrl: string) =>
  render(
    `<div style="display:flex;flex-direction:column;gap:24px;width:100%;height:100%;padding:40px 44px;font-family:Inter;color:${COLOURS.text};background:${COLOURS.background}">
      ${header(profile, avatarUrl)}
      ${statBar(profile)}
      ${rankProgression(profile)}
    </div>`,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: FONTS,
      images: { throwOnError: false }
    }
  );

export const renderDiaryCard = (profile: MemberProfile, entries: MemberDiary[], avatarUrl: string) =>
  render(
    `<div style="display:flex;flex-direction:column;width:100%;height:100%;padding:40px 44px;font-family:Inter;font-size:20px;color:${COLOURS.text};background:${COLOURS.background}">
      ${diaryHeader(profile, avatarUrl)}
      ${diaryRow(["Content", "Team", "PB", "Tier", "Next"], COLOURS.faint)}
      ${entries.map((entry) => diaryEntry(entry)).join("")}
    </div>`,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: FONTS,
      images: { throwOnError: false }
    }
  );
