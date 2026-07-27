<template>
    <div class="bcal-root">
        <div class="bcal-banner">
            <span class="bcal-banner-icon">ⓘ</span>
            <span>Choose one or more times for your lesson(s). Times are shown in your local timezone ({{ viewerTz }}). Tap a time to select it, tap again to deselect.</span>
        </div>

        <div class="bcal-nav-row">
            <div class="bcal-nav-group">
                <div class="bcal-nav-arrows">
                    <button
                        type="button"
                        class="bcal-arrow"
                        :class="{ 'bcal-arrow-disabled': weekOffset <= 0 }"
                        :disabled="weekOffset <= 0"
                        @click="prevWeek"
                    >‹</button>
                    <button type="button" class="bcal-arrow" @click="nextWeek">›</button>
                </div>
                <span class="bcal-range-label">{{ rangeLabel }}</span>
            </div>
            <div class="bcal-tz-badge">🌐 {{ viewerTz }}</div>
        </div>

        <div class="bcal-grid">
            <div v-for="day in days" :key="day.dateStr" class="bcal-col">
                <div class="bcal-col-header" :class="{ 'bcal-col-header-active': day.items.length }">
                    <div class="bcal-day-name">{{ day.dayLabel }}</div>
                    <div class="bcal-day-num">{{ day.dateLabel }}</div>
                </div>
                <div class="bcal-slots">
                    <button
                        v-for="item in day.items"
                        :key="item.utcIso"
                        type="button"
                        class="bcal-slot-btn"
                        :class="{ 'bcal-slot-btn-selected': selectedSet.has(item.utcIso) }"
                        @click="onSelect(item)"
                    ><span class="bcal-slot-btn-text">{{ item.time }}</span></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const { value: weekOffsetVar, setValue: setWeekOffset } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'weekOffset',
            type: 'number',
            defaultValue: 0,
        });

        const viewerTz = (() => {
            try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'UTC'; }
        })();

        const selectedSet = computed(() => new Set(Array.isArray(props.content?.selectedSlots) ? props.content.selectedSlots : []));

        function getOffsetMinutes(date, timeZone) {
            const dtf = new Intl.DateTimeFormat('en-US', {
                timeZone, hour12: false,
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
            });
            const parts = dtf.formatToParts(date);
            const map = {};
            parts.forEach((p) => { map[p.type] = p.value; });
            const asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour === 24 ? 0 : +map.hour, +map.minute, +map.second);
            return (asUTC - date.getTime()) / 60000;
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const weekOffset = computed(() => weekOffsetVar.value || 0);

        const days = computed(() => {
            const rawSlots = Array.isArray(props.content?.slots) ? props.content.slots : [];
            const teacherTz = props.content?.teacherTimezone || 'UTC';
            const bookedSet = new Set(Array.isArray(props.content?.bookedSlots) ? props.content.bookedSlots : []);
            const slotMinutes = Number(props.content?.slotMinutes) || 30;
            const offset = weekOffset.value;

            const grouped = {};
            for (let dOffset = -1; dOffset <= offset * 7 + 8; dOffset++) {
                const base = new Date();
                base.setDate(base.getDate() + dOffset);
                const y = base.getFullYear();
                const m = base.getMonth();
                const d = base.getDate();
                const dow = base.getDay();
                const matching = rawSlots.filter((s) => Number(s.day_of_week) === dow);

                matching.forEach((slot) => {
                    const [sh, sm] = (slot.start_time || '00:00').split(':').map(Number);
                    const [eh, em] = (slot.end_time || '00:00').split(':').map(Number);
                    let cur = sh * 60 + sm;
                    const end = eh * 60 + em;
                    while (cur + slotMinutes <= end) {
                        const naive = new Date(Date.UTC(y, m, d, Math.floor(cur / 60), cur % 60));
                        const offMin = getOffsetMinutes(naive, teacherTz);
                        const realUTC = new Date(naive.getTime() - offMin * 60000);
                        const utcIso = realUTC.toISOString().split('.')[0] + 'Z';

                        if (realUTC.getTime() > Date.now() && !bookedSet.has(utcIso)) {
                            const dtf = new Intl.DateTimeFormat('en-US', {
                                timeZone: viewerTz, hour12: false,
                                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
                            });
                            const parts = dtf.formatToParts(realUTC);
                            const map = {};
                            parts.forEach((p) => { map[p.type] = p.value; });
                            const viewerDateStr = `${map.year}-${map.month}-${map.day}`;
                            const viewerTimeStr = `${map.hour}:${map.minute}`;
                            if (!grouped[viewerDateStr]) grouped[viewerDateStr] = [];
                            grouped[viewerDateStr].push({ time: viewerTimeStr, utcIso });
                        }
                        cur += slotMinutes;
                    }
                });
            }

            let todayStr = '';
            try { todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: viewerTz }).format(new Date()); } catch (e) { todayStr = new Date().toISOString().split('T')[0]; }
            const [ty, tm, td] = todayStr.split('-').map(Number);
            const weekStart = new Date(ty, tm - 1, td);
            weekStart.setDate(weekStart.getDate() + offset * 7);

            const result = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart);
                d.setDate(d.getDate() + i);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                const items = (grouped[dateStr] || []);
                const seen = new Set();
                const uniqueItems = items
                    .filter((it) => { if (seen.has(it.utcIso)) return false; seen.add(it.utcIso); return true; })
                    .sort((a, b) => a.time.localeCompare(b.time));
                result.push({
                    dayLabel: dayNames[d.getDay()],
                    dateLabel: String(d.getDate()),
                    dateStr,
                    items: uniqueItems,
                });
            }
            return result;
        });

        const rangeLabel = computed(() => {
            if (!days.value.length) return '';
            const first = days.value[0];
            const last = days.value[days.value.length - 1];
            const [fy, fm, fd] = first.dateStr.split('-').map(Number);
            const [ly, lm, ld] = last.dateStr.split('-').map(Number);
            const startLabel = `${monthNames[fm - 1]} ${fd}`;
            const endLabel = `${fm !== lm ? monthNames[lm - 1] + ' ' : ''}${ld}, ${ly}`;
            return `${startLabel} – ${endLabel}`;
        });

        function prevWeek() {
            setWeekOffset(Math.max(0, weekOffset.value - 1));
        }
        function nextWeek() {
            setWeekOffset(Math.min(8, weekOffset.value + 1));
        }

        function onSelect(item) {
            emit('trigger-event', {
                name: 'select',
                event: { value: { utcIso: item.utcIso, displayTime: item.time } },
            });
        }

        return {
            viewerTz,
            days,
            rangeLabel,
            weekOffset,
            selectedSet,
            prevWeek,
            nextWeek,
            onSelect,
        };
    },
};
</script>

<style scoped>
.bcal-root {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: inherit;
    padding: 0 14px;
}
.bcal-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    border-radius: 14px;
    background: rgba(13, 148, 136, 0.08);
    color: #0f172a;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 20px;
}
.bcal-banner-icon {
    color: #0d9488;
    flex: 0 0 auto;
}
.bcal-nav-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 10px;
    width: 100%;
    margin-bottom: 16px;
}
.bcal-nav-group {
    display: flex;
    align-items: center;
    gap: 18px;
}
.bcal-nav-arrows {
    display: flex;
    background: #f1f5f9;
    border-radius: 999px;
    padding: 2px;
}
.bcal-arrow {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: 999px;
    cursor: pointer;
    font-size: 14px;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
}
.bcal-arrow:hover:not(.bcal-arrow-disabled) {
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
}
.bcal-arrow-disabled {
    color: #cbd5e1;
    cursor: not-allowed;
}
.bcal-range-label {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}
.bcal-tz-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    flex: 0 0 auto;
}
.bcal-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
}
.bcal-col {
    flex: 1 1 0%;
    min-width: 0;
    max-width: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
}
.bcal-col-header {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    padding-bottom: 8px;
    border-bottom: 3px solid #e2e8f0;
}
.bcal-col-header-active {
    border-bottom-color: #0d9488;
}
.bcal-day-name {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
    white-space: nowrap;
}
.bcal-col-header-active .bcal-day-name {
    color: #0f172a;
}
.bcal-day-num {
    font-size: 16px;
    font-weight: 700;
    color: #94a3b8;
    white-space: nowrap;
}
.bcal-col-header-active .bcal-day-num {
    color: #0f172a;
}
.bcal-slots {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 10px;
}
.bcal-slot-btn {
    width: 100%;
    box-sizing: border-box;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    cursor: pointer;
    padding: 9px 6px;
    font-size: 13px;
    font-weight: 700;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    transition: all 0.15s ease;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}
.bcal-slot-btn-text {
    display: block;
    width: 100%;
    text-align: center;
}
.bcal-slot-btn:hover {
    color: #ffffff;
    background: #0d9488;
    border-color: #0d9488;
}
.bcal-slot-btn-selected {
    color: #ffffff !important;
    background: #0d9488 !important;
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.25) !important;
}
</style>
