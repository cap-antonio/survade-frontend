#!/usr/bin/env node

import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { bumpSemver, parseSemver, syncVersionFiles } from "./version-files.mjs"

const cwd = process.cwd()
const rawMode = (process.env.VERSION_BUMP ?? "patch").trim().toLowerCase()
const mode =
  rawMode === "major" || rawMode === "1"
    ? "major"
    : rawMode === "minor" || rawMode === "2"
      ? "minor"
      : rawMode === "patch" || rawMode === "3"
        ? "patch"
        : null

if (!mode) {
  console.error(
    `Invalid VERSION_BUMP="${process.env.VERSION_BUMP}". Use major|1, minor|2, or patch|3.`,
  )
  process.exit(1)
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
const currentVersion = packageJson.version

if (!parseSemver(currentVersion)) {
  console.error(
    `Unsupported package.json version "${currentVersion}". Expected MAJOR.MINOR.PATCH.`,
  )
  process.exit(1)
}

const nextVersion = bumpSemver(currentVersion, mode)
const buildNumber = Number(process.env.VERSION_BUILD_NUMBER || 0)
const nextBuildNumber = buildNumber > 0 ? buildNumber : null

const changedFiles = syncVersionFiles({
  cwd,
  nextVersion,
  nextBuildNumber,
  updateExpoBuildNumbers: nextBuildNumber !== null,
})

if (changedFiles.length > 0) {
  execSync(`git add ${changedFiles.map((file) => `"${file}"`).join(" ")}`, {
    cwd,
    stdio: "inherit",
  })
}

console.log(
  `[pre-commit version] ${currentVersion} -> ${nextVersion}${nextBuildNumber ? ` | build ${nextBuildNumber}` : ""}`,
)
