import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WwElement from '../../src/wwElement.vue';

function mountElement({ content, isEditing = false }) {
    return mount(WwElement, {
        props: {
            uid: 'test-uid',
            content,
            wwEditorState: { isEditing },
        },
        attachTo: document.body,
    });
}

describe('mergedOptions computed', () => {
    it('merges responsive defaults in front of user options', () => {
        const w = mountElement({ content: { type: 'bar', data: {}, options: { aspectRatio: 2 } } });
        const merged = w.vm.mergedOptions;
        expect(merged.responsive).toBe(true);
        expect(merged.maintainAspectRatio).toBe(false);
        expect(merged.aspectRatio).toBe(2);
        w.unmount();
    });

    it('lets user options override defaults via spread order', () => {
        const w = mountElement({
            content: { type: 'bar', data: {}, options: { responsive: false, maintainAspectRatio: true } },
        });
        const merged = w.vm.mergedOptions;
        expect(merged.responsive).toBe(false);
        expect(merged.maintainAspectRatio).toBe(true);
        w.unmount();
    });

    it('injects animation:false when isEditing is true', () => {
        const w = mountElement({
            content: { type: 'bar', data: {}, options: { animation: { duration: 1000 } } },
            isEditing: true,
        });
        expect(w.vm.mergedOptions.animation).toBe(false);
        w.unmount();
    });

    it('keeps user animation when not in editor mode', () => {
        const w = mountElement({
            content: { type: 'bar', data: {}, options: { animation: { duration: 1000 } } },
            isEditing: false,
        });
        expect(w.vm.mergedOptions.animation).toEqual({ duration: 1000 });
        w.unmount();
    });

    it('always provides onClick and onHover wrapping the user handlers', () => {
        let userClicks = 0;
        let userHovers = 0;
        const w = mountElement({
            content: {
                type: 'bar',
                data: {},
                options: {
                    onClick: () => { userClicks += 1; },
                    onHover: () => { userHovers += 1; },
                },
            },
        });
        const merged = w.vm.mergedOptions;
        expect(typeof merged.onClick).toBe('function');
        expect(typeof merged.onHover).toBe('function');

        // The wrapped onClick should call the user handler. We pass a chart stub
        // that makes the internal handler exit early (no points → no emit).
        const chartStub = {
            options: { interaction: {} },
            getElementsAtEventForMode: () => [],
            data: { datasets: [], labels: [] },
            scales: {},
        };
        merged.onClick({ native: { target: { getBoundingClientRect: () => ({ left: 0, top: 0 }) } } }, [], chartStub);
        merged.onHover({ native: { target: { getBoundingClientRect: () => ({ left: 0, top: 0 }) } } }, [], chartStub);
        expect(userClicks).toBe(1);
        expect(userHovers).toBe(1);
        w.unmount();
    });
});

describe('per-instance plugin gating via options.plugins', () => {
    it('disables all three plugins by setting them to false when toggles are off', () => {
        const w = mountElement({ content: { type: 'bar', data: {}, options: {} } });
        const plugins = w.vm.mergedOptions.plugins;
        expect(plugins.datalabels).toBe(false);
        expect(plugins.annotation).toBe(false);
        expect(plugins.zoom).toBe(false);
        w.unmount();
    });

    it('keeps user plugin options when toggle is on', () => {
        const w = mountElement({
            content: {
                type: 'bar',
                data: {},
                options: { plugins: { datalabels: { color: '#fff' }, annotation: { annotations: { x: { type: 'line' } } } } },
                enableDatalabels: true,
                enableAnnotation: true,
                enableZoom: false,
            },
        });
        const plugins = w.vm.mergedOptions.plugins;
        expect(plugins.datalabels).toEqual({ color: '#fff' });
        expect(plugins.annotation).toEqual({ annotations: { x: { type: 'line' } } });
        expect(plugins.zoom).toBe(false);
        w.unmount();
    });

    it('preserves unrelated user plugin entries (title, legend, etc.)', () => {
        const w = mountElement({
            content: {
                type: 'bar',
                data: {},
                options: { plugins: { title: { display: true, text: 'X' }, legend: { position: 'top' } } },
            },
        });
        const plugins = w.vm.mergedOptions.plugins;
        expect(plugins.title).toEqual({ display: true, text: 'X' });
        expect(plugins.legend).toEqual({ position: 'top' });
        w.unmount();
    });
});
