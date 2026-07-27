---
name: debug-weweb-error
description: Diagnose runtime errors thrown by the WeWeb editor or by a third-party JS library wrapped inside a WeWeb custom element. Use when the user pastes an error stack containing 'Cannot read properties of null', 'setContext is not a function', or 'Cannot convert undefined or null to object', or any TypeError originating from manager.js, an editor-cdn URL, or a library frame (chart.js, mapbox-gl, ag-grid, fullcalendar, three.js, pdf.js, etc.). Also handles diffuse symptoms like duplicate event handlers, growing memory across edits, or stale state surviving prop changes.
when_to_use: User pasted a runtime error from the WeWeb editor, OR is reporting subtle issues like duplicate handlers / memory growth / stale state across property edits. Stack contains substrings like 'manager.js', 'editor-dev-cdn.weweb.io', or any library frame. Common message substrings: 'nextSibling', 'ctx.save', 'setContext', 'Object.keys', 'is not a function'.
---

# Debug WeWeb editor / library runtime errors

You're diagnosing a runtime error or subtle misbehavior in a WeWeb custom element that wraps a third-party JS library. Use the triage matrix below to match the symptom to a known root cause and fix.

## Triage matrix

Each row links to a section of `docs/pitfalls.md` for the full context (symptom, stack, root cause, fix, general rule, other libraries that hit it).

| Error / symptom | Where it surfaces | Likely cause | Fix |
|---|---|---|---|
| `Cannot convert undefined or null to object` at `Object.keys` | Inspector code (`Proxy.properties`, `Proxy.propertiesAndGroups`) | A prop in `ww-config.js` uses `type: 'Object'` — inspector tries to introspect a missing schema | Switch the prop to `type: 'RawObject'`. Full playbook: `docs/pitfalls.md` § 1. |
| `setContext is not a function` (or similar "method is not a function" on user-bound options) | Inside a library's option resolver — Chart.js plugin, AG Grid column-def hook, etc. | Two reactivity layers: `RawObject` strips the WeWeb-level Proxy, but Vue 3 component reactivity re-wraps **nested** objects when accessed through `this.content`. The library's descriptor system can't wrap a Proxy. | (1) Set the prop to `type: 'RawObject'` AND (2) recursively unwrap with `deepToRaw` (preserves functions) — or `JSON.parse(JSON.stringify())` if you don't need scriptable function options. Full playbook: `docs/pitfalls.md` § 2. |
| `Cannot read properties of null (reading 'nextSibling')` | Editor `index-XXX.js` only — no frames from your component | A library mutated a DOM node tracked by Vue (canvas / SVG / library-styled div in the template) | Render an empty `<div ref="containerRef">` in the template; create the library node imperatively via `wwLib.getFrontDocument().createElement(...)` in `mounted`. Full playbook: `docs/pitfalls.md` § 3. |
| `Cannot read properties of null (reading 'save')` from a library's draw/render loop, after a destroy/recreate cycle | Library frame (chart.js draw, three.js render, GSAP timeline, etc.), inside `requestAnimationFrame` callback | Singleton scheduler holds a reference to the destroyed instance; `ctx` is null | Layered defenses: editor-mode `animation: false`; coalesce recreates via a `recreatePending` flag; use `requestAnimationFrame` (not `nextTick`) between destroy and init; detect orphan instances; `stop()` before `destroy()`. Full playbook: `docs/pitfalls.md` § 4. |
| Duplicate event handlers / memory growth across edits / stale state surviving a prop change / "two of the same component fighting each other" | Diffuse — no single error; visible in DevTools Memory + repeated handler logs | Observer / listener / interval / library timer created in `mounted` but not torn down in `beforeUnmount` — the editor's edit-property → remount cycle stacks them up | Add the matching teardown in `beforeUnmount`: `observer.disconnect()`, `removeEventListener`, `clearInterval`, `lib.destroy()`. Full playbook: `docs/pitfalls.md` § 5. |

## If none of the above match

1. **Gather context**:
   - Full error message + stack (≥ 6 frames) — or, for diffuse symptoms, what the user observed and when.
   - Which prop the user last edited or bound.
   - Editor inspector or live preview?
   - First render, prop change, or user interaction (click/hover/scroll)?

2. **Check `wwElement.vue`**: are the rules in `.claude/rules/wwElement.md` honored? Common misses:
   - Missing optional chaining on `props.content?.*`.
   - Watcher missing for the prop the user edited.
   - Library-mutated DOM node still in the template instead of imperatively mounted.
   - Resource created in `mounted` without teardown in `beforeUnmount`.

3. **Check `ww-config.js`**: is the prop type compatible with how the user is binding it? Common misses:
   - `Object` instead of `RawObject` for free-form JS.
   - `TextSelect` with flat option map (must be nested `options: { options: [...] }`).
   - Mismatched `wwEditor:start` / `wwEditor:end` blocks.

4. **Reproduce minimally** with default values; bisect by toggling props one at a time. For diffuse symptoms (memory, duplicate handlers), repeat the suspected trigger many times and watch DevTools.

5. Once root-caused, **add a new entry to `docs/pitfalls.md`** and a new row to the triage matrix above so the next session catches it instantly.

## Cross-references

- Full pitfall write-ups: `docs/pitfalls.md`
- Architecture (component lifecycle, why each defense exists): `docs/architecture.md`
- Schema rules (when editing `ww-config.js`): `.claude/rules/ww-config.md`
- Component rules (when editing `src/wwElement.vue`): `.claude/rules/wwElement.md`
