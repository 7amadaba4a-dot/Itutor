---
paths:
  - "src/wwElement.vue"
---

# Rules for `src/wwElement.vue`

These rules apply when editing the Vue component. The companion rules for `ww-config.js` live in `ww-config.md` and load when editing the schema file.

## Hard rules

- **Props**: `uid` and `content` are always required. `wwEditorState` only exists in editor builds — declare and access it inside `/* wwEditor:start */` blocks only.
- **DOM access**: use `wwLib.getFrontDocument()` and `wwLib.getFrontWindow()`. **Never** reference `document` / `window` directly — breaks WeWeb's iframe isolation.
- **Optional chaining + nullish defaults** on every `props.content?.*` read. Defaults from `ww-config.js` are not guaranteed to be present at first render.
- **No hardcoded `width`/`height` on the root element.** It must fluidly fill the WeWeb-defined container. Inner elements may have fixed dimensions.
- **Resource cleanup**: every observer / event listener / interval / timeout / library timer created in `mounted` (or in a watcher) MUST have a paired teardown in `beforeUnmount`. The WeWeb editor re-mounts components frequently when the user edits properties — without cleanup, observers stack up. See `docs/pitfalls.md` § 5.

## Reactivity

- Derive from props with `computed()` (Composition API) or `computed: { ... }` (Options API). **Never** `ref()` initialized from a prop — breaks reactivity, requires manual sync.
- Watch every prop that affects rendering. A missing watcher = stale UI when the user edits in the inspector.
- Group watchers by behavior: prop changes that need a recreate (e.g. chart `type`, FullCalendar `defaultView`, library plugin toggles) get one handler; prop changes that allow in-place update (data, options) call `instance.update()` (or the library's equivalent).
- For deep-watched object props, guard the handler with a "library still alive?" check (e.g. `if (!this.libInstance) return;`) so transient null states (mid-recreate) don't throw.

## Internal variables

- Use `wwLib.wwVariable.useComponentVariable({ uid: props.uid, name, type, defaultValue })`.
- **Always pass `props.uid`** so multiple instances on the same page don't share state.
- For interactive components: declare an `initialValue` prop in `ww-config.js`, watch it in the component, and reset the internal variable when it changes (with a `!==` guard to avoid infinite loops).

## Editor-only state

- Reading `wwEditorState.isEditing` lets you gate behavior to the editor preview (e.g. force `animation: false` in editor mode to avoid library races, show a placeholder, expand a collapsed section by default).
- Wrap detection in a computed inside `wwEditor` blocks so the production bundle hard-codes `false`:
  ```js
  isEditorMode() {
      /* wwEditor:start */
      return !!this.wwEditorState?.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
  }
  ```
- Alternative: `wwLib.wwEditorHelper.EDIT_MODES.EDITION` (used by some older repos).

## Library integration: three mounting patterns

Pick the right one for your library. Mixing them causes the bugs in `docs/pitfalls.md`.

### 1. Imperative mount — for libraries that mutate a DOM node you give them

Use when the library takes a `<canvas>` / `<div>` / `<svg>` and writes attributes (`width`, `height`, inline styles, ARIA labels) onto it. Examples: **Chart.js** (writes to canvas), **three.js** (renderer DOM), **PDFObject** (embed target).

Don't put the node in the template — the WeWeb editor's Vue patcher walks DOM siblings and chokes when a library has mutated tracked attributes (`Cannot read properties of null (reading 'nextSibling')`, see `docs/pitfalls.md` § 3).

```vue
<template>
    <div ref="containerRef" class="my-component"></div>
</template>
```
```js
mounted() { this.$nextTick(() => this.initLib()); },
beforeUnmount() { this.destroyLib(); },
methods: {
    initLib() {
        const doc = wwLib.getFrontDocument();
        const node = doc.createElement('canvas');
        this.$refs.containerRef.appendChild(node);
        this.libNode = node;
        this.libInstance = new Library(node, this.config);
    },
    destroyLib() {
        try { this.libInstance?.stop?.(); } catch (e) { /* noop */ }
        try { this.libInstance?.destroy?.(); } catch (e) { /* noop */ }
        if (this.libNode?.parentNode) this.libNode.parentNode.removeChild(this.libNode);
        this.libInstance = null;
        this.libNode = null;
    }
}
```

### 2. `markRaw` wrap — for libraries with a long-lived JS instance

Use when you store a library instance for the lifetime of the component and Vue trying to make it reactive would slow things down or break internal references. Examples: **Mapbox GL JS** (`new mapboxgl.Map(...)`), **Leaflet maps**, any library that returns a complex object you'll call methods on.

```js
import { markRaw } from 'vue';
// ...
mounted() {
    this.map = markRaw(new mapboxgl.Map({
        container: this.mapContainerId,
        style: this.content?.mapStyle,
    }));
},
beforeUnmount() {
    this.map?.remove?.();
    this.map = null;
}
```

`markRaw` tells Vue: "this object is not reactive data — leave it alone." Pair with `data() { return { map: null }; }` (Options API) or `let map = null;` outside `setup` reactive state.

### 3. `:key`-based remount — for libraries that come with their own Vue component

Use when the library ships a Vue component that owns its lifecycle. Examples: **AG Grid** via `<ag-grid-vue>`, **FullCalendar** via `<FullCalendar>`. To force the library to fully reinitialize when a key prop changes, change the `:key` value:

```vue
<FullCalendar :key="calendarKey" :options="calendarOptions" />
```
```js
const calendarKey = computed(() => `calendar-${props.content?.defaultView}-${props.content?.firstDay}`);
```

The library component unmounts + remounts cleanly. No imperative work needed — Vue handles it.

### Reactive proxies break library option resolvers

Some libraries (Chart.js + plugins like `chartjs-plugin-annotation`, possibly others that pass user options through a descriptor pipeline) call methods like `setContext()` on the user's options. When the prop is bound through a Vue reactive Proxy, the library's resolver can't wrap it correctly and the method is missing. **Fix in `ww-config.js`**: declare the prop as `RawObject` (it returns plain JS objects). Defensive fallback: deep-clone via `JSON.parse(JSON.stringify())` (drops scriptable function options). See `docs/pitfalls.md` § 2.

## Input components: form integration

Components that hold a value (text inputs, selects, checkboxes, sliders) integrate with their parent form via Vue's `inject`:

```js
import { inject } from 'vue';
// ...
setup(props, { emit }) {
    const initValue = computed(() => props.content?.initialValue);
    const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'value',
        type: 'string',
        defaultValue: initValue,
    });
    const useForm = inject('_wwForm:useForm', () => {});
    useForm(
        variableValue,
        {
            fieldName: computed(() => props.content?.fieldName),
            validation: computed(() => props.content?.validation),
            initialValue: initValue,
        },
        { elementState: props.wwElementState, emit, sidepanelFormPath: 'form', setValue }
    );
    return { variableValue, setValue };
}
```

The form-injection token is `'_wwForm:useForm'` and the default fallback is a noop, so components work both inside and outside a form. See `weweb-assets/ww-input-basic` and `weweb-assets/ww-input-select` for full examples.

## Composable components: local context

Components that contain nested elements (tabs with tab content, dialogs with trigger / overlay / content slots, selects with options) expose state and methods to their children via:

```js
wwLib.wwElement.useRegisterElementLocalContext({
    state: { currentTabIndex, isOpen },
    actions: {
        open:  { label: 'Open',  description: 'Open the dialog',  action: () => setOpen(true)  },
        close: { label: 'Close', description: 'Close the dialog', action: () => setOpen(false) },
    },
});
```

The same `actions` are also declared at the config root (see `ww-config.md`). Examples: `weweb-assets/ww-tabs`, `weweb-assets/ww-dialog`, `weweb-assets/ww-input-select`.

## Triggers

- Emit via `this.$emit('trigger-event', { name: 'event-name', event: { ... } })`.
- Event names should match `triggerEvents[].name` in `ww-config.js` exactly. Mismatch = trigger never fires.
- Wrap user-supplied callbacks (e.g. `options.onClick` from a bound formula) in try/catch so a user error doesn't crash the component.

## `wwLib` API cheat sheet

| API | Use for |
|---|---|
| `wwLib.wwVariable.useComponentVariable` | Internal variables (always pass `props.uid`) |
| `wwLib.wwElement.useRegisterElementLocalContext` | Expose state/methods to nested elements |
| `wwLib.getFrontDocument()` / `wwLib.getFrontWindow()` | DOM/window access |
| `wwLib.wwLang.getText()` | i18n string lookup |
| `wwLib.wwNotification.open()` | Toast/notification |
| `wwLib.wwFormula.useFormula()` | Resolve a formula expression |
| `wwLib.wwUtils.getDataFromCollection()` | Extract data from a bound WeWeb collection |
| `wwLib.getStyleFromToken()` | Resolve a design token to a CSS value |
| `wwLib.wwUtils.getLengthUnit()` | Parse a Length-prop value |
| `wwLib.useCreateElement()` | Create elements in editor mode (e.g. "+" buttons) |
| `wwLib.wwEditorHelper.EDIT_MODES.EDITION` | Alternative editor-mode detector |

## Reference

- `src/wwElement.vue` in this repo demonstrates the **imperative mount** pattern (Chart.js).
- `weweb-assets/ww-mapbox/src/wwElement.vue` demonstrates the **`markRaw` wrap** pattern.
- `weweb-assets/ww-datagrid-ag/src/wwElement.vue` and `weweb-assets/ww-calendar/src/wwElement.vue` demonstrate the **`:key` remount** pattern.
- `weweb-assets/ww-input-basic/src/wwElement.vue` demonstrates form integration.
- `weweb-assets/ww-tabs/src/wwElement.vue` and `weweb-assets/ww-dialog/src/wwElement.vue` demonstrate `useRegisterElementLocalContext`.
