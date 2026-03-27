# survade-frontend

## Release workflow

This repository uses a gitmoji-based release workflow for commits, changelog generation, and version bumps.

### Commit format

Use commit messages in this format:

```text
:gitmoji: {task-number-optional} {message}
```

Examples:

```text
:sparkles: SUR-42 add payments entrypoint
:bug: fix scrolling under modal
```

Install local hooks once after cloning:

```bash
npm run hooks:install
```

### Available commands

```bash
npm run version:bump:precommit
npm run version:audit
npm run changelog:generate
npm run release:bump
```

`version:bump:precommit` bumps the app version before each commit and stages the touched version files.

`version:audit` shows version sources used by the app.

`changelog:generate` updates `CHANGELOG.md` from gitmoji commits.

`release:bump` bumps the semantic version, regenerates the changelog, creates a release commit, and creates a local annotated tag.
