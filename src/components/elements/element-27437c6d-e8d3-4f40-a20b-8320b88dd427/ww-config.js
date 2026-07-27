export default {
    editor: {
        label: { en: 'Profile Image Cropper' },
        icon: 'photograph',
    },
    options: {},
    properties: {
        imageUrl: {
            label: { en: 'Image URL' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: '',
        },
        outputSize: {
            label: { en: 'Output size (px)' },
            type: 'Number',
            bindable: true,
            section: 'settings',
            defaultValue: 500,
        },
        confirmButtonLabel: {
            label: { en: 'Confirm button label' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: 'Confirm crop',
        },
    },
    triggerEvents: [
        { name: 'cropped', label: { en: 'On crop confirmed' }, event: { value: '' }, default: true },
    ],
    actions: [
        { label: { en: 'Reset crop' }, action: 'resetCrop' },
    ],
};
