# Architecture patterns for WeWeb component wrappers

Generic patterns for building a WeWeb custom element that wraps a third-party JS library (Chart.js, Mapbox, AG Grid, FullCalendar, three.js, TipTap, etc.). For the specifics of *this* component, see `component-spec.md`.

## Anatomy of a library-wrapping component

```
ww-config.js            # editor schema: props, triggerEvents, actions
src/wwElement.vue       # Vue 3 component (Options or Composition API)
src/lib/                # small pure helpers extracted for testability
package.json            # pinned library version + plugins
README.md               # user-facing docs
docs/component-spec.md  # canonical spec for THIS component (props, triggers, deps)
docs/pitfalls.md        # known failure modes + fixes
tests/                  # Vitest unit + smoke tests (optional but recommended)
vitest.config.mts       # test runner config (exempt from "no build configs" rule — targets test execution, not the WeWeb build)
.claude/rules/          # path-scoped rules for editing each file type
```

## Public API design

A WeWeb custom element exposes three surfaces:

1. **Properties** (`ww-config.js` `properties: { ... }`) — configurable values shown in the inspector and bindable to formulas. Type matters: see `.claude/rules/ww-config.md` for the prop-type catalog. Free-form JS-object props must be `RawObject`, not `Object`.
2. **Triggers** (`ww-config.js` `triggerEvents: [ ... ]`) — events the component emits. Always include the full event-shape object so the formula editor can introspect.
3. **Actions** (`ww-config.js` `actions: [ ... ]`) — methods invokable from WeWeb workflows (open/close, focus, refresh). Methods themselves live in `wwElement.vue` and are exposed via `wwLib.wwElement.useRegisterElementLocalContext`.

Internal variables (`wwLib.wwVariable.useComponentVariable`) round out the surface — bindable state the user reads from formulas.

**Design principle**: mirror the wrapped library's documentation 1:1 where possible. If the library docs show `{ type, data, options }`, your props are `type`, `data`, `options`. Pasting from docs should "just work."

## Component lifecycle (canonical shape)

```
mounted
  └─ $nextTick → initLib()
                   ├─ ensureContainer()        // (or createElement + appendChild for imperative-mount libs)
                   ├─ detectOrphan()?.destroy() // covers HMR / re-mount
                   └─ new Library(node, config)

prop changes that need recreate (e.g. type, mode, plugin set)
  └─ recreateLib() — coalesced via a `recreatePending` flag
       ├─ destroyLib() → stop() → destroy() → remove DOM node
       └─ requestAnimationFrame → initLib()

prop changes that allow in-place update (data, options)
  └─ assign libInstance.data / libInstance.options + libInstance.update()

beforeUnmount
  └─ destroyLib() + disconnect observers + remove listeners + clear timers
```

## Three mounting patterns

Pick one based on how the library expects to receive a DOM node. See `.claude/rules/wwElement.md` for full code examples.

| Pattern | When | Examples |
|---|---|---|
| **Imperative mount** (template = empty `<div ref>`; canvas/svg created in `mounted`) | Library mutates a DOM node's attributes/styles directly | Chart.js, three.js, PDFObject, Konva |
| **`markRaw` wrap** (library returns a long-lived JS instance you store) | You need to call methods on the instance for the component's lifetime | Mapbox GL JS, Leaflet |
| **`:key` remount** (library ships its own Vue component) | The library wraps itself; let Vue handle init/teardown | AG Grid (`<ag-grid-vue>`), FullCalendar (`<FullCalendar>`) |

Mixing these — e.g. putting a library-mutated `<canvas>` in the template — produces the failure modes in `docs/pitfalls.md`.

## Why the lifecycle has the shape it does

These design choices show up across most library wrappers. Each has a corresponding pitfall it defends against (see `docs/pitfalls.md`).

- **Imperative DOM mount instead of templating the node** → defends against pitfall #3 (Vue patcher / `nextSibling`). Vue can't trip on attributes a library has mutated if it never tracked the node.
- **`detectOrphan()?.destroy()` before `new Library(...)`** → defends against HMR / re-mount edge cases where a previous instance is still bound to the same DOM node.
- **`recreatePending` flag coalescing recreates** → defends against the "WeWeb populates 5 defaults in one tick → 5 destroy/init cycles" cascade. One flag, one cycle.
- **`requestAnimationFrame` (not `nextTick`) between destroy and init** → defends against pitfall #4 (animator race). Lets any in-flight library frame drain before the next instance instantiates.
- **`stop()` before `destroy()`** → cancels in-flight animations cleanly so they don't fire on a half-destroyed instance.
- **Animations off in editor mode** (`isEditorMode` computed in `wwEditor:start/end` blocks) → kills the singleton-animator code path entirely in the WeWeb editor preview, where the rapid prop edits race the scheduler. Production retains library defaults.
- **Resource teardown in `beforeUnmount`** (observers, listeners, timers, library destroy) → defends against pitfall #5 (resource leaks). The editor's "edit prop → remount" cycle is the stress test.
- **Optional chaining + nullish defaults on every `props.content?.*`** → defends against the "default value not yet present at first render" race that fires in WeWeb's lazy schema population.
- **`props.uid` passed to `wwLib.wwVariable.useComponentVariable`** → defends against multiple component instances sharing internal-variable state.

## Vue API choice

Both Vue 3 Options API and Composition API are valid. Pick based on:
- **Consistency with the rest of the org** — most existing weweb-assets repos use Options API; following suit reduces cognitive load when reading them side-by-side.
- **Library lifecycle ergonomics** — for libraries with a destroy/recreate pattern (Chart.js, three.js), Options API's named `mounted` / `beforeUnmount` / `methods` reads cleanly. For composable / form-integrated input components, `<script setup>` Composition API can be lighter.

Every rule in `.claude/rules/wwElement.md` applies to both styles.

## Plugin / extension model

Libraries with plugins (Chart.js plugins, AG Grid modules, Mapbox controls, TipTap extensions) can typically be registered:

- **Globally** (e.g. `Chart.register(plugin)` at module load) — simpler but every chart on the page sees every plugin.
- **Per-instance** (inline `plugins: [...]` array on the config, per-instance modules) — lets two instances on the same page have different plugin sets without fighting.

Per-instance registration with `OnOff`-toggle props is usually the right call for a WeWeb component, since end-users compose pages with multiple instances of the same component.

## Where to find what

| You want | Where to look |
|---|---|
| What this specific component IS (props, triggers, deps) | `component-spec.md` |
| Hard rules for editing `ww-config.js` | `.claude/rules/ww-config.md` |
| Hard rules for editing `src/wwElement.vue` | `.claude/rules/wwElement.md` |
| Concrete failure modes + fixes | `pitfalls.md` |
| Library-error triage tool | `.claude/skills/debug-weweb-error/SKILL.md` |
| Dropzone implementation (if needed) | `dropzone-pattern.md` |
