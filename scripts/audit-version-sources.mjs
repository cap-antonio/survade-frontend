#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const cwd = process.cwd()

const readJson = (relativePath) => {
  const absolutePath = resolve(cwd, relativePath)
  if (!existsSync(absolutePath)) return null

  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"))
  } catch {
    return null
  }
}

const readText = (relativePath) => {
  const absolutePath = resolve(cwd, relativePath)
  if (!existsSync(absolutePath)) return null
  return readFileSync(absolutePath, "utf8")
}

const extract = (text, pattern) => {
  if (!text) return null
  const match = text.match(pattern)
  return match ? match[1] : null
}

const rows = []

const addRow = (file, key, value, kind) => {
  if (value === null || value === undefined || value === "") return
  rows.push({ file, key, value: String(value), kind })
}

const packageJson = readJson("package.json")
if (packageJson) {
  addRow("package.json", "version", packageJson.version, "semantic")
}

const packageLock = readJson("package-lock.json")
if (packageLock) {
  addRow("package-lock.json", "version", packageLock.version, "semantic")
  addRow(
    "package-lock.json",
    'packages[""].version',
    packageLock.packages?.[""]?.version,
    "semantic",
  )
}

const appJson = readJson("app.json")
if (appJson?.expo) {
  addRow("app.json", "expo.version", appJson.expo.version, "semantic")
  addRow(
    "app.json",
    "expo.ios.buildNumber",
    appJson.expo.ios?.buildNumber,
    "build",
  )
  addRow(
    "app.json",
    "expo.android.versionCode",
    appJson.expo.android?.versionCode,
    "build",
  )
}

const appConfigJs = existsSync(resolve(cwd, "app.config.js"))
const appConfigTs = existsSync(resolve(cwd, "app.config.ts"))
if (appConfigJs || appConfigTs) {
  rows.push({
    file: appConfigTs ? "app.config.ts" : "app.config.js",
    key: "dynamic-config",
    value: "Inspect manually: Expo version may be computed in code.",
    kind: "manual",
  })
}

const androidGradle =
  readText("android/app/build.gradle") ?? readText("android/app/build.gradle.kts")
if (androidGradle) {
  addRow(
    existsSync(resolve(cwd, "android/app/build.gradle"))
      ? "android/app/build.gradle"
      : "android/app/build.gradle.kts",
    "versionName",
    extract(androidGradle, /versionName\s*[= ]\s*"([^"]+)"/),
    "semantic",
  )
  addRow(
    existsSync(resolve(cwd, "android/app/build.gradle"))
      ? "android/app/build.gradle"
      : "android/app/build.gradle.kts",
    "versionCode",
    extract(androidGradle, /versionCode\s*[= ]\s*(\d+)/),
    "build",
  )
}

const iosPbxprojCandidates = [
  "ios/App.xcodeproj/project.pbxproj",
  "ios/Runner.xcodeproj/project.pbxproj",
]

for (const candidate of iosPbxprojCandidates) {
  const text = readText(candidate)
  if (!text) continue

  addRow(
    candidate,
    "MARKETING_VERSION",
    extract(text, /MARKETING_VERSION = ([^;]+);/),
    "semantic",
  )
  addRow(
    candidate,
    "CURRENT_PROJECT_VERSION",
    extract(text, /CURRENT_PROJECT_VERSION = ([^;]+);/),
    "build",
  )
}

const iosPlistCandidates = ["ios/App/Info.plist", "ios/Runner/Info.plist"]

for (const candidate of iosPlistCandidates) {
  const text = readText(candidate)
  if (!text) continue

  addRow(
    candidate,
    "CFBundleShortVersionString",
    extract(
      text,
      /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/,
    ),
    "semantic",
  )
  addRow(
    candidate,
    "CFBundleVersion",
    extract(text, /<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/),
    "build",
  )
}

const envFiles = [
  ".env",
  ".env.example",
  ".env.local",
  ".env.production",
  ".env.local.example",
]

for (const envFile of envFiles) {
  const text = readText(envFile)
  if (!text) continue

  addRow(
    envFile,
    "NEXT_PUBLIC_APP_VERSION",
    extract(text, /^NEXT_PUBLIC_APP_VERSION=(.+)$/m),
    "runtime",
  )
  addRow(
    envFile,
    "VITE_APP_VERSION",
    extract(text, /^VITE_APP_VERSION=(.+)$/m),
    "runtime",
  )
  addRow(envFile, "APP_VERSION", extract(text, /^APP_VERSION=(.+)$/m), "runtime")
}

for (const candidate of [
  "public/version.json",
  "src/constants/version.ts",
  "src/config/version.ts",
]) {
  if (!existsSync(resolve(cwd, candidate))) continue
  rows.push({
    file: candidate,
    key: "runtime-version-source",
    value: "Inspect manually: app exposes runtime version from this file.",
    kind: "runtime",
  })
}

if (rows.length === 0) {
  console.log("No known version sources found.")
  process.exit(0)
}

for (const row of rows) {
  console.log(`[${row.kind}] ${row.file} :: ${row.key} = ${row.value}`)
}
