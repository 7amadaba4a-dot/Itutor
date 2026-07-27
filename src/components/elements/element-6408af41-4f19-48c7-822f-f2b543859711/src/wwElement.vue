<template>
<div class="despia-event-proxy" style="display: none; top: 0px; right: 0px;"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import defaultEvents from './events.json';
import defaultProperties from './properties.json';

export default {
props: {
uid: {
type: String,
required: true
},
content: {
type: Object,
required: true
},
},
emits: ['trigger-event'],
setup(props, { emit }) {
const isEditing = computed(() => {
// eslint-disable-next-line no-unreachable
return false;
});

// Parse events from the JSON configuration
const events = ref([]);
const properties = ref({});

const updateEvents = () => {
try {
events.value = props.content?.eventsConfig ? JSON.parse(props.content.eventsConfig) : defaultEvents;
} catch (e) {
console.error('Failed to parse events configuration:', e);
events.value = defaultEvents;
}
};

const updateProperties = () => {
try {
const propertiesConfig = props.content?.propertiesConfig ? JSON.parse(props.content.propertiesConfig) : defaultProperties;

// Create a properties object with values from content
const propertiesObj = {};
propertiesConfig.forEach(prop => {
const propName = prop.name;
// Use content property value if available, otherwise use default value from properties.json
propertiesObj[propName] = props.content?.[propName] !== undefined ? props.content[propName] : prop.defaultValue;
});

properties.value = propertiesObj;

// Update the bridge to runtime.js
updateRuntimeBridge();
} catch (e) {
console.error('Failed to parse properties configuration:', e);
properties.value = {};
}
};

// Watch for changes in the events configuration
watch(() => props.content?.eventsConfig, updateEvents, { immediate: true });

// Watch for changes in the properties configuration
watch(() => props.content?.propertiesConfig, updateProperties, { immediate: true });

// Watch for changes in individual property values
watch(() => props.content, (newContent) => {
if (!newContent) return;

try {
const propertiesConfig = props.content?.propertiesConfig ? JSON.parse(props.content.propertiesConfig) : defaultProperties;

// Check if any property values have changed
let hasChanges = false;
propertiesConfig.forEach(prop => {
const propName = prop.name;
if (newContent[propName] !== undefined && properties.value[propName] !== newContent[propName]) {
properties.value[propName] = newContent[propName];
hasChanges = true;
}
});

// Update the bridge if any properties changed
if (hasChanges) {
updateRuntimeBridge();
}
} catch (e) {
console.error('Failed to update properties:', e);
}
}, { deep: true });

// Create a bridge to make properties accessible in runtime.js
const updateRuntimeBridge = () => {
if (isEditing.value) return;

const win = wwLib.getFrontWindow();
if (!win) return;

// Create or update the despiaProperties object in the window
win.despiaProperties = { ...properties.value };

// Dispatch an event to notify runtime.js that properties have been updated
const event = new CustomEvent('despia-properties-updated', {
detail: { properties: win.despiaProperties }
});
win.document.dispatchEvent(event);
};

// Setup global custom event handler
onMounted(() => {
// Define the global customEvent and despiaEventProxy functions
const win = wwLib.getFrontWindow();

// Create a single implementation that both functions will reference
const triggerEvent = (name, data) => {
// Create a custom event
const customEvent = new CustomEvent('despia-custom-event', {
detail: { name, data }
});

// Dispatch on document only once
win.document.dispatchEvent(customEvent);

console.log(`Despia Event Proxy: Event "${name}" dispatched`, data);
return true;
};

// Assign both functions to reference the same implementation
win.customEvent = triggerEvent;
win.despiaEventProxy = triggerEvent;

// Initialize properties bridge
updateProperties();

// Execute runtime JavaScript
executeRuntimeJs();

// Add event listener for custom events - only need one listener
const doc = wwLib.getFrontDocument();
doc.addEventListener('despia-custom-event', handleCustomEvent);

console.log('Despia Event Proxy: Event listeners registered');
});

// Event handler function
const handleCustomEvent = (event) => {
if (isEditing.value) return;

const eventName = event.detail?.name;
const eventData = event.detail?.data;

if (!eventName) return;

// Check if this event is defined in our configuration
const eventConfig = events.value.find(e => e.name === eventName);

if (eventConfig) {
console.log(`Despia Event Proxy: Received event "${eventName}"`, eventData);
emit('trigger-event', {
name: eventName,
event: { value: eventData }
});
} else {
console.warn(`Despia Event Proxy: Received undefined event "${eventName}"`);
}
};

// Execute runtime JavaScript
const executeRuntimeJs = () => {
if (isEditing.value) return;

const runtimeJs = props.content?.runtimeJs;
if (!runtimeJs) return;

try {
const win = wwLib.getFrontWindow();
const doc = wwLib.getFrontDocument();

// Make sure properties bridge is set up before executing runtime JS
updateRuntimeBridge();

// Create a new Function to execute the runtime JS in the global scope
const scriptFn = new Function('window', 'document', 'properties', runtimeJs);
scriptFn(win, doc, win.despiaProperties);
} catch (e) {
console.error('Failed to execute runtime JavaScript:', e);
}
};

// Clean up event listeners
onUnmounted(() => {
const doc = wwLib.getFrontDocument();
doc.removeEventListener('despia-custom-event', handleCustomEvent);

// Remove the global functions and properties
const win = wwLib.getFrontWindow();
if (win.customEvent) {
win.customEvent = undefined;
}
if (win.despiaEventProxy) {
win.despiaEventProxy = undefined;
}
if (win.despiaProperties) {
win.despiaProperties = undefined;
}
});

return {
events,
properties
};
}
};
</script>