#!/usr/bin/env node

import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { bumpSemver, syncVersionFiles } from "./version-files.mjs"

const cwd = process.cwd()

const run = (command, options = {}) =>
  execSync(command, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  })

const isClean = () => {
  try {
    run("git diff --quiet")
    run("git diff --cached --quiet")
    return true
  } catch {
    return false
  }
}

const getLastTag = () => {
  try {
    return run("git describe --tags --abbrev=0").trim() || null
  } catch {
    return null
  }
}

const getCurrentVersion = () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
  return packageJson.version
}

const pickReleaseType = async () => {
  const cliValue = process.argv[2]
  if (["patch", "minor", "major"].includes(cliValue)) {
    return cliValue
  }

  const rl = createInterface({ input, output })
  try {
    output.write("Which version do you want to bump?\n")
    output.write("1) patch (x.y.Z)\n")
    output.write("2) minor (x.Y.0) [default]\n")
    output.write("3) major (X.0.0)\n")
    const choice = await rl.question("Enter choice (1/2/3): ")

    if (choice === "1") return "patch"
    if (choice === "3") return "major"
    return "minor"
  } finally {
    rl.close()
  }
}

const confirm = async (message) => {
  const rl = createInterface({ input, output })
  try {
    const answer = await rl.question(message)
    return !/^[Nn]$/.test(answer || "Y")
  } finally {
    rl.close()
  }
}

const getNextBuildNumber = () => {
  const explicit = process.env.RELEASE_BUILD_NUMBER
  if (explicit) return Number(explicit)

  const appJson = (() => {
    try {
      return JSON.parse(readFileSync("app.json", "utf8"))
    } catch {
      return null
    }
  })()

  const expoAndroidCode = Number(appJson?.expo?.android?.versionCode ?? 0)
  const baseBuild = Number.isFinite(expoAndroidCode) ? expoAndroidCode : 0
  return baseBuild > 0 ? baseBuild + 1 : null
}

const main = async () => {
  if (!isClean()) {
    console.error("Working tree is not clean. Commit/stash changes first.")
    process.exit(1)
  }

  const releaseType = await pickReleaseType()
  const currentVersion = getCurrentVersion()
  const nextVersion = bumpSemver(currentVersion, releaseType)
  const nextBuildNumber = getNextBuildNumber()
  const previousTag = getLastTag()

  const changedFiles = syncVersionFiles({
    cwd,
    nextVersion,
    nextBuildNumber,
    updateExpoBuildNumbers: nextBuildNumber !== null,
  })

  run(
    previousTag
      ? `node scripts/generate-changelog.mjs --version ${nextVersion} --from-tag ${previousTag}`
      : `node scripts/generate-changelog.mjs --version ${nextVersion}`,
    { stdio: "inherit" },
  )

  output.write(`\nVersion: v${nextVersion}\n`)
  if (nextBuildNumber !== null) {
    output.write(`Build number: ${nextBuildNumber}\n`)
  }
  output.write(`Touched files: ${changedFiles.join(", ")}\n`)

  const proceed = await confirm("Proceed with commit and tag? (Y/n): ")
  if (!proceed) {
    console.error("Aborted. Review the updated files and commit manually.")
    process.exit(1)
  }

  if (changedFiles.length > 0) {
    run(`git add ${changedFiles.map((file) => `"${file}"`).join(" ")}`, {
      stdio: "inherit",
    })
  }

  run('git add CHANGELOG.md', { stdio: "inherit" })
  run(`git commit -m ":bookmark: bump version to v${nextVersion}"`, {
    stdio: "inherit",
  })
  run(`git tag -a "v${nextVersion}" -m "v${nextVersion}"`, { stdio: "inherit" })

  output.write("Done: release commit and local annotated tag created.\n")
  output.write("Push manually after approval: git push && git push --tags\n")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
