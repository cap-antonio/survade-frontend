#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

export const parseSemver = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) return null

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

export const bumpSemver = (version, releaseType) => {
  const parsed = parseSemver(version)
  if (!parsed) {
    throw new Error(`Unsupported version "${version}". Expected MAJOR.MINOR.PATCH.`)
  }

  if (releaseType === "major") {
    return `${parsed.major + 1}.0.0`
  }

  if (releaseType === "minor") {
    return `${parsed.major}.${parsed.minor + 1}.0`
  }

  if (releaseType === "patch") {
    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`
  }

  throw new Error(`Unsupported release type "${releaseType}".`)
}

export const readJson = (cwd, relativePath) => {
  const absolutePath = resolve(cwd, relativePath)
  if (!existsSync(absolutePath)) return null
  return JSON.parse(readFileSync(absolutePath, "utf8"))
}

export const writeJson = (cwd, relativePath, value) => {
  const absolutePath = resolve(cwd, relativePath)
  writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`)
}

export const readText = (cwd, relativePath) => {
  const absolutePath = resolve(cwd, relativePath)
  if (!existsSync(absolutePath)) return null
  return readFileSync(absolutePath, "utf8")
}

export const writeText = (cwd, relativePath, value) => {
  const absolutePath = resolve(cwd, relativePath)
  writeFileSync(absolutePath, value)
}

const updateFile = (cwd, relativePath, transformer, changedFiles) => {
  const current = readText(cwd, relativePath)
  if (current === null) return
  const next = transformer(current)
  if (next !== current) {
    writeText(cwd, relativePath, next)
    changedFiles.push(relativePath)
  }
}

export const syncVersionFiles = ({
  cwd,
  nextVersion,
  nextBuildNumber,
  updateExpoBuildNumbers = true,
}) => {
  const changedFiles = []

  const packageJson = readJson(cwd, "package.json")
  if (!packageJson?.version) {
    throw new Error("package.json with a version field is required.")
  }

  if (packageJson.version !== nextVersion) {
    packageJson.version = nextVersion
    writeJson(cwd, "package.json", packageJson)
    changedFiles.push("package.json")
  }

  const packageLock = readJson(cwd, "package-lock.json")
  if (packageLock) {
    let changed = false

    if (packageLock.version !== nextVersion) {
      packageLock.version = nextVersion
      changed = true
    }

    if (packageLock.packages?.[""]?.version !== nextVersion) {
      packageLock.packages[""].version = nextVersion
      changed = true
    }

    if (changed) {
      writeJson(cwd, "package-lock.json", packageLock)
      changedFiles.push("package-lock.json")
    }
  }

  const appJson = readJson(cwd, "app.json")
  if (appJson?.expo) {
    let changed = false

    if (appJson.expo.version !== nextVersion) {
      appJson.expo.version = nextVersion
      changed = true
    }

    if (updateExpoBuildNumbers && nextBuildNumber !== null) {
      appJson.expo.ios = appJson.expo.ios ?? {}
      appJson.expo.android = appJson.expo.android ?? {}

      if (String(appJson.expo.ios.buildNumber ?? "") !== String(nextBuildNumber)) {
        appJson.expo.ios.buildNumber = String(nextBuildNumber)
        changed = true
      }

      if (Number(appJson.expo.android.versionCode ?? 0) !== Number(nextBuildNumber)) {
        appJson.expo.android.versionCode = Number(nextBuildNumber)
        changed = true
      }
    }

    if (changed) {
      writeJson(cwd, "app.json", appJson)
      changedFiles.push("app.json")
    }
  }

  updateFile(
    cwd,
    "android/app/build.gradle",
    (text) =>
      text
        .replace(/versionName\s*[= ]\s*"[^"]+"/, `versionName "${nextVersion}"`)
        .replace(
          /versionCode\s*[= ]\s*\d+/,
          nextBuildNumber === null
            ? (match) => match
            : `versionCode ${Number(nextBuildNumber)}`,
        ),
    changedFiles,
  )

  updateFile(
    cwd,
    "android/app/build.gradle.kts",
    (text) =>
      text
        .replace(/versionName\s*=\s*"[^"]+"/, `versionName = "${nextVersion}"`)
        .replace(
          /versionCode\s*=\s*\d+/,
          nextBuildNumber === null
            ? (match) => match
            : `versionCode = ${Number(nextBuildNumber)}`,
        ),
    changedFiles,
  )

  for (const candidate of [
    "ios/App.xcodeproj/project.pbxproj",
    "ios/Runner.xcodeproj/project.pbxproj",
  ]) {
    updateFile(
      cwd,
      candidate,
      (text) => {
        let next = text.replace(
          /MARKETING_VERSION = [^;]+;/g,
          `MARKETING_VERSION = ${nextVersion};`,
        )

        if (nextBuildNumber !== null) {
          next = next.replace(
            /CURRENT_PROJECT_VERSION = [^;]+;/g,
            `CURRENT_PROJECT_VERSION = ${nextBuildNumber};`,
          )
        }

        return next
      },
      changedFiles,
    )
  }

  for (const candidate of ["ios/App/Info.plist", "ios/Runner/Info.plist"]) {
    updateFile(
      cwd,
      candidate,
      (text) => {
        let next = text.replace(
          /(<key>CFBundleShortVersionString<\/key>\s*<string>)([^<]+)(<\/string>)/,
          `$1${nextVersion}$3`,
        )

        if (nextBuildNumber !== null) {
          next = next.replace(
            /(<key>CFBundleVersion<\/key>\s*<string>)([^<]+)(<\/string>)/,
            `$1${nextBuildNumber}$3`,
          )
        }

        return next
      },
      changedFiles,
    )
  }

  return changedFiles
}
