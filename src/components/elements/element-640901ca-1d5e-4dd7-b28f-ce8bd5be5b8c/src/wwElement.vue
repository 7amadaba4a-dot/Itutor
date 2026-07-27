<template>
    <div class="avail-root" @mouseup="endPaint" @mouseleave="endPaint" @touchend="endPaint">
        <div class="avail-toolbar">
            <button type="button" class="avail-clear-btn" @click="clearAll">Clear all</button>
            <span class="avail-hint">Click, or click and drag, to select the times you're available — or use "All day" under a day's name</span>
        </div>
        <div class="avail-scroll">
            <div class="avail-grid" :style="gridStyle">
                <div class="avail-corner"></div>
                <div v-for="(name, d) in dayNames" :key="'h-' + d" class="avail-day-header">
                    <span>{{ name }}</span>
                    <button type="button" class="avail-allday-btn" @click="selectWholeDay(d)">All day</button>
                </div>

                <template v-for="(row, r) in rows" :key="'row-' + r">
                    <div class="avail-time-label" :class="{ 'avail-time-hour': row.isHour }">
                        {{ row.isHour ? row.label : '' }}
                    </div>
                    <div
                        v-for="(name, d) in dayNames"
                        :key="'cell-' + d + '-' + r"
                        class="avail-cell"
                        :class="{ 'avail-cell-on': isSelected(d, r), 'avail-cell-hour-start': row.isHour }"
                        :data-day="d"
                        :data-row="r"
                        @mousedown.prevent="startPaint(d, r)"
                        @mouseenter="overPaint(d, r)"
                        @touchstart.prevent="startPaint(d, r)"
                        @touchmove.prevent="onTouchMove"
                    ></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const isEditing = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const { setValue: setSelectedSlots } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'selectedSlots',
            type: 'array',
            defaultValue: [],
        });

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const startHour = computed(() => {
            const v = Number(props.content?.startHour);
            return Number.isFinite(v) ? Math.min(Math.max(v, 0), 23) : 6;
        });
        const endHour = computed(() => {
            const v = Number(props.content?.endHour);
            return Number.isFinite(v) ? Math.min(Math.max(v, startHour.value + 1), 24) : 23;
        });

        const rows = computed(() => {
            const list = [];
            const total = (endHour.value - startHour.value) * 2;
            for (let r = 0; r < total; r++) {
                const totalMinutes = startHour.value * 60 + r * 30;
                const hh = Math.floor(totalMinutes / 60);
                const mm = totalMinutes % 60;
                const isHour = mm === 0;
                const h12 = hh % 12 === 0 ? 12 : hh % 12;
                const ampm = hh < 12 ? 'AM' : 'PM';
                list.push({ isHour, label: `${h12} ${ampm}` });
            }
            return list;
        });

        const gridStyle = computed(() => ({
            gridTemplateColumns: `56px repeat(7, minmax(38px, 1fr))`,
            gridTemplateRows: `44px repeat(${rows.value.length}, 18px)`,
        }));

        // selection state: Set of "day-row" keys
        const selection = reactive(new Set());

        function cellKey(d, r) {
            return d + '-' + r;
        }
        function isSelected(d, r) {
            return selection.has(cellKey(d, r));
        }

        function timeStrFromRow(r) {
            const totalMinutes = startHour.value * 60 + r * 30;
            const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
            const mm = String(totalMinutes % 60).padStart(2, '0');
            return `${hh}:${mm}`;
        }

        function parseTimeToRow(timeStr) {
            const [h, m] = (timeStr || '00:00').split(':').map(Number);
            const totalMinutes = h * 60 + m;
            return Math.round((totalMinutes - startHour.value * 60) / 30);
        }

        function loadInitial() {
            selection.clear();
            const slots = Array.isArray(props.content?.initialSlots) ? props.content.initialSlots : [];
            slots.forEach((slot) => {
                const day = Number(slot.day_of_week);
                if (!Number.isFinite(day) || day < 0 || day > 6) return;
                const startRow = parseTimeToRow(slot.start_time);
                const endRow = parseTimeToRow(slot.end_time);
                for (let r = Math.max(0, startRow); r < Math.min(rows.value.length, endRow); r++) {
                    selection.add(cellKey(day, r));
                }
            });
        }

        function computeMergedSlots() {
            const result = [];
            for (let d = 0; d < 7; d++) {
                let runStart = null;
                for (let r = 0; r <= rows.value.length; r++) {
                    const on = r < rows.value.length && isSelected(d, r);
                    if (on && runStart === null) {
                        runStart = r;
                    } else if (!on && runStart !== null) {
                        result.push({
                            day_of_week: d,
                            start_time: timeStrFromRow(runStart),
                            end_time: timeStrFromRow(r),
                        });
                        runStart = null;
                    }
                }
            }
            return result;
        }

        function commitChange() {
            const merged = computeMergedSlots();
            setSelectedSlots(merged);
            emit('trigger-event', { name: 'change', event: { value: merged } });
        }

        // painting / drag-select
        const painting = reactive({ active: false, value: true });

        function startPaint(d, r) {
            if (isEditing.value) return;
            const key = cellKey(d, r);
            painting.active = true;
            painting.value = !selection.has(key);
            if (painting.value) selection.add(key);
            else selection.delete(key);
        }
        function overPaint(d, r) {
            if (isEditing.value || !painting.active) return;
            const key = cellKey(d, r);
            if (painting.value) selection.add(key);
            else selection.delete(key);
        }
        function onTouchMove(e) {
            if (isEditing.value || !painting.active) return;
            const touch = e.touches[0];
            const el = wwLib.getFrontDocument().elementFromPoint(touch.clientX, touch.clientY);
            if (el && el.dataset && el.dataset.day !== undefined && el.dataset.row !== undefined) {
                overPaint(Number(el.dataset.day), Number(el.dataset.row));
            }
        }
        function endPaint() {
            if (!painting.active) return;
            painting.active = false;
            commitChange();
        }

        function clearAll() {
            selection.clear();
            commitChange();
        }

        function selectWholeDay(d) {
            if (isEditing.value) return;
            for (let r = 0; r < rows.value.length; r++) {
                selection.add(cellKey(d, r));
            }
            commitChange();
        }

        loadInitial();
        watch(() => props.content?.initialSlots, loadInitial);

        return {
            dayNames,
            rows,
            gridStyle,
            isSelected,
            startPaint,
            overPaint,
            onTouchMove,
            endPaint,
            clearAll,
            selectWholeDay,
        };
    },
};
</script>

<style scoped>
.avail-root {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    user-select: none;
}
.avail-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}
.avail-hint {
    font-size: 12px;
    color: #64748b;
}
.avail-clear-btn {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #334155;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
.avail-clear-btn:hover {
    background: #f1f5f9;
}
.avail-scroll {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 8px;
    background: #fff;
}
.avail-grid {
    display: grid;
    gap: 2px;
    min-width: 480px;
}
.avail-corner {
    grid-column: 1;
    grid-row: 1;
}
.avail-day-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
}
.avail-allday-btn {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #0d9488;
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    line-height: 1.4;
    white-space: nowrap;
}
.avail-allday-btn:hover {
    background: #0d9488;
    color: #fff;
    border-color: #0d9488;
}
.avail-time-label {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding-right: 6px;
    font-size: 10px;
    color: #94a3b8;
    transform: translateY(-6px);
}
.avail-cell {
    background: #f1f5f9;
    border-radius: 3px;
    cursor: pointer;
    border-top: 1px solid transparent;
}
.avail-cell-hour-start {
    border-top: 1px solid #e2e8f0;
}
.avail-cell:hover {
    background: #cbd5e1;
}
.avail-cell-on {
    background: #0d9488;
}
.avail-cell-on:hover {
    background: #14b8a6;
}
</style>
