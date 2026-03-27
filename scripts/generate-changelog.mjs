#!/usr/bin/env node

import { execSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const CHANGELOG_PATH = resolve(process.cwd(), "CHANGELOG.md")
const PACKAGE_JSON_PATH = resolve(process.cwd(), "package.json")
const COMMIT_PATTERN = /^:([a-z0-9_+\-]+):\s+(.+)$/i
const TASK_PATTERN = /^(?:#?\d+|[A-Za-z]+-\d+)$/

const SECTION_ORDER = ["Added", "Changed", "Fixed", "Security", "Miscellaneous"]

const GITMOJI_TO_SECTION = {
  sparkles: "Added",
  alien: "Changed",
  children_crossing: "Changed",
  "children-crossing": "Changed",
  wrench: "Changed",
  lipstick: "Changed",
  recycle: "Changed",
  art: "Changed",
  globe_with_meridians: "Changed",
  page_facing_up: "Changed",
  bug: "Fixed",
  ambulance: "Fixed",
  lock: "Security",
  closed_lock_with_key: "Security",
}

const GITMOJI_TO_EMOJI = {
  sparkles: "✨",
  alien: "👽",
  children_crossing: "🚸",
  "children-crossing": "🚸",
  wrench: "🔧",
  lipstick: "💄",
  recycle: "♻️",
  art: "🎨",
  globe_with_meridians: "🌐",
  page_facing_up: "📄",
  bug: "🐛",
  ambulance: "🚑",
  lock: "🔒",
  closed_lock_with_key: "🔐",
  triangular_flag_on_post: "🚩",
  safety_vest: "🦺",
  bookmark: "🔖",
}

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag)
  if (index === -1) return null
  const value = process.argv[index + 1]
  if (!value || value.startsWith("--")) return null
  return value
}

const getLastTag = () => {
  try {
    return execSync("git describe --tags --abbrev=0", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return null
  }
}

const getVersion = () => {
  const cliVersion = getArgValue("--version")
  if (cliVersion) return cliVersion

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf8"))
  return packageJson.version
}

const pad = (value) => String(value).padStart(2, "0")

const getReleaseDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const getLogLines = (range) => {
  const command = range
    ? `git log ${range} --pretty=format:%h%x09%s`
    : "git log --pretty=format:%h%x09%s"

  const output = execSync(command, { encoding: "utf8" }).trim()
  return output ? output.split("\n").filter(Boolean) : []
}

const parseCommitLine = (line) => {
  const [hash, subject = ""] = line.split("\t")
  const match = subject.match(COMMIT_PATTERN)
  if (!match) return null

  const gitmoji = match[1]
  const rest = match[2].trim()
  const parts = rest.split(/\s+/)
  const hasTaskToken = parts.length > 1 && TASK_PATTERN.test(parts[0])
  const task = hasTaskToken ? parts[0] : null
  const message = hasTaskToken ? parts.slice(1).join(" ") : rest
  const section = GITMOJI_TO_SECTION[gitmoji] || "Miscellaneous"
  const emoji = GITMOJI_TO_EMOJI[gitmoji] || `:${gitmoji}:`

  return { hash, emoji, task, message, section }
}

const groupEntries = (entries) =>
  SECTION_ORDER.reduce((acc, section) => {
    acc[section] = entries.filter((entry) => entry.section === section)
    return acc
  }, {})

const formatEntry = (entry, section) => {
  const label = entry.task ? `${entry.task} ${entry.message}` : entry.message
  return section === "Miscellaneous"
    ? `- ${entry.emoji} ${label} [${entry.hash}]`
    : `- ${entry.emoji} ${label}`
}

const buildReleaseBlock = (version, date, entries) => {
  const grouped = groupEntries(entries)
  const sections = SECTION_ORDER.filter((section) => grouped[section].length > 0).map(
    (section) =>
      [`### ${section}`, "", ...grouped[section].map((entry) => formatEntry(entry, section))].join(
        "\n",
      ),
  )

  if (sections.length === 0) {
    sections.push("### Miscellaneous\n\n- No changes [0000000]")
  }

  return [
    `<a name="${version}"></a>`,
    `## ${version} (${date})`,
    "",
    sections.join("\n\n"),
  ].join("\n")
}

const normalizeContent = (content) => {
  if (!content || !content.trim()) return "# Changelog\n"
  return content.includes("# Changelog")
    ? content.trimEnd()
    : `# Changelog\n\n${content.trim()}`
}

const RELEASE_BLOCK_PATTERN =
  /(?:<a name="([^"]+)"><\/a>\n)?##\s+([0-9]+\.[0-9]+\.[0-9]+)\s*\([^\n]+\)\n[\s\S]*?(?=\n(?:<a name="|##\s+[0-9]+\.[0-9]+\.[0-9]+\s*\()|$)/g

const extractReleaseBlocks = (body) => {
  const blocks = []
  let match

  while ((match = RELEASE_BLOCK_PATTERN.exec(body)) !== null) {
    const [block, anchorVersion, headerVersion] = match
    blocks.push({
      block: block.trim(),
      version: headerVersion || anchorVersion || null,
    })
  }

  RELEASE_BLOCK_PATTERN.lastIndex = 0
  return blocks
}

const upsertRelease = (content, version, releaseBlock) => {
  const normalized = normalizeContent(content)
  const body = normalized.replace(/^# Changelog\s*/m, "").trim()
  const preservedBlocks = extractReleaseBlocks(body)
    .filter((entry) => entry.version !== version)
    .map((entry) => entry.block)
  const nextBody = [releaseBlock, ...preservedBlocks].filter(Boolean).join("\n\n")
  return `# Changelog\n\n${nextBody}\n`
}

const main = () => {
  const version = getVersion()
  const date = getReleaseDate()
  const baseTag = getArgValue("--from-tag") || getLastTag()
  const range = baseTag ? `${baseTag}..HEAD` : ""
  const parsed = getLogLines(range).map(parseCommitLine).filter(Boolean)
  const releaseBlock = buildReleaseBlock(version, date, parsed)
  const existingContent = existsSync(CHANGELOG_PATH)
    ? readFileSync(CHANGELOG_PATH, "utf8")
    : ""

  writeFileSync(CHANGELOG_PATH, upsertRelease(existingContent, version, releaseBlock))
  console.log(
    baseTag
      ? `CHANGELOG updated for ${version}: ${parsed.length} gitmoji commits since ${baseTag}.`
      : `CHANGELOG updated for ${version}: ${parsed.length} gitmoji commits.`,
  )
}

main()
