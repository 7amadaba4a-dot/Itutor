<template>
    <div class="fullcalendar-wrapper modern-buttons" :style="calendarStyles">
        <FullCalendar ref="fullCalendarRef" :key="calendarKey" :options="calendarOptions"></FullCalendar>
    </div>
</template>

<script>
    import { useTemplateRef, computed, watch, ref, watchEffect, onMounted, onUnmounted, nextTick } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import luxonPlugin from '@fullcalendar/luxon3';

export default {
    components: {
        FullCalendar,
    },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },

    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const fullCalendarRef = useTemplateRef(null);
        const { getIcon } = wwLib.useIcons();
        
        // Store for event icons
        const eventIcons = ref(new Map());
        const iconsLoaded = ref(false);
        const calendarInitialized = ref(false);

        // ⭐ إضافة متغيرات جديدة للإسكرول التلقائي
        const dragScrollInterval = ref(null);
        const isDragging = ref(false);
        const dragScrollSpeed = ref(15);
        const lastMouseY = ref(0);
        const scrollThreshold = 50;

        // Editor state
        const isEditing = computed(() => {

            return false;
        });

        // Internal variables
        const { value: currentView, setValue: setCurrentView } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentView',
            type: 'string',
            defaultValue: computed(() => props.content.defaultView || 'dayGridMonth'),
        });

        const { value: selectedEvent, setValue: setSelectedEvent } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'selectedEvent',
            type: 'object',
            defaultValue: null,
        });

        // Computed key to force remount when defaultView changes
        const calendarKey = computed(() => {
            return `calendar-${props.content?.defaultView || 'dayGridMonth'}-${props.content?.cellHeight || 'auto'}-${iconsLoaded.value}`;
        });

        // ⭐ يتحقق إذا كانت القيمة SVG خام (بدل ما تكون اسم أيقونة من مجموعة أيقونات زي phosphor-fill/xxx)
        const isRawSvg = (value) => typeof value === 'string' && value.trim().toLowerCase().startsWith('<svg');

        // ⭐ دالة تحميل الأيقونات - محسنة (بتدعم دلوقتي SVG خام أو اسم أيقونة من مجموعة أيقونات)
        const loadIcon = async (iconName) => {
            if (!iconName) return null;

            // ⭐ لو القيمة SVG خام (تبدأ بـ <svg)، استخدمها زي ما هي من غير ما نبحث عنها في أي icon set
            if (isRawSvg(iconName)) {
                console.log('Using raw SVG markup directly (no icon-set lookup needed)');
                return { svg: iconName, isRaw: true };
            }
            
            try {
                console.log('Loading icon:', iconName);
                const iconSvg = await getIcon(iconName);
                console.log('Icon loaded successfully:', iconName);
                return { svg: iconSvg, isRaw: false };
            } catch (error) {
                console.warn(`Icon not found: ${iconName}`, error);
                return null;
            }
        };

        // ⭐ تحميل كل الأيقونات - الإصدار المحسن
        const loadAllIcons = async () => {
            console.log('Starting to load all icons...');
            const events = props.content?.events || [];
            const uniqueIcons = new Set();
            
            // جمع كل الأيقونات الفريدة من الأحداث
            events.forEach(event => {
                const iconName = event.icon;
                if (iconName && iconName.trim() !== '' && !eventIcons.value.has(iconName)) {
                    uniqueIcons.add(iconName);
                    console.log('Found icon in event:', iconName);
                }
            });
            
            // تحميل الأيقونة العامة إذا كانت موجودة
            if (props.content?.eventIconType && props.content.eventIconType.trim() !== '' && !eventIcons.value.has(props.content.eventIconType)) {
                uniqueIcons.add(props.content.eventIconType);
                console.log('Found global icon:', props.content.eventIconType);
            }
            
            console.log('Unique icons to load:', Array.from(uniqueIcons));
            
            if (uniqueIcons.size === 0) {
                console.log('No icons to load');
                iconsLoaded.value = true;
                return;
            }
            
            // تحميل كل الأيقونات (SVG خام أو من مجموعة أيقونات)
            const iconPromises = Array.from(uniqueIcons).map(async (iconName) => {
                const iconEntry = await loadIcon(iconName);
                if (iconEntry) {
                    eventIcons.value.set(iconName, iconEntry);
                    console.log('Icon stored in map:', iconName, iconEntry.isRaw ? '(raw SVG)' : '(icon set)');
                }
            });
            
            await Promise.all(iconPromises);
            iconsLoaded.value = true;
            console.log('All icons loaded, total loaded:', eventIcons.value.size);
            
            // ⭐ إعادة تحميل الكاليندار بعد تحميل الأيقونات
            if (fullCalendarRef.value && calendarInitialized.value) {
                console.log('Refreshing calendar after icons loaded');
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.refetchEvents();
                
                // تأخير إضافي للتأكد من التحميل
                setTimeout(() => {
                    calendarApi.refetchEvents();
                }, 100);
            }
        };

        // ⌀ تحميل الأيقونات عند التحميل الأولي
        onMounted(async () => {
            console.log('Calendar component mounted');
            await loadAllIcons();
            calendarInitialized.value = true;
            
            // تأخير تهيئة المستمعات لضمان تحميل DOM
            setTimeout(() => {
                initializeDragListeners();
            }, 500);
        });

        // ⭐ مراقبة تغييرات الأحداث والأيقونات
        watch(() => props.content?.events, 
            async (newEvents, oldEvents) => {
                console.log('Events changed, reloading icons...');
                await loadAllIcons();
                
                if (fullCalendarRef.value) {
                    setTimeout(() => {
                        const calendarApi = fullCalendarRef.value.getApi();
                        calendarApi.refetchEvents();
                    }, 100);
                }
            },
            { immediate: true, deep: true }
        );

        watch(() => props.content?.eventIconType, 
            async (newIcon, oldIcon) => {
                console.log('Global icon changed, reloading icons...');
                await loadAllIcons();
                
                if (fullCalendarRef.value) {
                    setTimeout(() => {
                        const calendarApi = fullCalendarRef.value.getApi();
                        calendarApi.refetchEvents();
                    }, 100);
                }
            },
            { immediate: true }
        );

        // ⭐ دالة الإسكرول التلقائي المخصصة
        const startAutoScroll = (mouseY) => {
            if (dragScrollInterval.value) return;

            const calendarElement = fullCalendarRef.value?.$el;
            if (!calendarElement) return;

            dragScrollInterval.value = setInterval(() => {
                const scroller = calendarElement.querySelector('.fc-scroller');
                if (!scroller) return;

                const rect = calendarElement.getBoundingClientRect();
                const scrollTop = scroller.scrollTop;
                const scrollHeight = scroller.scrollHeight;
                const clientHeight = scroller.clientHeight;

                // حساب سرعة الإسكرول بناء على قرب الماوس من الحافة
                const distanceFromTop = mouseY - rect.top;
                const distanceFromBottom = rect.bottom - mouseY;
                
                let scrollAmount = 0;

                if (distanceFromTop < scrollThreshold) {
                    // الإسكرول لأعلى
                    scrollAmount = -dragScrollSpeed.value * (1 - distanceFromTop / scrollThreshold);
                } else if (distanceFromBottom < scrollThreshold) {
                    // الإسكرول لأسفل
                    scrollAmount = dragScrollSpeed.value * (1 - distanceFromBottom / scrollThreshold);
                }

                if (scrollAmount !== 0) {
                    scroller.scrollTop += scrollAmount;
                    
                    // منع الإسكرول خارج الحدود
                    if (scroller.scrollTop < 0) {
                        scroller.scrollTop = 0;
                    } else if (scroller.scrollTop > scrollHeight - clientHeight) {
                        scroller.scrollTop = scrollHeight - clientHeight;
                    }
                }
            }, 16); // ~60fps
        };

        // ⭐ إيقاف الإسكرول التلقائي
        const stopAutoScroll = () => {
            if (dragScrollInterval.value) {
                clearInterval(dragScrollInterval.value);
                dragScrollInterval.value = null;
            }
        };

        // ⭐ دالة معالجة حركة الماوس أثناء السحب
        const handleMouseMove = (event) => {
            if (!isDragging.value) return;
            
            lastMouseY.value = event.clientY;
            
            const calendarElement = fullCalendarRef.value?.$el;
            if (!calendarElement) return;

            const rect = calendarElement.getBoundingClientRect();
            const mouseY = event.clientY;

            // التحقق إذا كان الماوس قريب من الحواف
            const distanceFromTop = mouseY - rect.top;
            const distanceFromBottom = rect.bottom - mouseY;

            if (distanceFromTop < scrollThreshold || distanceFromBottom < scrollThreshold) {
                startAutoScroll(mouseY);
            } else {
                stopAutoScroll();
            }
        };

        // ⭐ دالة معالجة تحرير الماوس
        const handleMouseUp = () => {
            isDragging.value = false;
            stopAutoScroll();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        // ⭐ تهيئة مستمعات الأحداث للسحب
        const initializeDragListeners = () => {
            const calendarElement = fullCalendarRef.value?.$el;
            if (!calendarElement) return;

            // إضافة مستمعات الأحداث للأحداث القابلة للسحب
            const draggableEvents = calendarElement.querySelectorAll('.fc-event');
            draggableEvents.forEach(event => {
                event.addEventListener('mousedown', () => {
                    isDragging.value = true;
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                });
            });

            // إضافة مستمعات للاختيار (إنشاء أحداث جديدة)
            const selectableAreas = calendarElement.querySelectorAll('.fc-daygrid-day, .fc-timegrid-slot');
            selectableAreas.forEach(area => {
                area.addEventListener('mousedown', (e) => {
                    // التأكد أن هذا ضغط لبدء السحب وليس مجرد نقرة
                    if (e.button === 0) { // زر الماوس الأيسر فقط
                        isDragging.value = true;
                        lastMouseY.value = e.clientY;
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                    }
                });
            });
        };

        // ⌀ تنظيف المستمعات عند إلغاء تحميل المكون
        onUnmounted(() => {
            stopAutoScroll();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        });

        // Computed properties for styling
        const calendarStyles = computed(() => ({
            // General Styles
            '--fc-font-family': props.content?.fontFamily || 'inherit',
            '--fc-font-size': props.content?.fontSize || '14px',
            '--fc-font-weight': props.content?.fontWeight || '400',
            '--fc-border-color': props.content?.borderColor || '#ddd',
            '--fc-now-indicator-color': props.content?.nowIndicatorColor || 'red',
            
            // Header Styles
            '--fc-header-height': props.content?.headerHeight || 'auto',
            '--fc-header-bg-color': props.content?.headerBackgroundColor || null,
            '--fc-header-padding': props.content?.headerBackgroundColor ? '10px' : '0px',
            '--fc-header-text-color': props.content?.headerTextColor || null,
            
            // Day Header Styles
            '--fc-day-header-height': props.content?.dayHeaderHeight || 'auto',
            '--fc-day-header-bg-color': props.content?.dayHeaderBackgroundColor || null,
            '--fc-day-header-text-color': props.content?.dayHeaderTextColor || null,
            '--fc-day-header-font-size': props.content?.dayHeaderFontSize || null,
            '--fc-day-header-font-weight': props.content?.dayHeaderFontWeight || null,
            
            // Cell Styles
            '--fc-cell-bg-color': props.content?.cellBackgroundColor || null,
            '--fc-cell-text-color': props.content?.cellTextColor || null,
            '--fc-cell-height': props.content?.cellHeight || 'auto',
            '--fc-daygrid-day-height': props.content?.cellHeight || 'auto',
            '--fc-timegrid-slots-height': props.content?.cellHeight || 'auto',
            '--fc-cell-width': props.content?.cellWidth || 'auto',
            '--fc-today-bg-color': props.content?.todayBackgroundColor || 'rgba(255, 220, 40, 0.15)',
            '--fc-other-month-bg-color': props.content?.otherMonthBackgroundColor || null,
            '--fc-other-month-text-color': props.content?.otherMonthTextColor || null,
            '--fc-weekend-text-color': props.content?.weekendTextColor || null,
            
            // Button Styles
            '--fc-button-text-color': props.content?.buttonTextColor || '#fff',
            '--fc-button-bg-color': props.content?.buttonBackgroundColor || '#2C3E50',
            '--fc-button-hover-bg-color': props.content?.buttonHoverBackgroundColor || '#1e2b37',
            '--fc-button-hover-text-color': props.content?.buttonHoverTextColor || '#fff',
            '--fc-button-active-bg-color': props.content?.buttonActiveBackgroundColor || '#1a252f',
            '--fc-button-active-text-color': props.content?.buttonActiveTextColor || '#fff',
            '--fc-button-border-radius': props.content?.buttonBorderRadius || '4px',
            '--fc-today-button-bg-color': props.content?.todayButtonBackgroundColor || null,
            '--fc-today-button-text-color': props.content?.todayButtonTextColor || null,
            '--fc-today-button-hover-bg-color': props.content?.todayButtonHoverBackgroundColor || null,
            '--fc-today-button-hover-text-color': props.content?.todayButtonHoverTextColor || null,
            
            // Time Grid Styles
            '--fc-time-grid-bg-color': props.content?.timeGridBackgroundColor || null,
            
            // Event Base Styles
            '--fc-event-bg-color': props.content?.defaultEventBackgroundColor || '#3788d8',
            '--fc-event-border-color': props.content?.defaultEventBorderColor || '#3788d8',
            '--fc-event-text-color': props.content?.defaultEventTextColor || '#fff',
            '--fc-event-border-radius': props.content?.eventBorderRadius || '10px',
            '--fc-event-padding': props.content?.eventPadding || '4px',
            '--fc-event-margin': props.content?.eventMargin || '1px',
            
            // Event Hover Styles
            '--event-hover-scale': props.content?.eventHoverScale || '1.05',
            '--event-hover-transition': props.content?.eventHoverTransition || '0.3s ease',
            
            // Event Title Styles
            '--event-title-font-size': props.content?.eventTitleFontSize || '0.8em',
            '--event-title-font-family': props.content?.eventTitleFontFamily || 'inherit',
            '--event-title-font-weight': props.content?.eventTitleFontWeight || '600',
            '--event-title-color': props.content?.eventTitleColor || '#ffffff',
            '--event-title-position': props.content?.eventTitlePosition || 'top',
            '--event-title-alignment': props.content?.eventTitleAlignment || 'left',
            '--event-title-margin': props.content?.eventTitleMargin || '0px',
            '--event-title-padding': props.content?.eventTitlePadding || '0px',
            '--event-title-bg-color': props.content?.eventTitleBackgroundColor || 'transparent',
            '--event-title-border-radius': props.content?.eventTitleBorderRadius || '0px',
            
            // Event Time Styles
            '--event-time-font-size': props.content?.eventTimeFontSize || '0.7em',
            '--event-time-font-family': props.content?.eventTimeFontFamily || 'inherit',
            '--event-time-font-weight': props.content?.eventTimeFontWeight || '400',
            '--event-time-color': props.content?.eventTimeColor || '#ffffff',
            '--event-time-position': props.content?.eventTimePosition || 'top',
            '--event-time-alignment': props.content?.eventTimeAlignment || 'left',
            '--event-time-margin': props.content?.eventTimeMargin || '0px',
            '--event-time-padding': props.content?.eventTimePadding || '0px',
            '--event-time-bg-color': props.content?.eventTimeBackgroundColor || 'transparent',
            '--event-time-border-radius': props.content?.eventTimeBorderRadius || '0px',
            
            // Event Icon Styles
            '--event-icon-size': props.content?.eventIconSize || '16px',
            '--event-icon-color': props.content?.eventIconColor || '#ffffff',
            '--event-icon-position': props.content?.eventIconPosition || 'top-right',
            '--event-icon-margin': props.content?.eventIconMargin || '0px',
            '--event-icon-padding': props.content?.eventIconPadding || '0px',
            '--event-icon-bg-color': props.content?.eventIconBackgroundColor || 'transparent',
            '--event-icon-border-radius': props.content?.eventIconBorderRadius || '0px',
        }));

        // ⭐ معالجة بيانات الأحداث - التأكد من وجود الأيقونات
        const processedEvents = computed(() => {
            const events = props.content?.events || [];
            const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

            const processed = events.map(event => {
                // الحصول على القيم باستخدام الصيغ
                const id = resolveMappingFormula(props.content?.eventsIdFormula, event) ?? event.id;
                const title = resolveMappingFormula(props.content?.eventsTitleFormula, event) ?? event.title;
                const start = resolveMappingFormula(props.content?.eventsStartFormula, event) ?? event.start;
                const end = resolveMappingFormula(props.content?.eventsEndFormula, event) ?? event.end;
                
                // الكشف التلقائي عن allDay بناءً على وجود الوقت
                let allDay = resolveMappingFormula(props.content?.eventsAllDayFormula, event) ?? event.allDay;
                if (allDay === undefined || allDay === null) {
                    const startHasTime = start && (start.includes('T') || start.includes(' '));
                    const endHasTime = end && (end.includes('T') || end.includes(' '));
                    allDay = !startHasTime && !endHasTime;
                }
                
                const backgroundColor = resolveMappingFormula(props.content?.eventsBackgroundColorFormula, event) ?? event.backgroundColor ?? event.color;
                const borderColor = resolveMappingFormula(props.content?.eventsBorderColorFormula, event) ?? event.borderColor ?? event.color;
                const textColor = resolveMappingFormula(props.content?.eventsTextColorFormula, event) ?? event.textColor;
                const content = resolveMappingFormula(props.content?.eventsContentFormula, event) ?? event.content;
                const data = resolveMappingFormula(props.content?.eventsDataFormula, event) ?? event.data;
                const groupId = resolveMappingFormula(props.content?.eventsGroupIdFormula, event) ?? event.groupId;
                const type = resolveMappingFormula(props.content?.eventsTypeFormula, event) ?? event.type;
                const status = resolveMappingFormula(props.content?.eventsStatusFormula, event) ?? event.status;
                const className = resolveMappingFormula(props.content?.eventsClassNameFormula, event) ?? event.className;
                
                // منطق الأيقونة - الأولوية للأيقونة المحددة في الحدث
                let icon = '';
                
                // الخيار 1: أيقونة محددة في الحدث نفسه (لها الأولوية)
                const eventSpecificIcon = resolveMappingFormula(props.content?.eventsIconFormula, event) ?? event.icon ?? '';
                if (eventSpecificIcon && eventSpecificIcon.trim() !== '') {
                    icon = eventSpecificIcon;
                }
                // الخيار 2: أيقونة موحدة لجميع الأحداث (يدوي)
                else if (props.content?.eventIconType && props.content.eventIconType.trim() !== '') {
                    icon = props.content.eventIconType;
                }

                return {
                    id: id || wwLib.wwUtils.getUid(),
                    title: title || 'Untitled Event',
                    start: start,
                    end: end,
                    allDay: allDay,
                    backgroundColor: backgroundColor || props.content?.defaultEventBackgroundColor || '#3788d8',
                    borderColor: borderColor || props.content?.defaultEventBorderColor || '#3788d8',
                    textColor: textColor || props.content?.defaultEventTextColor || '#ffffff',
                    icon: icon,
                    ...(groupId ? { groupId: groupId || undefined } : {}),
                    extendedProps: {
                        content: content || '',
                        data: data || {},
                        type: type || '',
                        status: status || '',
                        className: className || '',
                        originalEvent: event,
                        icon: icon,
                    },
                };
            });

            console.log('Processed events with icons:', processed.map(e => ({ title: e.title, icon: e.icon })));
            return processed;
        });

        // Available calendar views
        const availableViews = computed(() => {
            const views = {};

            if (props.content?.yearView) {
                views.multiMonthYear = { type: 'multiMonth', duration: { year: 1 } };
            }

            if (props.content?.monthView) {
                views.dayGridMonth = { type: 'dayGrid', duration: { month: 1 } };
            }

            if (props.content?.weekView) {
                views.timeGridWeek = { type: 'timeGrid', duration: { week: 1 } };
            }

            if (props.content?.dayView) {
                views.timeGridDay = { type: 'timeGrid', duration: { day: 1 } };
            }

            if (props.content?.listView) {
                views.listWeek = { type: 'list', duration: { week: 1 } };
            }

            return views;
        });

        // Hidden days configuration
        const hiddenDays = computed(() => {
            const hidden = [];
            const hideDaysOfWeek = props.content?.hideDaysOfWeek || [];

            if (props.content?.hideWeekends) {
                hidden.push(0, 6); // Sunday and Saturday
            } else {
                // Process custom hidden days
                hideDaysOfWeek.forEach(day => {
                    if (!hidden.includes(day)) {
                        hidden.push(day);
                    }
                });
            }

            // Ensure at least one day is visible (prevent hiding all days)
            if ([0, 1, 2, 3, 4, 5, 6].every(day => hidden.includes(day))) {
                return [];
            }

            return hidden;
        });

        // ⭐ دالة إنشاء تخطيط الحدث - الإصلاح النهائي
        const createEventLayout = (arg) => {
            const event = arg.event;
            const timeText = arg.timeText || '';
            
            // ⭐ تحديد إذا كان الحدث صغيراً (أقل من 30 دقيقة)
            const eventDuration = event.end ? event.end - event.start : 0;
            const isShortEvent = eventDuration > 0 && eventDuration < 30 * 60 * 1000;
            
            const iconName = event.extendedProps?.icon;
            
            // جلب إعدادات التنسيق من الـ props
            const titlePosition = props.content?.eventTitlePosition || 'top';
            const titleAlignment = props.content?.eventTitleAlignment || 'left';
            const timePosition = props.content?.eventTimePosition || 'top';
            const timeAlignment = props.content?.eventTimeAlignment || 'left';
            const iconPosition = props.content?.eventIconPosition || 'top-right';
            
            // ⭐ الإصلاح: استخدام الأيقونة المحملة من eventIcons (تدعم SVG خام أو أيقونة من مجموعة)
            let iconHtml = '';
            if (iconName && eventIcons.value.has(iconName)) {
                const iconEntry = eventIcons.value.get(iconName);
                if (iconEntry && iconEntry.svg) {
                    console.log('Rendering icon for event:', iconName, iconEntry.isRaw ? '(raw SVG)' : '(icon set)');
                    let renderedSvg;
                    if (iconEntry.isRaw) {
                        // ⭐ SVG خام رفعه/كتبه المستخدم مباشرة - يتعرض زي ما هو من غير ما نلمس ألوانه الأصلية
                        renderedSvg = iconEntry.svg;
                    } else {
                        // ⭐ أيقونة من icon set (phosphor/lucide/...) - نفس المعالجة الأصلية (توحيد اللون عبر currentColor)
                        renderedSvg = iconEntry.svg
                            .replace(/<svg/, '<svg fill="none"')
                            .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
                            .replace(/fill="[^"]*"/g, 'fill="none"');
                    }
                    iconHtml = `<div class="event-icon">${renderedSvg}</div>`;
                } else {
                    console.log('Icon SVG is null for:', iconName);
                }
            } else {
                console.log('Icon not found in map:', iconName, 'Available icons:', Array.from(eventIcons.value.keys()));
            }

            // ⭐ الوقت يظهر فقط في الأحداث الطويلة
            const showTime = !isShortEvent && timeText;

            return {
                html: `
                    <div class="custom-event-content unified-event ${isShortEvent ? 'short-event' : ''}">
                        <!-- العنوان -->
                        <div class="event-element event-title-wrapper" 
                             data-position="${titlePosition}" 
                             data-alignment="${titleAlignment}">
                            <div class="event-title">${event.title}</div>
                        </div>
                        
                        <!-- الوقت يظهر فقط في الأحداث الطويلة -->
                        ${showTime ? `
                        <div class="event-element event-time-wrapper" 
                             data-position="${timePosition}" 
                             data-alignment="${timeAlignment}">
                            <div class="event-time">${timeText}</div>
                        </div>
                        ` : ''}
                        
                        <!-- ⭐ الأيقونة تظهر دائماً في كل الأحداث -->
                        ${iconHtml ? `
                        <div class="event-element event-icon-wrapper" 
                             data-position="${iconPosition}">
                            ${iconHtml}
                        </div>
                        ` : ''}
                    </div>
                `
            };
        };

        // Computed properties for calendar options
        const calendarOptions = computed(() => {
            const firstDay = props.content?.startWeekOnSunday ? 0 : 1;
            const locale = props.content?.locale === 'auto' ? wwLib.wwLang.lang : props.content?.locale || 'en';

            // Use the default view or fallback
            const initialView = props.content?.defaultView || 'dayGridMonth';

            // Validate time start and end
            let slotMinTime = '00:00:00';
            let slotMaxTime = '24:00:00';

            if (props.content?.timeStart) {
                const timeStartRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
                if (timeStartRegex.test(props.content.timeStart)) {
                    slotMinTime = props.content.timeStart;
                }
            }

            if (props.content?.timeEnd) {
                const timeEndRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
                if (timeEndRegex.test(props.content.timeEnd)) {
                    slotMaxTime = props.content.timeEnd;
                }
            }

            // Handle height and contentHeight settings
            let height = props.content?.height || '600px';
            let contentHeight = props.content?.contentHeight || 'auto';

            if (height === 'auto') {
                height = null;
            }

            if (contentHeight === 'auto') {
                contentHeight = null;
            }

            // Custom button text
            const buttonText = {};
            if (props.content?.buttonTextToday) buttonText.today = wwLib.wwLang.getText(props.content.buttonTextToday);
            if (props.content?.buttonTextYear) buttonText.year = wwLib.wwLang.getText(props.content.buttonTextYear);
            if (props.content?.buttonTextMonth) buttonText.month = wwLib.wwLang.getText(props.content.buttonTextMonth);
            if (props.content?.buttonTextWeek) buttonText.week = wwLib.wwLang.getText(props.content.buttonTextWeek);
            if (props.content?.buttonTextDay) buttonText.day = wwLib.wwLang.getText(props.content.buttonTextDay);
            if (props.content?.buttonTextList) buttonText.list = wwLib.wwLang.getText(props.content.buttonTextList);

            return {
                plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, multiMonthPlugin, luxonPlugin],
                initialView: initialView,
                headerToolbar: props.content?.showHeader
                    ? {
                          left: 'prev,next today',
                          center: 'title',
                          right: Object.keys(availableViews.value).join(','),
                      }
                    : false,
                views: availableViews.value,
                events: processedEvents.value,
                editable: !props.content?.disableInteractions && !isEditing.value,
                selectable: !props.content?.disableInteractions && !isEditing.value,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: !props.content?.hideWeekends,
                firstDay: firstDay,
                locale: locale,
                timeZone: props.content?.timezone || 'local',
                hiddenDays: hiddenDays.value,
                slotMinTime: slotMinTime,
                slotMaxTime: slotMaxTime,
                allDaySlot: props.content?.allDaySlot,
                nowIndicator: true,
                height: 'auto',
                contentHeight: 'auto',
                stickyHeaderDates: true,
                noEventsContent: props.content?.noEventsText
                    ? wwLib.wwLang.getText(props.content.noEventsText)
                    : undefined,
                buttonText: Object.keys(buttonText).length > 0 ? buttonText : undefined,
                slotDuration: '00:30:00',
                slotLabelInterval: '01:00',
                slotLabelFormat: {
                    hour: 'numeric',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short'
                },
                eventTimeFormat: {
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                },
                
                // ⭐ إعدادات السحب والإسكرول المحسنة
                dragScroll: true,
                scrollTime: '06:00:00',
                
                // استخدام الدالة المعدلة
                eventContent: createEventLayout,
                
                // Event handlers
                eventClick: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        ...info.event.extendedProps.originalEvent,
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        groupId: info.event.groupId,
                        type: info.event.extendedProps?.type,
                        status: info.event.extendedProps?.status,
                        className: info.event.extendedProps?.className,
                    };

                    setSelectedEvent(eventData);

                    emit('trigger-event', {
                        name: 'eventClick',
                        event: { value: eventData },
                    });
                },
                datesSet: info => {
                    if (isEditing.value) return;

                    const viewData = {
                        view: info.view.type,
                        start: info.view.activeStart?.toISOString(),
                        end: info.view.activeEnd?.toISOString(),
                        title: info.view.title,
                    };

                    setCurrentView(info.view.type);

                    emit('trigger-event', {
                        name: 'viewChange',
                        event: { value: viewData },
                    });

                    // ⌀ إعادة تهيئة مستمعات السحب بعد تغيير العرض
                    setTimeout(() => {
                        initializeDragListeners();
                    }, 100);
                },
                select: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        start: info.start?.toISOString(),
                        end: info.end?.toISOString(),
                        allDay: info.allDay,
                    };

                    emit('trigger-event', {
                        name: 'eventCreated',
                        event: { value: eventData },
                    });
                },
                eventChange: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventUpdated',
                        event: { value: eventData },
                    });
                },
                eventDragStart: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventDragStart',
                        event: { value: eventData },
                    });

                    // ⌀ بدء تتبع السحب
                    isDragging.value = true;
                },
                eventDragStop: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventDragEnd',
                        event: { value: eventData },
                    });

                    // ⌀ إيقاف تتبع السحب
                    isDragging.value = false;
                    stopAutoScroll();
                },
                eventDrop: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        delta: info.delta,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventDrop',
                        event: { value: eventData },
                    });
                },
                eventResizeStart: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventResizeStart',
                        event: { value: eventData },
                    });

                    // ⌀ بدء تتبع السحب أثناء التغيير
                    isDragging.value = true;
                },
                eventResize: info => {
                    if (isEditing.value || props.content?.disableInteractions) return;

                    const eventData = {
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        allDay: info.event.allDay,
                        startDelta: info.startDelta,
                        endDelta: info.endDelta,
                        ...info.event.extendedProps,
                    };

                    emit('trigger-event', {
                        name: 'eventResize',
                        event: { value: eventData },
                    });

                    // ⌀ إيقاف تتبع السحب بعد التغيير
                    isDragging.value = false;
                    stopAutoScroll();
                },
            };
        });

        // Watch for changes in content properties
        watch(
            () => props.content?.timezone,
            () => {
                if (fullCalendarRef.value) {
                    const calendarApi = fullCalendarRef.value.getApi();
                    calendarApi.refetchEvents();
                }
            }
        );

        watch(
            () => props.content?.events,
            () => {
                if (fullCalendarRef.value) {
                    const calendarApi = fullCalendarRef.value.getApi();
                    calendarApi.refetchEvents();
                    calendarApi.unselect();
                    
                    // ⌀ إعادة تهيئة المستمعات بعد تحديث الأحداث
                    setTimeout(() => {
                        initializeDragListeners();
                    }, 100);
                }
            },
            { deep: true }
        );

        watch(
            () => props.content?.cellHeight,
            () => {
                if (fullCalendarRef.value) {
                    // سيتم إعادة تحميل الكومبوننت تلقائياً بسبب تغيير الـ key
                }
            }
        );

        // Actions
        const changeView = viewName => {
            if (fullCalendarRef.value) {
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.changeView(viewName);
                setCurrentView(viewName);
            }
        };

        const goToDate = date => {
            if (fullCalendarRef.value) {
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.gotoDate(date);
            }
        };

        const next = () => {
            if (fullCalendarRef.value) {
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.next();
            }
        };

        const prev = () => {
            if (fullCalendarRef.value) {
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.prev();
            }
        };

        const today = () => {
            if (fullCalendarRef.value) {
                const calendarApi = fullCalendarRef.value.getApi();
                calendarApi.today();
            }
        };

        return {
            fullCalendarRef,
            calendarOptions,
            calendarStyles,
            calendarKey,
            currentView,
            selectedEvent,
            changeView,
            goToDate,
            next,
            prev,
            today,
        };
    },
};
</script>

<style lang="scss" scoped>
    .fullcalendar-wrapper {
        width: 100%;
        --fc-border-color: #ddd;
        --fc-button-text-color: #fff;
        --fc-button-bg-color: #2c3e50;
        --fc-button-border-color: #2c3e50;
        --fc-button-hover-bg-color: #1e2b37;
        --fc-button-hover-border-color: #1a252f;
        --fc-button-active-bg-color: #1a252f;
        --fc-button-active-border-color: #151e27;
        --fc-event-bg-color: #3788d8;
        --fc-event-border-color: #3788d8;
        --fc-event-text-color: #fff;
        --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
        --fc-more-link-bg-color: #d0d0d0;
        --fc-more-link-text-color: inherit;
        --fc-today-bg-color: rgba(255, 220, 40, 0.15);
        --fc-now-indicator-color: red;
        --fc-header-height: auto;
        --fc-day-header-height: auto;
        --fc-cell-height: auto;
        --fc-cell-width: auto;
        position: relative;
        overflow: auto;

        // ⌀ تحسينات للإسكرول التلقائي
        &.modern-buttons {
            overflow: hidden;
            /* لمنع double scrollbars */
        }

        &.dark-mode {
            --fc-border-color: #444;
            --fc-button-text-color: #fff;
            --fc-button-bg-color: #444;
            --fc-button-border-color: #444;
            --fc-button-hover-bg-color: #555;
            --fc-button-hover-border-color: #555;
            --fc-button-active-bg-color: #666;
            --fc-button-active-border-color: #666;
            --fc-page-bg-color: #222;
            --fc-neutral-bg-color: #333;
            --fc-neutral-text-color: #fff;
            --fc-today-bg-color: rgba(255, 220, 40, 0.1);

            :deep(.fc) {
                color: #fff;

                .fc-toolbar-title {
                    color: #fff;
                }

                .fc-col-header-cell {
                    background-color: var(--fc-day-header-bg-color, #333) !important;
                }

                .fc-daygrid-day {
                    background-color: var(--fc-cell-bg-color, #222) !important;
                }

                .fc-day-other {
                    background-color: var(--fc-other-month-bg-color, #1a1a1a) !important;
                    color: var(--fc-other-month-text-color, #888) !important;
                }

                .fc-list-day-cushion {
                    background-color: #333;
                }

                .fc-list-event:hover td {
                    background-color: #444;
                }
            }
        }

        :deep(.fc) {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            font-family: var(--fc-font-family);
            font-size: var(--fc-font-size);
            font-weight: var(--fc-font-weight);

            // ⌀ تحسينات للسحب والإسكرول
            .fc-scroller {
                overflow: auto !important;
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }

            .fc-timegrid-body,
            .fc-daygrid-body {
                position: relative;
            }

            // ⌀ مناطق الإسكرول النشطة
            .fc-timegrid-slots,
            .fc-daygrid-body {
                cursor: grab;

                &:active {
                    cursor: grabbing;
                }
            }

            // إصلاح مشكلة ارتفاع الخلايا
            .fc-daygrid-day-frame,
            .fc-timegrid-slot,
            .fc-timegrid-slot-lane,
            .fc-daygrid-day-events {
                min-height: var(--fc-cell-height, auto) !important;
                height: var(--fc-cell-height, auto) !important;
            }

            .fc-daygrid-day {
                min-height: var(--fc-cell-height, auto) !important;
                height: var(--fc-cell-height, auto) !important;
            }

            .fc-timegrid-slot {
                height: var(--fc-cell-height, auto) !important;
            }

            .fc-event {
                cursor: pointer;
                border-radius: var(--fc-event-border-radius, 10px) !important;
                padding: var(--fc-event-padding, 4px) !important;
                margin: var(--fc-event-margin, 1px) !important;
                transition: all var(--event-hover-transition, 0.3s ease) !important;

                // ⭐ تأثير hover على الأحداث
                &:hover {
                    transform: scale(var(--event-hover-scale, 1.05)) !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                    z-index: 1000 !important;
                }

                // ⌀ تحسين مظهر الأحداث أثناء السحب
                &.fc-event-dragging {
                    opacity: 0.8;
                    transform: rotate(3deg) scale(1.02);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
                    z-index: 10000 !important;
                    cursor: grabbing !important;
                }
            }

            .fc-toolbar-title {
                font-size: var(--fc-font-size);
                font-weight: var(--fc-font-weight);
                color: var(--fc-header-text-color);
            }

            .fc-button {
                font-size: var(--fc-font-size);
                padding: 0.4em 0.65em;
                border-radius: var(--fc-button-border-radius);
            }

            .fc-header-toolbar {
                background-color: var(--fc-header-bg-color);
                padding: var(--fc-header-padding);
                height: var(--fc-header-height);
            }

            .fc-col-header-cell {
                height: var(--fc-day-header-height);
                background-color: var(--fc-day-header-bg-color) !important;

                .fc-col-header-cell-cushion {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: var(--fc-day-header-height);
                    padding: 8px;
                    color: var(--fc-day-header-text-color);
                    font-size: var(--fc-day-header-font-size);
                    font-weight: var(--fc-day-header-font-weight);
                }
            }

            .fc-timegrid-axis {
                background-color: var(--fc-day-header-bg-color) !important;
            }

            .fc-day-today {
                background-color: var(--fc-today-bg-color) !important;
            }

            .fc-daygrid-day {
                background-color: var(--fc-cell-bg-color) !important;
                color: var(--fc-cell-text-color) !important;
                min-height: var(--fc-cell-height) !important;
                height: var(--fc-cell-height) !important;
            }

            .fc-day-other {
                background-color: var(--fc-other-month-bg-color) !important;

                .fc-daygrid-day-top,
                .fc-daygrid-day-number {
                    color: var(--fc-other-month-text-color) !important;
                }
            }

            .fc-day-sat,
            .fc-day-sun {

                .fc-daygrid-day-top,
                .fc-daygrid-day-number,
                .fc-col-header-cell-cushion {
                    color: var(--fc-weekend-text-color) !important;
                }
            }

            .fc-timegrid-cols,
            .fc-timegrid-col,
            .fc-timegrid-body {
                background-color: var(--fc-time-grid-bg-color) !important;
            }

            .fc-today-button {
                text-transform: capitalize;
                background: var(--fc-today-button-bg-color, var(--fc-button-bg-color));
                color: var(--fc-today-button-text-color, var(--fc-button-text-color));
                border: none;

                &:hover {
                    background-color: var(--fc-today-button-hover-bg-color, var(--fc-button-hover-bg-color));
                    border-color: var(--fc-button-hover-border-color);
                    color: var(--fc-today-button-hover-text-color, var(--fc-button-hover-text-color));
                }
            }

            .fc-day.fc-day-today,
            .fc-daygrid-day.fc-day-today,
            .fc-timegrid-col.fc-day-today,
            .fc-list-day.fc-day-today {
                background-color: var(--fc-today-bg-color) !important;
            }

            .fc-multimonth-daygrid-table {
                .fc-day-today {
                    background-color: var(--fc-today-bg-color) !important;
                }
            }

            // نظام تنسيق جديد كلياً - نظام المواضع المنفصل
            .custom-event-content {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                position: relative;

                &.unified-event {

                    // ⭐ تنسيق خاص للأحداث الصغيرة - إخفاء الوقت فقط
                    &.short-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.85) !important;
                            max-width: 75% !important;
                        }
                        
                        // ⭐ إخفاء الوقت فقط في الأحداث الصغيرة
                        .event-time-wrapper {
                            display: none !important;
                        }
                        
                        // ⭐ الأيقونة تظهر دائماً - تصغير حجمها فقط
                        .event-icon-wrapper .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.7) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.7) !important;
                        }
                    }

                    // كل عنصر مستقل وله موضعه الخاص
                    .event-element {
                        position: absolute;
                        width: auto;
                        max-width: 90%;
                        z-index: 1;

                        // نظام المواضع الرأسية
                        &[data-position="top"] {
                            top: 4px;
                        }

                        &[data-position="middle"] {
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        &[data-position="bottom"] {
                            bottom: 4px;
                        }

                        // نظام المحاذاة الأفقية
                        &[data-alignment="left"] {
                            left: 4px;
                            text-align: left;
                        }

                        &[data-alignment="center"] {
                            left: 50%;
                            transform: translateX(-50%);
                            text-align: center;
                        }

                        &[data-alignment="right"] {
                            right: 4px;
                            text-align: right;
                        }

                        // الجمع بين التحويلات للمراكز
                        &[data-position="middle"][data-alignment="center"] {
                            transform: translate(-50%, -50%);
                        }

                        &[data-position="middle"][data-alignment="left"],
                        &[data-position="middle"][data-alignment="right"] {
                            transform: translateY(-50%);
                        }
                    }

                    // تنسيق العنوان
                    .event-title-wrapper {
                        .event-title {
                            font-size: var(--event-title-font-size, 0.8em);
                            font-family: var(--event-title-font-family, inherit);
                            font-weight: var(--event-title-font-weight, 600);
                            color: var(--event-title-color, #ffffff);
                            line-height: 1.2;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin: var(--event-title-margin, 0px);
                            padding: var(--event-title-padding, 0px);
                            background-color: var(--event-title-bg-color, transparent);
                            border-radius: var(--event-title-border-radius, 0px);
                        }
                    }

                    // تنسيق الوقت
                    .event-time-wrapper {
                        .event-time {
                            font-size: var(--event-time-font-size, 0.7em);
                            font-family: var(--event-time-font-family, inherit);
                            font-weight: var(--event-time-font-weight, 400);
                            color: var(--event-time-color, #ffffff);
                            opacity: 0.9;
                            margin: var(--event-time-margin, 0px);
                            padding: var(--event-time-padding, 0px);
                            background-color: var(--event-time-bg-color, transparent);
                            border-radius: var(--event-time-border-radius, 0px);
                        }
                    }

                    // ⭐ تنسيق الأيقونة - الإصلاح النهائي (مأخوذ من ww-icon)
                    .event-icon-wrapper {
                        margin: var(--event-icon-margin, 0px);
                        padding: var(--event-icon-padding, 0px);
                        background-color: var(--event-icon-bg-color, transparent);
                        border-radius: var(--event-icon-border-radius, 0px);
                        z-index: 2;

                        .event-icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: var(--event-icon-size, 16px);
                            height: var(--event-icon-size, 16px);
                            color: var(--event-icon-color, #ffffff);

                            // ⭐ الإصلاح: نفس تنسيق ww-icon مع stroke
                            >svg {
                                width: 100% !important;
                                height: 100% !important;
                                fill: none !important;
                                stroke: currentColor !important;
                                color: inherit !important;
                            }
                        }

                        // مواضع خاصة بالأيقونة (بدون محاذاة)
                        &[data-position="top-left"] {
                            top: 4px;
                            left: 4px;
                        }

                        &[data-position="top-right"] {
                            top: 4px;
                            right: 4px;
                        }

                        &[data-position="bottom-left"] {
                            bottom: 4px;
                            left: 4px;
                        }

                        &[data-position="bottom-right"] {
                            bottom: 4px;
                            right: 4px;
                        }

                        &[data-position="top-center"] {
                            top: 4px;
                            left: 50%;
                            transform: translateX(-50%);
                        }

                        &[data-position="bottom-center"] {
                            bottom: 4px;
                            left: 50%;
                            transform: translateX(-50%);
                        }

                        &[data-position="middle-left"] {
                            top: 50%;
                            left: 4px;
                            transform: translateY(-50%);
                        }

                        &[data-position="middle-right"] {
                            top: 50%;
                            right: 4px;
                            transform: translateY(-50%);
                        }

                        &[data-position="middle-center"] {
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                }
            }

            // تعديلات للأحجام الصغيرة
            .fc-daygrid-event {
                .custom-event-content {
                    &.unified-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.9);
                            max-width: 80%;
                        }

                        .event-time-wrapper .event-time {
                            font-size: calc(var(--event-time-font-size, 0.7em) * 0.9);
                        }

                        .event-icon-wrapper .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.8) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.8) !important;
                        }
                    }
                }
            }

            .fc-list-event {
                .custom-event-content {
                    &.unified-event {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        position: relative !important;

                        .event-element {
                            position: relative !important;
                            top: auto !important;
                            left: auto !important;
                            right: auto !important;
                            bottom: auto !important;
                            transform: none !important;
                        }

                        .event-icon-wrapper {
                            flex-shrink: 0;

                            .event-icon {
                                width: var(--event-icon-size, 16px) !important;
                                height: var(--event-icon-size, 16px) !important;
                            }
                        }

                        .event-title-wrapper {
                            flex: 1;

                            .event-title {
                                font-size: var(--event-title-font-size, 0.9em);
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }

                        .event-time-wrapper {
                            flex-shrink: 0;
                            margin-left: auto;

                            .event-time {
                                font-size: var(--event-time-font-size, 0.8em);
                                white-space: nowrap;
                            }
                        }
                    }
                }
            }

            .fc-timegrid-event {
                .custom-event-content {
                    &.unified-event {
                        .event-title-wrapper .event-title {
                            font-size: var(--event-title-font-size, 0.85em);
                        }

                        .event-time-wrapper .event-time {
                            font-size: var(--event-time-font-size, 0.75em);
                        }
                    }
                }
            }

            // ⭐ الإصلاح: الأيقونة تظهر في الأحداث الصغيرة
            .fc-daygrid-event-harness {
                .custom-event-content.unified-event {
                    &.short-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.75) !important;
                            max-width: 70% !important;
                        }
                        
                        .event-time-wrapper {
                            display: none !important;
                        }
                        
                        // ⭐ الأيقونة تظهر دائماً في الأحداث الصغيرة
                        .event-icon-wrapper {
                            display: block !important;
                            
                            .event-icon {
                                width: calc(var(--event-icon-size, 16px) * 0.6) !important;
                                height: calc(var(--event-icon-size, 16px) * 0.6) !important;
                            }
                        }
                    }
                }
            }

            // إصلاح للأحداث في عرض الشهر
            .fc-daygrid-block-event {
                .custom-event-content.unified-event {
                    padding: 2px 4px;

                    &.short-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.7) !important;
                            max-width: 65% !important;
                        }
                        
                        .event-time-wrapper {
                            display: none !important;
                        }
                        
                        // ⭐ الأيقونة تظهر دائماً
                        .event-icon-wrapper .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.5) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.5) !important;
                            display: block !important;
                        }
                    }

                    .event-title-wrapper .event-title {
                        font-size: calc(var(--event-title-font-size, 0.8em) * 0.85);
                    }

                    .event-time-wrapper .event-time {
                        font-size: calc(var(--event-time-font-size, 0.7em) * 0.85);
                    }

                    .event-icon-wrapper .event-icon {
                        width: calc(var(--event-icon-size, 16px) * 0.6) !important;
                        height: calc(var(--event-icon-size, 16px) * 0.6) !important;
                    }
                }
            }

            // إصلاح للأحداث في عرض متعدد الأشهر
            .fc-multimonth-event {
                .custom-event-content.unified-event {
                    .event-title-wrapper .event-title {
                        font-size: calc(var(--event-title-font-size, 0.8em) * 0.75);
                    }

                    .event-time-wrapper {
                        display: none;
                    }

                    // ⭐ الأيقونة تظهر في متعدد الأشهر أيضاً
                    .event-icon-wrapper {
                        display: block !important;
                        
                        .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.5) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.5) !important;
                        }
                    }
                }
            }

            // إصلاح للأحداث في عرض القائمة
            .fc-list-table {
                .fc-list-event {
                    td {
                        padding: 8px 12px;
                    }

                    .custom-event-content.unified-event {
                        min-height: 24px;

                        .event-icon-wrapper {
                            display: block !important;
                        }
                    }
                }
            }
        }
    }

    .fullcalendar-wrapper.modern-buttons {
        :deep(.fc) {
            .fc-button {
                box-shadow: none;
                transition: all 0.3s ease;
            }

            .fc-button-group {
                background-color: var(--fc-button-bg-color);
                color: var(--fc-button-text-color);
                padding: 2px;
                border-radius: var(--fc-button-border-radius);

                .fc-button {
                    color: var(--fc-button-text-color);
                    border: none;
                    box-shadow: none;
                    text-transform: capitalize;

                    &:hover {
                        background-color: var(--fc-button-hover-bg-color);
                        border-radius: var(--fc-button-border-radius);
                        color: var(--fc-button-hover-text-color);
                        transform: translateY(-1px);
                    }

                    &.fc-button-active {
                        background-color: var(--fc-button-active-bg-color);
                        border-radius: var(--fc-button-border-radius);
                        color: var(--fc-button-active-text-color);
                        box-shadow: none;
                        transform: translateY(0);
                    }
                }
            }

            .fc-toolbar-title {
                font-size: var(--fc-font-size);
                font-weight: var(--fc-font-weight);
                color: var(--fc-header-text-color);
            }

            .fc-toolbar {
                background-color: var(--fc-header-bg-color);
                padding: var(--fc-header-padding);
                border-radius: 8px 8px 0 0;
            }

            .fc-prev-button,
            .fc-next-button {
                background: transparent;
                color: var(--fc-button-text-color);
                border: 1px solid var(--fc-button-border-color);

                &:hover {
                    background-color: var(--fc-button-hover-bg-color);
                    color: var(--fc-button-hover-text-color);
                    transform: scale(1.05);
                }
            }

            .fc-today-button {
                background: var(--fc-today-button-bg-color, var(--fc-button-bg-color));
                color: var(--fc-today-button-text-color, var(--fc-button-text-color));
                border: none;

                &:hover {
                    background-color: var(--fc-today-button-hover-bg-color, var(--fc-button-hover-bg-color));
                    color: var(--fc-today-button-hover-text-color, var(--fc-button-hover-text-color));
                    transform: translateY(-1px);
                }

                &:disabled {
                    opacity: 0.6;
                    transform: none;
                }
            }
        }
    }

    // وسائط استجابة إضافية
    @media (max-width: 768px) {
        .fullcalendar-wrapper {
            :deep(.fc) {
                .fc-toolbar {
                    flex-direction: column;
                    gap: 10px;
                }

                .fc-toolbar-chunk {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }

                .custom-event-content.unified-event {
                    &.short-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.65) !important;
                            max-width: 60% !important;
                        }
                        
                        .event-icon-wrapper .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.5) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.5) !important;
                        }
                    }

                    .event-title-wrapper .event-title {
                        font-size: calc(var(--event-title-font-size, 0.8em) * 0.8);
                    }

                    .event-time-wrapper {
                        display: none;
                    }

                    .event-icon-wrapper .event-icon {
                        width: calc(var(--event-icon-size, 16px) * 0.7) !important;
                        height: calc(var(--event-icon-size, 16px) * 0.7) !important;
                    }
                }
            }
        }
    }

    @media (max-width: 480px) {
        .fullcalendar-wrapper {
            :deep(.fc) {
                .fc-header-toolbar {
                    padding: 5px;
                }

                .fc-button {
                    font-size: calc(var(--fc-font-size, 14px) * 0.85);
                    padding: 0.3em 0.5em;
                }

                .custom-event-content.unified-event {
                    &.short-event {
                        .event-title-wrapper .event-title {
                            font-size: calc(var(--event-title-font-size, 0.8em) * 0.6) !important;
                        }
                        
                        .event-icon-wrapper .event-icon {
                            width: calc(var(--event-icon-size, 16px) * 0.45) !important;
                            height: calc(var(--event-icon-size, 16px) * 0.45) !important;
                        }
                    }

                    .event-icon-wrapper {
                        display: block !important;
                    }
                }
            }
        }
    }
</style>