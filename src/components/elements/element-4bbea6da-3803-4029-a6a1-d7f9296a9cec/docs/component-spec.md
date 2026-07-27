# Component spec — ww-chartjs

> **Living document.** This file is the canonical description of what `ww-chartjs` IS. Whenever a property, trigger event, internal variable, action, or runtime dependency changes, update this file in the same change. CLAUDE.md enforces this in the standard workflow.

## Purpose

`ww-chartjs` is a single WeWeb custom element that wraps Chart.js v4 and consolidates five separate predecessor repos (`chartjs-bar`, `chartjs-line`, `chartjs-pie`, `chartjs-radar`, `chartjs-scatter`). The predecessors each pinned a single chart type and bundled a heavy "guided mode" that auto-mapped collection fields to datasets via WeWeb's formula resolver — ~80% duplicated code across five repos.

This component drops guided mode entirely. The public API mirrors the [Chart.js config object](https://www.chartjs.org/docs/latest/configuration/) so users (or an LLM) paste docs snippets directly into the bound props.

## Public API

### Properties (`ww-config.js`)

| Prop | Type | Maps to Chart.js | Why this type |
|---|---|---|---|
| `type` | `TextSelect` | `config.type` | Enumerated values; nested `options.options` form. Values: `bar`, `line`, `pie`, `doughnut`, `radar`, `polarArea`, `scatter`, `bubble`. |
| `data` | `RawObject` | `config.data` (`{ labels, datasets }`) | Free-form JS object. `RawObject` returns plain JS to `props.content` (no Vue reactive proxy), which Chart.js's option resolver and `chartjs-plugin-annotation` require. `Object` would crash the inspector; `Info` would degrade UX to formula-only binding. |
| `options` | `RawObject` | `config.options` | Same reasoning as `data`. |
| `enableDatalabels` | `OnOff` | adds `chartjs-plugin-datalabels` to inline `plugins: [...]` | Per-chart-instance plugin registration |
| `enableAnnotation` | `OnOff` | adds `chartjs-plugin-annotation` to inline `plugins: [...]` | Per-chart-instance plugin registration |
| `enableZoom` | `OnOff` | adds `chartjs-plugin-zoom` to inline `plugins: [...]` | Per-chart-instance plugin registration |

### Triggers (`triggerEvents`)

| Trigger | When | Payload |
|---|---|---|
| `chart:click` | Canvas click | `{ position, points, dataX, dataY }` (`dataX`/`dataY` only for charts with scales — pie/doughnut/radar/polarArea return `null`) |
| `chart:hover` | Hover with non-empty `points` | Same shape as `chart:click` |
| `chart:ready` | After first successful render | `{}` |

### Actions

None currently. (Future: a `refresh` action could call `chartInstance.update()` from a workflow.)

### Internal variables

| Variable | Type | Updated by |
|---|---|---|
| `lastClickedPoint` | object (`{ datasetLabel, label, value, datasetIndex, index }`) | `chart:click` handler |
| `isReady` | boolean | `true` after first render; `false` on `beforeUnmount` |

Both use `wwLib.wwVariable.useComponentVariable({ uid: props.uid, ... })` so multiple instances on the same page don't share state.

## Implementation choices specific to this component

### Mounting pattern

**Imperative mount** (template = `<div ref="containerRef">`; `<canvas>` created in `mounted` via `wwLib.getFrontDocument().createElement('canvas')`). Chart.js mutates `width`/`height`/`style` on the canvas — keeping it out of the Vue template avoids the patcher conflict (pitfalls.md § 3).

### Reactivity unwrapping (`deepToRaw`)

`data` and `options` go through `deepToRaw()` (a recursive `toRaw` that preserves functions) before reaching Chart.js. `RawObject` strips the WeWeb-level Proxy, but Vue 3's component reactivity re-wraps **nested** objects when accessed through `this.content`. Chart.js's scriptable-option resolver — used by `chartjs-plugin-annotation` for each annotation's options — only attaches `setContext` to plain objects; given a Proxy, the resolver bails and the plugin throws `setContext is not a function`. See pitfalls.md § 2.

### Plugin registration model

**Globally registered, per-instance gated.** All three plugins (`chartjs-plugin-datalabels`, `chartjs-plugin-annotation`, `chartjs-plugin-zoom`) are registered globally at module load:

```js
Chart.register(...registerables, ChartDataLabels, annotationPlugin, zoomPlugin);
```

Per-instance behavior — letting two `ww-chartjs` instances on the same page have different plugin sets — is preserved by gating plugin **options**, not plugin presence. When a toggle is off, `mergedOptions.plugins.X = false` (Chart.js convention to disable a plugin for one chart):

```js
const pluginGates = {};
if (!this.content?.enableDatalabels) pluginGates.datalabels = false;
if (!this.content?.enableAnnotation) pluginGates.annotation = false;
if (!this.content?.enableZoom) pluginGates.zoom = false;
const mergedPlugins = { ...userPlugins, ...pluginGates };
```

**Why not inline `plugins: [...]`** — `chartjs-plugin-annotation`'s `afterRegister` hook calls `Chart.register(annotationTypes)` to register its element-type defaults (line / box / label / etc.). That hook only fires on global `Chart.register(plugin)`, not on the per-chart inline path. With inline-only registration, the option resolver later trips on missing element defaults (`Cannot read properties of undefined (reading 'borderCapStyle')`). Global registration is the only correct answer for this plugin.

### Editor-mode override

In editor mode (`wwEditorState.isEditing === true`), `mergedOptions` injects `animation: false` to eliminate the Chart.js singleton-Animator race during rapid prop edits (pitfalls.md § 4). Production retains Chart.js's default animations so docs snippets behave as documented. The `isEditorMode` computed is wrapped in `/* wwEditor:start/end */` blocks so the production bundle hard-codes `false`.

### Vue API

Vue 3 **Options API** — matches the convention of the predecessor `chartjs-*` repos in this org.

### Automated tests

`tests/` holds Vitest suites that run on `npm test`:

- `tests/unit/deep-to-raw.test.js` — covers the `deepToRaw` helper (from `src/lib/deepToRaw.js`).
- `tests/unit/merged-options.test.js` — `mergedOptions` defaults merge, editor-mode `animation: false` injection, onClick/onHover wrapping, plugin gating.
- `tests/unit/event-payload.test.js` — `buildEventPayload` shape; `dataX`/`dataY = null` when chart has no scales.
- `tests/smoke/examples.test.js` — for each fixture in `tests/fixtures/examples.js` (the 11 examples from `docs/examples.md`), mounts the component, inits a real Chart.js, asserts no errors logged, and verifies the toggled plugins actually attached. This regression-net would have caught the `setContext is not a function` and `Cannot read properties of undefined (reading 'borderCapStyle')` bugs.

Test environment: `happy-dom` + `vitest-canvas-mock` (pure-JS canvas stub — no native build required, so the WeWeb component-builder lambda can `npm install` cleanly) + a small `wwLib` stub in `vitest.setup.js`.

## Runtime dependencies

Pinned in `package.json`:

| Package | Version | Why |
|---|---|---|
| `chart.js` | `^4.4.0` | Core library |
| `chartjs-adapter-date-fns` | `^3.0.0` | Always loaded (import side-effect registers the date adapter); enables `options.scales.x = { type: 'time' }` out of the box. Cannot be conditionally toggled. |
| `chartjs-plugin-datalabels` | `^2.2.0` | Toggleable via `enableDatalabels` |
| `chartjs-plugin-annotation` | `^3.0.1` | Toggleable via `enableAnnotation` |
| `chartjs-plugin-zoom` | `^2.0.1` | Toggleable via `enableZoom` |
| `date-fns` | `^3.0.0` | Peer dependency of `chartjs-adapter-date-fns` |

`@weweb/cli` is the only `devDependency` (pinned to `latest` per WeWeb convention).

## Out of scope

Explicitly NOT included in this component:
- "Guided mode" / collection-field-to-dataset auto-mapping (predecessor repos had this; dropped here intentionally — users bind via formulas instead)
- Built-in dropzone (this component renders a chart, not a container)
- Inline `plugins: [...]` per-instance plugin registration (we register plugins globally and gate per-instance via `options.plugins.X = false`; see "Plugin registration model" above)
- `enableTimeAdapter` toggle (the date-fns adapter is statically loaded; toggling has no meaningful effect)

## Update checklist

When you change the component, update the matching section here:

| If you… | Update |
|---|---|
| Add / remove / rename a property in `ww-config.js` | "Properties" table above |
| Change a property's `type` | "Properties" table; explain the change in "Implementation choices" if non-obvious |
| Add / remove / rename a trigger event | "Triggers" table |
| Add / remove an internal variable | "Internal variables" table |
| Add an `actions: [...]` entry | "Actions" section |
| Add / upgrade / remove a runtime dependency | "Runtime dependencies" table |
| Change the mounting pattern, plugin model, or editor-mode behavior | "Implementation choices" section |
