import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WwElement from '../../src/wwElement.vue';

function mountElement(content = { type: 'bar', data: {}, options: {} }) {
    return mount(WwElement, {
        props: { uid: 'test', content, wwEditorState: { isEditing: false } },
        attachTo: document.body,
    });
}

function fakeEvent({ clientX = 100, clientY = 50, rectLeft = 10, rectTop = 5 } = {}) {
    return {
        native: {
            clientX,
            clientY,
            target: { getBoundingClientRect: () => ({ left: rectLeft, top: rectTop }) },
        },
    };
}

describe('buildEventPayload', () => {
    it('computes position relative to the canvas rect', () => {
        const w = mountElement();
        const chart = {
            options: { interaction: {} },
            getElementsAtEventForMode: () => [],
            data: { datasets: [], labels: [] },
            scales: {},
        };
        const payload = w.vm.buildEventPayload(fakeEvent({ clientX: 100, clientY: 50, rectLeft: 10, rectTop: 5 }), [], chart);
        expect(payload.position).toEqual({ x: 90, y: 45 });
        w.unmount();
    });

    it('maps points to {datasetLabel, label, value, index, datasetIndex}', () => {
        const w = mountElement();
        const chart = {
            options: { interaction: {} },
            getElementsAtEventForMode: () => [
                { datasetIndex: 0, index: 2 },
                { datasetIndex: 1, index: 0 },
            ],
            data: {
                datasets: [
                    { label: 'Sales', data: [10, 20, 30] },
                    { label: 'Forecast', data: [11, 22, 33] },
                ],
                labels: ['Jan', 'Feb', 'Mar'],
            },
            scales: {},
        };
        const payload = w.vm.buildEventPayload(fakeEvent(), [], chart);
        expect(payload.points).toEqual([
            { datasetLabel: 'Sales',    label: 'Mar', value: 30, index: 2, datasetIndex: 0 },
            { datasetLabel: 'Forecast', label: 'Jan', value: 11, index: 0, datasetIndex: 1 },
        ]);
        w.unmount();
    });

    it('returns dataX=null and dataY=null when chart has no scale getters (pie/doughnut/radar)', () => {
        const w = mountElement();
        const chart = {
            options: { interaction: {} },
            getElementsAtEventForMode: () => [],
            data: { datasets: [], labels: [] },
            scales: {},
        };
        const payload = w.vm.buildEventPayload(fakeEvent(), [], chart);
        expect(payload.dataX).toBeNull();
        expect(payload.dataY).toBeNull();
        w.unmount();
    });

    it('reads dataX and dataY from scale.getValueForPixel when available', () => {
        const w = mountElement();
        const chart = {
            options: { interaction: {} },
            getElementsAtEventForMode: () => [],
            data: { datasets: [], labels: [] },
            scales: {
                x: { getValueForPixel: (px) => px * 2 },
                y: { getValueForPixel: (px) => px + 1 },
            },
        };
        const payload = w.vm.buildEventPayload(
            fakeEvent({ clientX: 110, clientY: 30, rectLeft: 10, rectTop: 5 }),
            [],
            chart,
        );
        expect(payload.position).toEqual({ x: 100, y: 25 });
        expect(payload.dataX).toBe(200);
        expect(payload.dataY).toBe(26);
        w.unmount();
    });
});
