import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const FILE = resolve("data/events.csv");
const HEADER = "id,time,name,path,slug,section,q,to,from,seconds,locale,host";
const ALLOWED = new Set([
  "page_view",
  "article_open",
  "article_section",
  "search",
  "locale",
  "theme",
  "mark_read",
  "essay_next",
  "essay_prev",
  "essay_dwell",
]);

function csvCell(value) {
  if (value == null || value === "") return "";
  const text = String(value).replace(/\r?\n/g, " ").slice(0, 200);
  if (/[",]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function row(event) {
  return [
    event.id,
    event.t ? new Date(event.t).toISOString() : "",
    event.name,
    event.path,
    event.slug,
    event.section,
    event.q,
    event.to,
    event.from,
    event.seconds,
    event.locale,
    event.host,
  ]
    .map(csvCell)
    .join(",");
}

function parsePayload(raw) {
  if (!raw || raw === "null") return [];
  const data = JSON.parse(raw);
  const list = Array.isArray(data) ? data : data.events;
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && typeof item.id === "string" && ALLOWED.has(item.name))
    .slice(0, 40);
}

const incoming = parsePayload(process.env.EVENTS_JSON);
mkdirSync(dirname(FILE), { recursive: true });
let current = "";
try {
  current = readFileSync(FILE, "utf8");
} catch {
  current = `${HEADER}\n`;
}
if (!current.startsWith(HEADER)) current = `${HEADER}\n${current}`;
const seen = new Set(
  current
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(",")[0])
    .filter(Boolean),
);
const extra = [];
for (const event of incoming) {
  if (seen.has(event.id)) continue;
  seen.add(event.id);
  extra.push(row(event));
}
if (!extra.length) {
  console.log("no new rows");
  process.exit(0);
}
const body = current.endsWith("\n") ? current : `${current}\n`;
writeFileSync(FILE, `${body}${extra.join("\n")}\n`);
console.log(`appended ${extra.length}`);
