import { describe, it, expect } from 'vitest';
import { reactive, isProxy } from 'vue';
import { deepToRaw } from '../../src/lib/deepToRaw.js';

describe('deepToRaw', () => {
    it('passes primitives through unchanged', () => {
        expect(deepToRaw(42)).toBe(42);
        expect(deepToRaw('hello')).toBe('hello');
        expect(deepToRaw(null)).toBe(null);
        expect(deepToRaw(undefined)).toBe(undefined);
        expect(deepToRaw(true)).toBe(true);
    });

    it('preserves function references', () => {
        const fn = (ctx) => ctx.value * 2;
        expect(deepToRaw(fn)).toBe(fn);
    });

    it('unwraps a top-level reactive object', () => {
        const r = reactive({ a: 1, b: 2 });
        expect(isProxy(r)).toBe(true);
        const raw = deepToRaw(r);
        expect(isProxy(raw)).toBe(false);
        expect(raw).toEqual({ a: 1, b: 2 });
    });

    it('unwraps nested reactive objects recursively', () => {
        const r = reactive({
            outer: {
                inner: { value: 5 },
                list: [{ x: 1 }, { x: 2 }],
            },
        });
        const raw = deepToRaw(r);
        expect(isProxy(raw)).toBe(false);
        expect(isProxy(raw.outer)).toBe(false);
        expect(isProxy(raw.outer.inner)).toBe(false);
        expect(isProxy(raw.outer.list[0])).toBe(false);
        expect(raw).toEqual({ outer: { inner: { value: 5 }, list: [{ x: 1 }, { x: 2 }] } });
    });

    it('preserves functions inside reactive trees (scriptable options)', () => {
        const colorFn = (ctx) => `hsl(${ctx.dataIndex}deg, 50%, 50%)`;
        const r = reactive({
            plugins: {
                annotation: {
                    annotations: {
                        target: { borderColor: colorFn, value: 100 },
                    },
                },
            },
        });
        const raw = deepToRaw(r);
        expect(raw.plugins.annotation.annotations.target.borderColor).toBe(colorFn);
        expect(raw.plugins.annotation.annotations.target.value).toBe(100);
    });

    it('handles arrays of reactive objects', () => {
        const datasets = reactive([{ data: [1, 2, 3] }, { data: [4, 5, 6] }]);
        const raw = deepToRaw(datasets);
        expect(Array.isArray(raw)).toBe(true);
        expect(raw).toEqual([{ data: [1, 2, 3] }, { data: [4, 5, 6] }]);
        expect(isProxy(raw[0])).toBe(false);
    });

    it('returns a fresh object — does not share refs with the source', () => {
        const r = reactive({ nested: { value: 1 } });
        const raw = deepToRaw(r);
        raw.nested.value = 99;
        expect(r.nested.value).toBe(1);
    });
});
