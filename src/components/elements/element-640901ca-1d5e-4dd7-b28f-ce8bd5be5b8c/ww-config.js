export default {
    editor: {
        label: { en: 'Availability Grid Picker' },
        icon: 'calendar',
    },
    options: {},
    properties: {
        initialSlots: {
            label: { en: 'Initial slots' },
            type: 'Array',
            bindable: true,
            section: 'settings',
            defaultValue: [],
        },
        startHour: {
            label: { en: 'Start hour' },
            type: 'Number',
            bindable: true,
            section: 'settings',
            defaultValue: 6,
        },
        endHour: {
            label: { en: 'End hour' },
            type: 'Number',
            bindable: true,
            section: 'settings',
            defaultValue: 23,
        },
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On selection changed' }, event: { value: [] }, default: true },
    ],
    actions: [
        { label: { en: 'Clear all' }, action: 'clearAll' },
    ],
};
