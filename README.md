# `@3fv/deferred`

A `Deferred<T>`: a promise (`deferred.promise`) that is resolved, rejected or
cancelled from outside, with its status, value and error readable once it has
settled. Published as ESM (`lib/mjs`) and CommonJS (`lib/cjs`); `@3fv/guard` is a
peer dependency.

```ts
import { Deferred } from "@3fv/deferred"

const deferred = new Deferred<number>()
setTimeout(() => deferred.resolve(42), 100)
await deferred.promise // 42

// Turn a callback, event, worker or timer source into a promise
const value = await Deferred.useCallback<number>(deferred =>
  source(value => deferred.resolve(value))
).promise

await Deferred.delay(250)
```

`Deferred.useCallback` hands the new deferred to its callback at once; a throw
from the callback, or a rejection when it is async, rejects the deferred unless
it has settled already.

## Commands

[pnpm](https://pnpm.io) is the package manager, at the version pinned by the
`packageManager` field of `package.json`.

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `pnpm install`     | Installs dependencies from `pnpm-lock.yaml`               |
| `pnpm build`       | Compiles `src/` to `lib/mjs` and `lib/cjs` (`tsc -b`)     |
| `pnpm build:watch` | Same, in watch mode                                       |
| `pnpm test`        | Runs the jest specs in `src/test/` through `ts-jest`      |
| `pnpm release`     | Starts the GitHub Actions release workflow (patch bump)   |

To use a local checkout from another project, run
`pnpm link /path/to/deferred` in that project after `pnpm build` here.

## Releasing

Releases run entirely in GitHub Actions (`.github/workflows/release.yml`),
started by `pnpm release` or by
`gh workflow run release.yml --ref master -f bump=<patch|minor|major|none>` (add
`-f dist-tag=<tag>` to publish under a tag other than `latest`):

1. The `version` job runs `pnpm version`, which builds and tests the package
   (`preversion`), commits and tags `vX.Y.Z`, and pushes both to `master`.
2. The `publish` job checks out that tag, builds it and runs `npm publish`
   through npm trusted publishing, so no npm token or two-factor prompt is
   involved. If it fails, re-run that job alone: it publishes the same tag.

`bump=none` publishes the version already in `package.json` at the dispatched
commit without bumping or tagging.

Trusted publishing needs a one-time registration of the workflow on npm:

    npm trust github @3fv/deferred --repo 3fv/deferred --file release.yml --allow-publish
