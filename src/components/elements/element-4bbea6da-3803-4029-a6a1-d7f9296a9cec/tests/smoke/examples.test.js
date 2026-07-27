import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import WwElement from '../../src/wwElement.vue';
import { examples } from '../fixtures/examples.js';

describe.each(examples)('Example #$id: $title', (ex) => {
    let errorSpy;
    let warnSpy;

    beforeEach(() => {
        errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        errorSpy.mockRestore();
        warnSpy.mockRestore();
    });

    it('initializes and updates Chart.js without errors', async () => {
        const wrapper = mount(WwElement, {
            props: {
                uid: `test-${ex.id}`,
                content: {
                    type: ex.type,
                    data: ex.data,
                    options: ex.options,
                    ...ex.plugins,
                },
                wwEditorState: { isEditing: false },
            },
            attachTo: document.body,
        });

        // initChart() runs in $nextTick(() => ...) inside mounted
        await flushPromises();

        const instance = wrapper.vm.chartInstance;
        expect(instance, `chartInstance should be set after init for example #${ex.id}`).toBeTruthy();
        expect(instance.config.type).toBe(ex.type);
        // ctx is null only when context acquisition failed (Chart.js logs and degrades silently).
        expect(instance.ctx, `chart.ctx should be set — canvas context acquired`).toBeTruthy();

        // Trigger the deep `content.options` watcher path — exercises chart.update() too,
        // which is where some plugin-resolver bugs surface (after init, during update).
        await wrapper.setProps({
            content: {
                type: ex.type,
                data: ex.data,
                options: { ...ex.options },
                ...ex.plugins,
            },
        });
        await flushPromises();

        // No error or "failed to ..." message should have been logged. The component swallows
        // some errors via try/catch, so console.error spying is what catches regressions like
        // the setContext / borderCapStyle plugin-resolver bugs.
        const errorCalls = errorSpy.mock.calls.map(args => args.join(' '));
        const failureLogs = errorCalls.filter(s => /Failed to|update failed|Error/i.test(s));
        expect(failureLogs, `unexpected console.error during example #${ex.id}: ${failureLogs.join(' | ')}`).toEqual([]);

        // For each enabled plugin, assert it actually attached to the chart.
        // Catches the silent failure where a plugin isn't registered globally and isn't
        // in the inline plugins array — the chart would init cleanly but the plugin's
        // user-bound options would be ignored.
        // Chart.js v4 caches active plugin descriptors at _plugins._init after the
        // first install pass — that's where we read the active plugin list from.
        const activePluginIds = (instance._plugins?._init || []).map(d => d.plugin.id);
        if (ex.plugins.enableAnnotation) {
            expect(activePluginIds, `annotation plugin should be active for #${ex.id}`).toContain('annotation');
        }
        if (ex.plugins.enableDatalabels) {
            expect(activePluginIds, `datalabels plugin should be active for #${ex.id}`).toContain('datalabels');
        }
        if (ex.plugins.enableZoom) {
            expect(activePluginIds, `zoom plugin should be active for #${ex.id}`).toContain('zoom');
        }

        wrapper.unmount();
    });
});
