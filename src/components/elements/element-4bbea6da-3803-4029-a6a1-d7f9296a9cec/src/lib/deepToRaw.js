import { toRaw, isProxy } from 'vue';

// Recursively unwrap Vue reactive Proxies while preserving function references.
// Required for Chart.js's scriptable-option resolver (used by chartjs-plugin-annotation),
// which calls `.setContext()` on user options — that method only attaches when Chart.js
// wraps a plain JS object, never a Proxy. RawObject strips the WeWeb-level Proxy, but
// Vue 3 component reactivity re-wraps nested objects when read through `this.content`.
// See docs/pitfalls.md § 2.
export function deepToRaw(value, seen = new WeakSet()) {
    if (Array.isArray(value)) return value.map(item => deepToRaw(item, seen));
    if (value !== null && typeof value === 'object') {
        const raw = isProxy(value) ? toRaw(value) : value;
        if (seen.has(raw)) return raw;
        seen.add(raw);
        const out = {};
        for (const key of Object.keys(raw)) out[key] = deepToRaw(raw[key], seen);
        return out;
    }
    return value;
}
