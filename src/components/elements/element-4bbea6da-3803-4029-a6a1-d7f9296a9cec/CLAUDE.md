# CLAUDE.md — ww-chartjs

Custom WeWeb element wrapping Chart.js. The public API mirrors `chartjs.org` config (`type`, `data`, `options`) so users (or an LLM) can paste docs snippets directly into the bound props. No "guided mode."

@README.md
@docs/component-spec.md
@docs/architecture.md

## Commands

- Install: `npm i`
- Serve: `npm run serve -- port=8080` (then add the custom element via the WeWeb editor's developer popup)
- Build: `npm run build -- name=ww-chartjs type=wwobject`
- Test: `npm test` (Vitest — runs unit tests + the 11-example smoke suite against real Chart.js via jsdom + node-canvas)
- Test (watch): `npm run test:watch`

The `@weweb/cli` parses args as `key=value` (NOT `--key=value`). The `--` after `npm run X` is required to forward args to the script. The build command requires both `name=` and `type=wwobject`.

## Project layout

- `src/wwElement.vue` — Vue component (Options API, imperative canvas mount). Read this for the canonical lifecycle pattern.
- `src/lib/` — small pure helpers extracted for testability (e.g. `deepToRaw.js`).
- `ww-config.js` — editor schema (props + `triggerEvents`). Read this for the canonical prop-shape patterns.
- `package.json` — Chart.js v4 + 3 plugins + date-fns adapter, all pinned.
- `README.md` — user-facing docs (chart-type compatibility, plugin examples).
- `docs/` — architecture, third-party-library war stories, dropzone reference, examples.
- `tests/` — Vitest unit + smoke tests. `tests/fixtures/examples.js` is the single source of truth for the 11 chart examples (mirrored in `docs/examples.md`).
- `vitest.config.mts` / `vitest.setup.js` — test runner config + `wwLib` global stub.
- `.claude/rules/` — path-scoped rules that auto-load when editing matching files.
- `.claude/skills/` — invokable triage tools.

## Hard rules (apply everywhere)

- **Optional chaining** on every `props.content?.*` access. Defaults from `ww-config.js` are not guaranteed at first render.
- **No direct `document` / `window`** — use `wwLib.getFrontDocument()` / `wwLib.getFrontWindow()`. Direct access breaks WeWeb's iframe isolation.
- **No production build configs** — no `webpack.config.js`, `vite.config.js`, `.babelrc`, `tsconfig.json`. `@weweb/cli` handles the production build entirely. Test-runner configs (e.g. `vitest.config.mts`, `vitest.setup.js`) are exempt — they target test execution, not the WeWeb build pipeline.
- **Pin dependency versions** in `package.json`. The only `"latest"` allowed is `@weweb/cli` as a `devDependency`.
- **Package name** `ww-chartjs` is an explicit user-approved exception to the "no `ww`/`weweb` in name" guidance. Other repos in this org use `ww-*` too.
- **Documentation files** (any `*.md` outside the existing `README.md` / `docs/` / `.claude/`): create only when the user explicitly asks.

## When to use which guidance file

| You're about to… | Read this |
|---|---|
| Look up what THIS component IS (props, triggers, deps) | `docs/component-spec.md` (loaded every session) |
| Understand the generic architecture patterns for any WeWeb library wrapper | `docs/architecture.md` (loaded every session) |
| Edit `ww-config.js` (props, triggerEvents, actions) | `.claude/rules/ww-config.md` (auto-loads) |
| Edit `src/wwElement.vue` (component logic) | `.claude/rules/wwElement.md` (auto-loads) |
| Triage a runtime error from the WeWeb editor or any library | Invoke `/debug-weweb-error` or read `.claude/skills/debug-weweb-error/SKILL.md` |
| Integrate a new third-party library | `docs/pitfalls.md` (read all five war stories first) |
| Add a dropzone (this component doesn't have one yet) | `docs/dropzone-pattern.md` |
| Add or change a chart-config example | `tests/fixtures/examples.js` (canonical) + `docs/examples.md` (skim copy) |

## Standard workflow for changes

1. Read `docs/component-spec.md` first to confirm what's currently true about this component (props, triggers, deps).
2. Read `docs/architecture.md` and the relevant `.claude/rules/*.md` to confirm conventions before designing.
3. For a code change: edit `src/wwElement.vue` and/or `ww-config.js`. The path-scoped rules auto-load when you read those files.
4. **Update `docs/component-spec.md` in the same change** if any of the following changed:
   - Added / removed / renamed a property, trigger event, internal variable, or action.
   - Changed a property's `type`.
   - Added / upgraded / removed a runtime dependency in `package.json`.
   - Changed the mounting pattern, plugin registration model, or editor-mode behavior.
   - The "Update checklist" at the bottom of `component-spec.md` lists every section that may need to change.
5. After changes: `npm test` (unit + smoke must pass) AND `npm run build -- name=ww-chartjs type=wwobject` (build must be clean).
6. If user-visible behavior changed, update `README.md` too.
7. If a new failure mode was discovered, add a new entry to `docs/pitfalls.md` AND a new row to the triage matrix in `.claude/skills/debug-weweb-error/SKILL.md`.
8. If you added or changed a chart-config example, update both `tests/fixtures/examples.js` (canonical) and `docs/examples.md` (display copy) so they stay in sync.

**Why step 4 is mandatory**: `component-spec.md` is loaded into context every session. If it drifts from the actual code, future Claude sessions will give wrong answers. Treat it as part of the source — a stale spec is a bug.

## Style

- This file: hard rules + entry points. Anything non-trivial belongs in `.claude/rules/` or `docs/`. If you find yourself adding more than ~3 lines on one topic here, move it.
- Imperative voice. Specific, verifiable rules. No prose explanations of WHY rules exist (those go in `docs/architecture.md`).

<!-- maintainer note: keep this file under 200 lines per Anthropic CLAUDE.md guidance. The < 200 limit is the budget; the lower the better for adherence. -->
