---
paths:
  - "ww-config.js"
---

# Rules for `ww-config.js`

These rules apply when editing the WeWeb element schema. The companion rules for `src/wwElement.vue` live in `wwElement.md` and load when editing the component file.

## Hard rules

- **Free-form JS-object props**: use `type: 'RawObject'`. **Never** `type: 'Object'` — the inspector tries to introspect a missing schema and crashes with `Cannot convert undefined or null to object`. Affects any prop holding a library config (chart.js `data`/`options`, AG Grid filters, Mapbox style overrides, FullCalendar event-source descriptors). See `docs/pitfalls.md` § 1.
- **`TextSelect`**: use the **nested** `options: { options: [{ value, label }] }` form. Flat option maps don't render dropdowns.
  ```js
  type: 'TextSelect',
  options: { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] },
  ```
- **Paired `wwEditor` blocks**: `/* wwEditor:start */` and `/* wwEditor:end */` MUST come in pairs around `bindingValidation` and `propertyHelp`. Mismatched tags cause catastrophic component failure.
- **`defaultValue` is mandatory** on every property. Provide a value that demonstrates the prop's expected shape.
- **`bindable`**:
  - `true` for scalars and `RawObject`.
  - `'list'` for `Info` types that should accept a list/object via formula-only binding.
  - `'repeatable'` for hidden array props that should repeat per bound item (used by dropzones).
- **`triggerEvents`**: include the full `event: { ... }` shape so the WeWeb formula editor can introspect available fields. Empty `event: {}` blocks future binding.
- **`section`**: every prop should declare a section (`'settings'`, `'style'`, etc.) so the inspector groups them sensibly.
- **`label`** uses `{ en: '...' }` i18n form.
- **Conditional visibility**: `hidden: content => !content?.parentToggle` — use optional chaining. Multi-prop conditions are fine: `hidden: content => content.type !== 'modal' || !content?.useCustomAnimation`.

## Property types catalog

You'll likely use a wider palette than the basics. Pick the most specific type — the inspector renders the right editor automatically.

| Category | Types | Use for |
|---|---|---|
| **Scalars** | `Text`, `Textarea`, `Number`, `Color`, `OnOff`, `Length` | Single values |
| **Enums** | `TextSelect`, `TextRadioGroup` | Pick one of N options |
| **Structured** | `Array`, `RawObject`, `Info`, `ObjectPropertyPath`, `ObjectList`, `Formula` | Composite values; binding to collections; formula-driven mappings |
| **Styling** | `Border`, `Shadows`, `Spacing`, `Typography`, `FontFamily`, `Background` | Multi-property style editors with their own inspectors |
| **Assets** | `Image`, `File`, `Icon`, `SystemIcon` | Media references |
| **Special** | `InfoBox`, `Tabs`, `Button`, `any` | Editor-only display, action buttons, free-form values |

**Rules of thumb:**
- For free-form JS objects mirroring a library config → `RawObject` (renders a JSON-style editor; provides plain JS to `props.content`).
- For structured arrays of objects with known shape → `Array` with `options.item.options.item` schema (see "Array of objects" below).
- For collection-bound lists → `Info` + `bindable: 'list'` (legacy compat for inspector-only labels).
- For style editors that should match the rest of the WeWeb UI → use the dedicated `Border`/`Shadows`/`Typography`/etc. types instead of rolling your own with multiple primitives.

## Array of objects

When a property is an array of structured objects (not free-form JS), use `type: 'Array'` with a full schema:

```js
items: {
    label: { en: 'Items' },
    type: 'Array',
    section: 'settings',
    bindable: true,
    defaultValue: [{ id: 'item1', name: 'Sample' }],
    options: {
        expandable: true,
        getItemLabel(item) { return item.name || item.id || 'Item'; },
        item: {
            type: 'Object',
            defaultValue: { id: 'item1', name: '' },
            options: {
                item: {
                    id:   { label: { en: 'ID' },   type: 'Text' },
                    name: { label: { en: 'Name' }, type: 'Text' },
                },
            },
        },
    },
}
```

For data that mirrors a library config object (Chart.js `data`, AG Grid filter state, Mapbox `style`, etc.), prefer `RawObject` over `Array`. Library configs have heterogeneous nested shapes that don't fit a fixed schema.

## `actions` array — expose methods to WeWeb workflows

Components that have user-invokable methods (open/close a dialog, focus an input, refresh a grid) declare them at the config root:

```js
export default {
    editor: { label: { en: 'My Component' }, icon: '...' },
    actions: [
        { label: 'Open',  action: 'open'  },
        { label: 'Close', action: 'close' },
        { label: 'Refresh data', action: 'refresh', args: [{ name: 'force', type: 'boolean' }] },
    ],
    properties: { /* ... */ },
}
```

The methods themselves are exposed in `wwElement.vue` via `wwLib.wwElement.useRegisterElementLocalContext` (see `wwElement.md`). Examples in the wild: `ww-tabs` (next/previous), `ww-dialog` (open/close/toggle), `ww-input-select` (focus/blur).

## Reference

- `ww-config.js` in this repo demonstrates `RawObject` for `data`/`options`, nested `TextSelect`, paired `wwEditor` blocks, and bindable scalars.
- `weweb-assets/ww-tabs/ww-config.js` and `weweb-assets/ww-dialog/ww-config.js` demonstrate the `actions` array.
- `weweb-assets/ww-datagrid-ag/ww-config.js` demonstrates `RawObject` for complex library configs.
