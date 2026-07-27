<template>
    <div ref="containerRef" class="ww-chartjs"></div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { deepToRaw } from './lib/deepToRaw.js';

// Plugins are registered globally so their `afterRegister` hook fires —
// chartjs-plugin-annotation requires this to register its element types
// (line / box / label annotations). Inline `plugins: [...]` per-chart skips that hook
// and the option resolver then trips on missing element defaults.
// Per-instance behavior is preserved by gating plugin OPTIONS via `enableX` toggles
// (Chart.js convention: `options.plugins.X = false` disables a plugin for one chart).
// Plugins are registered globally so their `afterRegister` hook fires —
// chartjs-plugin-annotation requires this to register its element types
// (line / box / label annotations). Inline `plugins: [...]` per-chart skips that hook
// and the option resolver then trips on missing element defaults.
// Per-instance behavior is preserved by gating plugin OPTIONS via `enableX` toggles
// (Chart.js convention: `options.plugins.X = false` disables a plugin for one chart).
Chart.register(...registerables, ChartDataLabels, annotationPlugin, zoomPlugin);

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props) {
        const { value: lastClickedPoint, setValue: setLastClickedPoint } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'lastClickedPoint',
            type: 'object',
            defaultValue: null,
        });
        const { value: isReady, setValue: setIsReady } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'isReady',
            type: 'boolean',
            defaultValue: false,
        });
        return { lastClickedPoint, setLastClickedPoint, isReady, setIsReady };
    },
    data() {
        return {
            chartInstance: null,
            canvasEl: null,
            recreatePending: false,
            chartInitialized: false,
        };
    },
    computed: {
        isEditorMode() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        chartType() {
            return this.content?.type || 'bar';
        },
        chartData() {
            const data = this.content?.data;
            if (!data || typeof data !== 'object') return { labels: [], datasets: [] };
            const raw = deepToRaw(data);
            return {
                labels: Array.isArray(raw.labels) ? raw.labels : [],
                datasets: Array.isArray(raw.datasets) ? raw.datasets : [],
            };
        },
        mergedOptions() {
            const rawUserOptions = this.content?.options;
            const userOptions = (rawUserOptions && typeof rawUserOptions === 'object') ? deepToRaw(rawUserOptions) : {};
            const userOnClick = typeof userOptions.onClick === 'function' ? userOptions.onClick : null;
            const userOnHover = typeof userOptions.onHover === 'function' ? userOptions.onHover : null;
            // Editor mode: disable Chart.js animations to avoid the singleton-Animator
            // race that fires during WeWeb's rapid mount/default-population cycles.
            // Production keeps Chart.js defaults so docs snippets behave as documented.
            const editorAnimationOverride = this.isEditorMode ? { animation: false } : {};
            // Per-instance plugin gating. Plugins are globally registered (so their
            // afterRegister hook fires — annotation needs it for element-type defaults).
            // Toggles set `options.plugins.X = false` to disable a plugin for THIS chart.
            const userPlugins = (userOptions.plugins && typeof userOptions.plugins === 'object') ? userOptions.plugins : {};
            const pluginGates = {};
            if (!this.content?.enableDatalabels) pluginGates.datalabels = false;
            if (!this.content?.enableAnnotation) pluginGates.annotation = false;
            if (!this.content?.enableZoom) pluginGates.zoom = false;
            const rawMerged = { ...userPlugins, ...pluginGates };
            const mergedPlugins = Object.fromEntries(
                Object.entries(rawMerged).map(([k, v]) => [k, v === null || v === undefined ? false : v])
            );
            return {
                responsive: true,
                maintainAspectRatio: false,
                ...userOptions,
                plugins: mergedPlugins,
                ...editorAnimationOverride,
                onClick: (event, elements, chart) => {
                    if (userOnClick) {
                        try { userOnClick(event, elements, chart); } catch (e) { /* user handler error swallowed to keep chart alive */ }
                    }
                    this.handleChartClick(event, elements, chart);
                },
                onHover: (event, elements, chart) => {
                    if (userOnHover) {
                        try { userOnHover(event, elements, chart); } catch (e) { /* user handler error swallowed */ }
                    }
                    this.handleChartHover(event, elements, chart);
                },
            };
        },
        chartConfig() {
            return {
                type: this.chartType,
                data: this.chartData,
                options: this.mergedOptions,
            };
        },
    },
    watch: {
        'content.type'() {
            this.recreateChart();
        },
        'content.enableDatalabels'() {
            this.recreateChart();
        },
        'content.enableAnnotation'() {
            this.recreateChart();
        },
        'content.enableZoom'() {
            this.recreateChart();
        },
        'content.data': {
            deep: true,
            handler() {
                if (!this.chartInstance || !this.chartInstance.ctx) {
                    if (this.chartInitialized) this.recreateChart();
                    return;
                }
                try {
                    this.chartInstance.data = this.chartData;
                    this.chartInstance.update();
                } catch (e) {
                    this.recreateChart();
                }
            },
        },
        'content.options': {
            deep: true,
            handler() {
                if (!this.chartInstance || !this.chartInstance.ctx) {
                    if (this.chartInitialized) this.recreateChart();
                    return;
                }
                try {
                    this.chartInstance.options = this.mergedOptions;
                    this.chartInstance.update();
                } catch (e) {
                    this.recreateChart();
                }
            },
        },
    },
    mounted() {
        this.$nextTick(() => this.initChart());
    },
    beforeUnmount() {
        this.destroyChart();
    },
    methods: {
        ensureCanvas() {
            const container = this.$refs.containerRef;
            if (!container) return null;
            // Create the canvas imperatively so Vue never patches it.
            // Chart.js fully owns this DOM node.
            if (!this.canvasEl || !container.contains(this.canvasEl)) {
                const doc = wwLib.getFrontDocument();
                const canvas = doc.createElement('canvas');
                canvas.className = 'ww-chartjs__canvas';
                container.appendChild(canvas);
                this.canvasEl = canvas;
            }
            return this.canvasEl;
        },
        initChart() {
            const canvas = this.ensureCanvas();
            if (!canvas) return;

            // Tear down any orphan instance still bound to this canvas (HMR, re-mount, hot reload)
            const orphan = Chart.getChart(canvas);
            if (orphan) {
                try { orphan.stop(); } catch (e) { /* noop */ }
                try { orphan.destroy(); } catch (e) { /* noop */ }
            }
            if (this.chartInstance) {
                try { this.chartInstance.stop(); } catch (e) { /* noop */ }
                try { this.chartInstance.destroy(); } catch (e) { /* noop */ }
                this.chartInstance = null;
            }

            try {
                this.chartInstance = new Chart(canvas, this.chartConfig);
                this.chartInitialized = true;
                this.setIsReady(true);
                this.$emit('trigger-event', { name: 'chart:ready', event: {} });
            } catch (err) {
                this.chartInitialized = true;
            }
        },
        destroyChart() {
            if (this.chartInstance) {
                try { this.chartInstance.stop(); } catch (e) { /* noop */ }
                try { this.chartInstance.destroy(); } catch (e) { /* noop */ }
                this.chartInstance = null;
            }
            if (this.canvasEl && this.canvasEl.parentNode) {
                try { this.canvasEl.parentNode.removeChild(this.canvasEl); } catch (e) { /* noop */ }
            }
            this.canvasEl = null;
            this.setIsReady(false);
        },
        recreateChart() {
            // Coalesce: if multiple watchers fire in the same tick (e.g. WeWeb populating
            // defaults right after drop), only schedule a single destroy+init.
            if (this.recreatePending) return;
            this.recreatePending = true;
            this.destroyChart();
            // requestAnimationFrame (not nextTick) lets any in-flight Chart.js animator
            // frame drain harmlessly before we instantiate the next chart.
            const win = wwLib.getFrontWindow();
            const schedule = win && typeof win.requestAnimationFrame === 'function'
                ? win.requestAnimationFrame.bind(win)
                : (cb) => setTimeout(cb, 16);
            schedule(() => {
                this.recreatePending = false;
                this.initChart();
            });
        },
        buildEventPayload(event, _elements, chart) {
            const native = event?.native;
            const rect = native?.target?.getBoundingClientRect?.();
            const position = rect && native
                ? { x: native.clientX - rect.left, y: native.clientY - rect.top }
                : { x: event?.x ?? 0, y: event?.y ?? 0 };

            const interactionMode = chart?.options?.interaction?.mode || 'nearest';
            const interactionIntersect = chart?.options?.interaction?.intersect ?? true;
            const rawPoints = chart?.getElementsAtEventForMode
                ? chart.getElementsAtEventForMode(native || event, interactionMode, { intersect: interactionIntersect }, true)
                : [];

            const points = rawPoints.map(p => {
                const dataset = chart?.data?.datasets?.[p.datasetIndex];
                const rawValue = dataset?.data?.[p.index];
                return {
                    datasetLabel: dataset?.label ?? null,
                    label: chart?.data?.labels?.[p.index] ?? null,
                    value: rawValue,
                    index: p.index,
                    datasetIndex: p.datasetIndex,
                };
            });

            let dataX = null;
            let dataY = null;
            if (chart?.scales?.x?.getValueForPixel) {
                dataX = chart.scales.x.getValueForPixel(position.x);
            }
            if (chart?.scales?.y?.getValueForPixel) {
                dataY = chart.scales.y.getValueForPixel(position.y);
            }

            return { position, points, dataX, dataY };
        },
        handleChartClick(event, elements, chart) {
            const payload = this.buildEventPayload(event, elements, chart);
            if (payload.points.length > 0) {
                this.setLastClickedPoint(payload.points[0]);
            }
            this.$emit('trigger-event', { name: 'chart:click', event: payload });
        },
        handleChartHover(event, elements, chart) {
            const payload = this.buildEventPayload(event, elements, chart);
            if (payload.points.length === 0) return;
            this.$emit('trigger-event', { name: 'chart:hover', event: payload });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-chartjs {
    position: relative;
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
}
</style>
