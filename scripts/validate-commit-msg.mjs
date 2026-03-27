#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs"

const COMMIT_PATTERN =
  /^:[a-z0-9_+\-]+:\s+(?:(?:#?\d+|[A-Za-z]+-\d+)\s+)?\S.+$/i

const getMessage = () => {
  const input = process.argv[2]

  if (input && existsSync(input)) {
    const raw = readFileSync(input, "utf8")
    const firstLine = raw
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0 && !line.startsWith("#"))

    return firstLine || ""
  }

  return process.argv.slice(2).join(" ").trim()
}

const commitMessage = getMessage()

if (!commitMessage) {
  console.error("Commit message is empty.")
  process.exit(1)
}

if (/^(Merge|Revert)\b/.test(commitMessage)) {
  process.exit(0)
}

if (!COMMIT_PATTERN.test(commitMessage)) {
  console.error("Invalid commit message format.")
  console.error("Expected: :gitmoji: {task-number-optional} {message}")
  console.error("Example: :sparkles: PROJ-123 add billing paywall")
  console.error("Example: :bug: fix scanner permission state")
  process.exit(1)
}
