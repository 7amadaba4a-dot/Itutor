export default {
    editor: {
        label: { en: 'Booking Calendar V5' },
        icon: 'calendar',
    },
    options: {},
    properties: {
        slots: {
            label: { en: 'Availability slots' },
            type: 'Array',
            bindable: true,
            section: 'settings',
            defaultValue: [],
        },
        teacherTimezone: {
            label: { en: 'Teacher timezone' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: 'UTC',
        },
        bookedSlots: {
            label: { en: 'Booked slots (UTC ISO)' },
            type: 'Array',
            bindable: true,
            section: 'settings',
            defaultValue: [],
        },
        slotMinutes: {
            label: { en: 'Slot length (minutes)' },
            type: 'Number',
            bindable: true,
            section: 'settings',
            defaultValue: 30,
        },
    },
    triggerEvents: [
        { name: 'book', label: { en: 'On slot booked' }, event: { value: {} }, default: true },
    ],
    actions: [],
};
