# Dropzone implementation pattern

> Reference doc preserved from the previous CLAUDE.md. Not loaded into Claude's context unless explicitly opened. Use when building a WeWeb component that should let users drag-and-drop other elements inside it. This component (`ww-chartjs`) does **not** use a dropzone.

Dropzones allow users to drag and drop any WeWeb elements into your component, creating flexible and interactive UIs.

## Mandatory configuration pattern

### Step 1: Add hidden array property in `ww-config.js`

```javascript
properties: {
  // Dropzone property — MUST be hidden array
  dropzoneContent: {
    hidden: true,
    defaultValue: [],
    /* wwEditor:start */
    bindingValidation: {
      type: 'array',
      tooltip: 'Array of elements to display in dropzone'
    },
    /* wwEditor:end */
  },

  // Optional: toggle to show/hide dropzone
  showDropzone: {
    label: { en: 'Show Dropzone' },
    type: 'OnOff',
    section: 'settings',
    defaultValue: true,
    bindable: true,
    /* wwEditor:start */
    bindingValidation: {
      type: 'boolean',
      tooltip: 'Show/hide the dropzone area'
    },
    propertyHelp: 'Toggle the dropzone where users can drop elements'
    /* wwEditor:end */
  },

  // Dropzone styling options
  dropzoneHeight: {
    label: { en: 'Dropzone Height' },
    type: 'Length',
    section: 'style',
    defaultValue: '80px',
    bindable: true,
    hidden: content => !content?.showDropzone,
  },

  dropzoneBackground: {
    label: { en: 'Dropzone Background' },
    type: 'Color',
    section: 'style',
    defaultValue: '#f9f9f9',
    bindable: true,
    hidden: content => !content?.showDropzone,
  },
}
```

### Step 2: Implement `wwLayout` in Vue template

```vue
<template>
  <div class="component-wrapper">
    <!-- Main component content -->
    <div class="main-content">
      <!-- Your component's primary functionality -->
    </div>

    <!-- Dropzone area -->
    <div
      v-if="content?.showDropzone"
      class="dropzone-area"
      :style="dropzoneStyle"
    >
      <!-- Optional: contextual info -->
      <div class="dropzone-info" v-if="someCondition">
        <span class="info-display">{{ someData }}</span>
      </div>

      <!-- CRITICAL: wwLayout component for dropzone -->
      <wwLayout
        path="dropzoneContent"
        direction="row"
        class="dropzone-container"
      />
    </div>
  </div>
</template>
```

### Step 3: Add computed styles and watchers

```javascript
const dropzoneStyle = computed(() => ({
  '--dropzone-height': props.content?.dropzoneHeight || '80px',
  '--dropzone-background': props.content?.dropzoneBackground || '#f9f9f9',
  '--dropzone-border': props.content?.showBorder ? `1px solid ${props.content?.borderColor}` : 'none',
}))

watch(
  () => [
    props.content?.showDropzone,
    props.content?.dropzoneHeight,
    props.content?.dropzoneBackground,
  ],
  () => { /* style changes handled via computed */ },
  { deep: true }
)
```

### Step 4: Professional dropzone styling

```scss
.dropzone-area {
  height: var(--dropzone-height);
  background: var(--dropzone-background);
  border: var(--dropzone-border);
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 16px;
}

.dropzone-container {
  flex: 1;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d0d0d0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
  position: relative;
}

/* Placeholder text when empty */
.dropzone-container:empty::after {
  content: 'Drop content here';
  color: #999;
  font-size: 14px;
  font-style: italic;
  text-align: center;
  pointer-events: none;
}

/* wwEditor:start */
.dropzone-container:hover {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.05);
}
/* wwEditor:end */

/* When dropzone has content */
.dropzone-container:not(:empty) {
  border-style: solid;
  border-color: transparent;
  background: transparent;
  justify-content: flex-start;
  padding: 8px;
}

.dropzone-container:not(:empty)::after {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .dropzone-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }

  .dropzone-container {
    width: 100%;
  }
}
```

## Critical requirements

1. **Hidden array property** — MUST be `hidden: true` with `defaultValue: []`.
2. **`wwLayout` component** — MUST use `<wwLayout path="propertyName" />`.
3. **Direction attribute** — `direction="row"` or `direction="column"`.
4. **Minimum dimensions** — dropzone MUST have `min-width` and `min-height` for usability.
5. **Visual feedback** — dashed border + hover effects.

## Common use cases

```javascript
// Flexible content sections
contentDropzone: { hidden: true, defaultValue: [] }

// Buttons / interactive elements
actionsDropzone: { hidden: true, defaultValue: [] }

// Content shown when an item is selected/active
selectedItemContent: { hidden: true, defaultValue: [] }
```

## Advanced: bindable (repeatable) dropzones

```javascript
dropzoneItems: {
  hidden: true,
  bindable: 'repeatable',  // makes wwLayout repeat its content per bound-item
  defaultValue: []
}
```

`bindable: 'repeatable'` makes `wwLayout` repeat its content for each item in bound collections, setting binding context for each item.

## Example component shapes

- Card builder: main content + action buttons dropzone
- Dashboard widget: data display + configuration controls dropzone
- Form builder: form fields + submit actions dropzone
- Content showcase: featured content + related items dropzone
- Interactive timeline: event content + additional details dropzone
