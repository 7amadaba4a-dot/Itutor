# Third-party library integration — war stories

Five real failures hit while building WeWeb components that wrap complex JS libraries. Read this before integrating any new library that takes config objects, owns DOM nodes, or has its own option-resolver / animation pipeline / observers.

Concrete stack traces below come from Chart.js (the library that triggered each discovery), but the patterns apply to any third-party library — Mapbox, AG Grid, FullCalendar, three.js, TipTap, etc. Each pitfall ends with a **General rule** and a list of other libraries known or likely to hit the same failure.

Each entry: **Symptom** → **Stack** → **Root cause** → **Fix** → **General rule** → **Other libraries**.

---

## 1. Inspector crash: `Cannot convert undefined or null to object`

### Symptom
When you click "Settings" to open the property inspector for the dropped element, the editor throws an uncaught runtime error and the inspector won't render.

### Stack
```
Cannot convert undefined or null to object
TypeError: Cannot convert undefined or null to object
    at Object.keys (<anonymous>)
    at Proxy.properties (.../index-XXX.js:11280:76510)
    at Proxy.propertiesAndGroups (.../index-XXX.js:11280:76688)
```

### Root cause
A property in `ww-config.js` has `type: 'Object'`. The WeWeb inspector tries to introspect a nested schema (the way `Array` types do via `options.item`) by calling `Object.keys()` on a sub-key that we never provided — and crashes.

### Fix
Switch the prop to `type: 'RawObject'`:

```js
data: {
    label: { en: 'Data' },
    type: 'RawObject',                    // ← not 'Object'
    section: 'settings',
    bindable: true,
    options: { placeholder: '{ labels: [...], datasets: [...] }' },
    defaultValue: { /* sample shape */ },
}
```

`RawObject` is the WeWeb-native type for free-form JS objects (used by `ww-datagrid-ag` for AG Grid filters, `ww-mapbox` for style overrides). It renders a JSON-style binding popup and provides plain JS objects to `props.content` — no Vue reactive proxy wrapping.

Alternative: `type: 'Info'` + `bindable: 'list'` (used by older `chartjs-*` repos). Works but degrades UX to formula-only binding.

### Prevention rule
**Never use `type: 'Object'`** in `ww-config.js` for free-form JS-object props. Pick `RawObject` or `Info` based on UX needs.

### General rule
Any free-form JS-object prop in `ww-config.js` should be `RawObject`, not `Object`.

### Other libraries that hit this
- **AG Grid filters/pagination configs** (`ww-datagrid-ag` already uses `RawObject` here)
- **Mapbox style overrides** (free-form `MapStyle` JSON)
- **FullCalendar event-source descriptors**
- Any library with a heterogeneous JSON config that doesn't fit a fixed schema

---

## 2. Plugin resolver break: `setContext is not a function`

### Symptom
After binding `options` with an annotation config and toggling the annotation plugin on, `[ww-chartjs] Failed to init chart: TypeError: annotationOptions.setContext is not a function` fires from `chartjs-plugin-annotation`.

### Stack
```
TypeError: annotationOptions.setContext is not a function
    at updateElements (chartjs-plugin-annotation.esm.js:3222)
    at Object.afterUpdate (chartjs-plugin-annotation.esm.js:3372)
    at PluginService._notify (chart.js:5249)
    ...
    at new Chart (chart.js:5769)
    at Proxy.initChart (wwElement.vue:218)
```

### Root cause
Two reactivity layers wrap user options before they reach Chart.js, and **both** must be unwrapped:

1. **WeWeb prop layer**: `type: 'Object'` returns a Vue reactive Proxy in `props.content`. `RawObject` returns plain JS — strips this layer.
2. **Vue component layer**: even with `RawObject`, reading `this.content.options` (Options API) or `props.content.options` (Composition API) goes through the component instance's reactivity. Vue 3 re-wraps **nested** objects via deep `reactive()` when accessed. So `this.content.options.plugins.annotation.annotations.target` is a Proxy again, even if `this.content.options` itself was plain JS at the prop boundary.

Chart.js's option resolver wraps each annotation entry in a descriptor with `setContext()`. The wrapping pipeline only attaches `setContext` to plain objects — given a Proxy, it bails silently. Then `chartjs-plugin-annotation`'s `updateElements` calls `annotationOptions.setContext(...)` and crashes.

Plain `data` (numbers in `datasets[].data`) doesn't trigger this because Chart.js never calls `setContext` on it. Annotation options are scriptable, so the resolver runs — and fails.

Verified in installed source:
- `node_modules/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js:2716` — `annotationOptions.setContext(getContext(...))`
- `node_modules/chart.js/dist/chart.js:5208` — `pluginOpts(config, {plugin}, opts, context)` builds the resolver that *should* be wrapping the annotation config.

### Fix
Three layers, together — the first two address the Proxy / scope issue, the third addresses an **inline-plugin registration bug** that was masked by the Proxy errors:

0. **Register the plugin globally**, not via inline `plugins: [...]`. `chartjs-plugin-annotation`'s `afterRegister` hook calls `Chart.register(annotationTypes)` to install its element-type defaults. That hook only fires on `Chart.register(plugin)`. Inline `plugins: [...]` per-chart skips it, and the resolver later trips on `Cannot read properties of undefined (reading 'borderCapStyle')`. Per-instance behavior is preserved by gating plugin **options** instead (`options.plugins.X = false`).
1. **`type: 'RawObject'`** for the prop (strips the WeWeb Proxy).
2. **Recursive `deepToRaw` in the component** before passing to the library — preserves functions, unwraps every nested Vue Proxy:
   ```js
   import { toRaw, isProxy } from 'vue';

   function deepToRaw(value) {
       if (Array.isArray(value)) return value.map(deepToRaw);
       if (value !== null && typeof value === 'object') {
           const raw = isProxy(value) ? toRaw(value) : value;
           const out = {};
           for (const key of Object.keys(raw)) out[key] = deepToRaw(raw[key]);
           return out;
       }
       return value;
   }

   // in computed:
   mergedOptions() {
       const userOptions = this.content?.options ? deepToRaw(this.content.options) : {};
       // ...spread into the chart config
   }
   ```

`JSON.parse(JSON.stringify(...))` is a simpler alternative but kills scriptable function options (`borderColor: (ctx) => ...`). Use `deepToRaw` if you need to preserve those.

### Prevention rule
**Free-form JS-object props passed into a library that resolves scriptable options must be `RawObject` AND deep-unwrapped before reaching the library.** `RawObject` alone strips the WeWeb-level Proxy; `deepToRaw` strips the Vue component-level Proxies on nested objects.

### General rule
Two layers of Vue reactivity sit between a WeWeb prop and a third-party library. `RawObject` handles one. The other (component-instance reactivity wrapping nested objects) requires explicit unwrapping — `deepToRaw`, `JSON.parse(JSON.stringify())`, or `structuredClone` (functions die in the latter two). If the library calls `.setContext` / `.resolve` / `.attachContext` on user options, you need both.

### Other libraries that hit this
- **`chartjs-plugin-annotation`** (verified — the one that triggered this discovery)
- **`chartjs-plugin-datalabels`** in some config shapes (anecdotal)
- **AG Grid** column-definition objects in some advanced uses (its `JSON.stringify` defensive comparison in `ww-datagrid-ag` hints at the same family of bug)
- Any library that calls `setContext` / `resolve` / `attachContext` / similar on user options

---

## 3. Vue patcher conflict: `Cannot read properties of null (reading 'nextSibling')`

### Symptom
On element drop or after a re-render, the editor shows an uncaught runtime error from minified WeWeb code. Stack contains zero frames from your component.

### Stack
```
Cannot read properties of null (reading 'nextSibling')
TypeError: Cannot read properties of null (reading 'nextSibling')
    at nextSibling (.../index-XXX.js:25:6864)
    at me (.../index-XXX.js:23:10129)
    at h (.../index-XXX.js:23:489)
    at O / D / C / h (.../index-XXX.js:23:...)
    at mr.s [as fn] (.../index-XXX.js:23:5273)
    at mr.run / mr.runIfDirty (.../index-XXX.js:3:25767)
```

### Root cause
A library mutates `width`/`height`/`style` attributes on a DOM node that's also in the Vue template. The WeWeb editor's Vue patcher walks siblings during re-renders; the library mutation makes Vue's vnode/DOM expectations diverge, and `nextSibling` access on a freed node throws.

For Chart.js specifically: the `<canvas>` gets `style="display: block; width: ...px; height: ...px;"` set by Chart.js when `responsive: true`.

### Fix
Don't put the library-owned node in the template. Render an empty container, then create the node imperatively in `mounted`:

```vue
<template>
    <div ref="containerRef" class="ww-chartjs"></div>
</template>

<script>
mounted() {
    this.$nextTick(() => this.initChart());
},
methods: {
    ensureCanvas() {
        const container = this.$refs.containerRef;
        if (!container) return null;
        if (!this.canvasEl || !container.contains(this.canvasEl)) {
            const doc = wwLib.getFrontDocument();
            const canvas = doc.createElement('canvas');
            canvas.className = 'ww-chartjs__canvas';
            container.appendChild(canvas);
            this.canvasEl = canvas;
        }
        return this.canvasEl;
    },
    // ...
    destroyChart() {
        if (this.chartInstance) {
            try { this.chartInstance.stop(); } catch (e) { /* noop */ }
            try { this.chartInstance.destroy(); } catch (e) { /* noop */ }
            this.chartInstance = null;
        }
        if (this.canvasEl?.parentNode) {
            this.canvasEl.parentNode.removeChild(this.canvasEl);
        }
        this.canvasEl = null;
    }
}
</script>
```

Vue never tracks the canvas; the library can mutate it freely.

### Prevention rule
**Any DOM node a library will mutate (canvas, div with library-owned styles, three.js renderer DOM, etc.) must NOT live in the Vue template.** Always create + append imperatively in `mounted`, remove in `beforeUnmount`.

### General rule
If a library writes attributes/styles to a DOM node, that node must be created imperatively (and owned by the library), not declared in the Vue template.

### Other libraries that hit this
- **three.js** `WebGLRenderer.domElement` — set as a `<canvas>` with mutated dimensions
- **PDFObject** / **pdf.js** — embed targets that get child iframes/canvases injected
- **Mapbox GL JS** — its container `<div>` gets `mapboxgl-*` classes and inline styles set on it (Mapbox uses an ID-based container ref and `markRaw` on the resulting instance, which avoids this trap by a different route — see `wwElement.md` § "Library integration")
- **Konva** / **PIXI.js** — same canvas-mutation pattern as Chart.js / three.js

---

## 4. Animator race: `Cannot read properties of null (reading 'save')`

### Symptom
After dropping the element, an uncaught runtime error fires on a subsequent animation frame, deep inside the library's draw loop.

### Stack
```
Cannot read properties of null (reading 'save')
TypeError: Cannot read properties of null (reading 'save')
    at clipArea (.../manager.js:33278)
    at Chart._drawDataset (.../manager.js:25905)
    at Chart._drawDatasets / Chart.draw (.../manager.js:25889 / 25860)
    at Map.forEach (<anonymous>)
    at Animator._update (.../manager.js:19707)
    at requestAnimationFrame callback (.../manager.js:19698)
```

### Root cause
Chart.js has a singleton `Animator` with a `Map<chart, animations>`. Each frame's `_update()` calls `chart.draw()` on every entry. After `chart.destroy()`, the chart's `ctx` is `null` — `clipArea(ctx)` calls `ctx.save()` and throws.

When the element is dropped, WeWeb populates several `content.*` defaults in quick succession. Each watcher (`type`, `enableDatalabels`, …) used to call `recreateChart()` independently. Multiple destroy+init cycles intersect with the singleton animator's pending frames.

Verified in source:
- `node_modules/chart.js/dist/chart.js:42-78` — `Animator._update` iterates `this._charts.forEach((anims, chart) => { chart.draw(); })`
- `node_modules/chart.js/dist/chart.js:6241` — `Chart.destroy()` calls `animator.remove(this)`. Race window between rAF queueing and removal.

### Fix (layered defenses, all in place)
1. **Editor-mode `animation: false`** — kills the Animator code path entirely in the WeWeb editor preview. Production retains Chart.js default animations:
   ```js
   const editorAnimationOverride = this.isEditorMode ? { animation: false } : {};
   return { ...defaults, ...userOptions, ...editorAnimationOverride, ... };
   ```
2. **Coalesce rapid recreates**:
   ```js
   recreateChart() {
       if (this.recreatePending) return;
       this.recreatePending = true;
       this.destroyChart();
       wwLib.getFrontWindow().requestAnimationFrame(() => {
           this.recreatePending = false;
           this.initChart();
       });
   }
   ```
3. **`requestAnimationFrame`, not `nextTick`** between destroy and init — gives any in-flight frame a chance to drain.
4. **Detect orphan instances** before init: `Chart.getChart(canvas)?.destroy()` covers HMR / re-mount edge cases.
5. **`stop()` before `destroy()`** — cancels in-flight animations cleanly before freeing state.

### Prevention rule
**Any library with a singleton animator/scheduler that runs `requestAnimationFrame` callbacks** needs the same five defenses. The editor-mode kill-switch (defense 1) is the highest-leverage one.

### General rule
Libraries with a global scheduler that ticks via `requestAnimationFrame` will race destroy/recreate cycles. Disable animations in editor mode, coalesce recreates, drain frames between destroy and init.

### Other libraries that hit this
- **three.js** custom render loops driven by `requestAnimationFrame`
- **GSAP** when used as a singleton timeline that animates multiple destroyed instances
- **D3 transitions** if you destroy an SVG mid-transition
- **AG Grid** (it uses `requestAnimationFrame` internally to throttle variable updates — `ww-datagrid-ag` adds a `rafId` gate to prevent this race; see its `wwElement.vue`)
- Any custom `rAF` loop you write yourself in a component

---

## 5. Resource leaks from missing `beforeUnmount` cleanup

### Symptom
Subtle and varied:
- Duplicate event handlers fire (one click triggers the action twice)
- Memory grows steadily as the user edits properties in the editor
- Stale state survives a prop change ("the chart still shows the old labels")
- Two instances of the component appear to fight each other
- Console warnings about unrecoverable observers / detached nodes

No single error message identifies this — it's a family of symptoms.

### Stack
There's no canonical stack trace because the failure is gradual. You'll see signs in:
- Browser DevTools Memory profiler showing detached DOM nodes growing across edits
- `performance.now()` timings drifting upward as more handlers stack
- Manual addition of `console.log` in your handlers showing them firing N times where N = (number of edits since page load)

### Root cause
A `ResizeObserver`, `MutationObserver`, `IntersectionObserver`, `addEventListener`, `setInterval`, custom timer, or library-internal listener was created in `mounted` (or in a watcher) but **not torn down in `beforeUnmount`**. The WeWeb editor frequently re-mounts components when the user edits properties; each remount creates a new instance, the previous one's observers stay registered and keep firing on stale state.

### Fix
Every `mounted`-side resource creation must be paired with an explicit teardown:

```js
mounted() {
    this._resizeObserver = new ResizeObserver(() => this.relayout());
    this._resizeObserver.observe(this.$refs.containerRef);

    this._scrollHandler = this.onScroll.bind(this);
    wwLib.getFrontWindow().addEventListener('scroll', this._scrollHandler);

    this._refreshTimer = setInterval(() => this.refresh(), 5000);
},
beforeUnmount() {
    this._resizeObserver?.disconnect();
    wwLib.getFrontWindow().removeEventListener('scroll', this._scrollHandler);
    clearInterval(this._refreshTimer);
    if (this._libInstance?.destroy) this._libInstance.destroy();
}
```

If you use a watcher to allocate something, do the same — clean up in the watcher's next firing or in `beforeUnmount`.

### Prevention rule
**Mental model: every `mounted`-side resource = one `beforeUnmount` line.** Before pushing a change, scan `mounted` for `new ...Observer`, `addEventListener`, `setInterval`, `setTimeout`, library `init` / `start` calls. For each, confirm `beforeUnmount` reverses it.

### General rule
The WeWeb editor's "edit a prop → component remounts" cycle is the stress test. If you forget a teardown, you won't notice until: (1) a user reports a memory leak, or (2) a duplicate handler fires in production after several state transitions.

### Other libraries that hit this
- **`ww-mapbox`** — `wwElement.vue` creates a `ResizeObserver` in `mounted` with no `beforeUnmount` (confirmed leak in the audit)
- **PDF viewers** — `pdf.js` worker references can persist
- **WebSocket-backed components** (chat, live data) — open sockets must close
- **Anything subscribing to a global event bus or store** — unsubscribe in `beforeUnmount`
