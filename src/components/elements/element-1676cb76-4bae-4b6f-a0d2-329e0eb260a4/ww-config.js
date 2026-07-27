export default {
    editor: {
        label: { en: 'Booking Calendar V6' },
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
        selectedSlots: {
            label: { en: 'Selected slots (UTC ISO array)' },
            type: 'Array',
            bindable: true,
            section: 'settings',
            defaultValue: [],
        },
    },
    triggerEvents: [
        { name: 'select', label: { en: 'On slot selected/deselected' }, event: { value: {} }, default: true },
    ],
    actions: [],
};
