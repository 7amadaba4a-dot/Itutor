export default {
    options: {
        ignoredStyleProperties: ['overflow', 'aspectRatio'],
    },
    editor: {
        label: {
            fr: 'Vidéo - Vimeo',
            en: 'Vidéo - Vimeo',
        },
        icon: 'logos/vimeo',
    },
    actions: [
        { label: 'Play video', action: 'playVideo' },
        { label: 'Pause video', action: 'pauseVideo' },
        {
            label: 'Seek to',
            action: 'seekTo',
            args: [
                {
                    name: 'Time',
                    type: 'number',
                },
            ],
        },
    ],
    triggerEvents: [
        { name: 'play', label: { en: 'On play' }, event: { value: '' }, default: true },
        { name: 'pause', label: { en: 'On pause' }, event: { value: '' } },
        { name: 'end', label: { en: 'On end' }, event: { value: '' } },
    ],
    properties: {
        url: {
            path: 'url',
            label: { en: 'Video url', fr: 'Url de la vidéo' },
            type: 'Text',
            section: 'settings',
            options: {
                placeholder: 'Url',
            },
            bindable: true,
            defaultValue: '',
        },
        videoStartTime: {
            label: {
                en: 'Start time (s)',
            },
            type: 'Number',
            options: (_, sidepanelContent) => ({ min: 0, max: sidepanelContent.videoDuration }),
            section: 'settings',
            bindable: true,
            defaultValue: 0,
        },
        videoDuration: {
            editorOnly: true,
            defaultValue: 0,
            hidden: true,
        },
        autoplay: {
            label: { en: 'Autoplay', fr: 'Lecture automatique' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
        muted: {
            label: { en: 'Muted', fr: 'Muet' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            hidden: content => content.autoplay,
        },
        loop: {
            label: { en: 'Loop', fr: 'Lecture en boucle' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
        },
        controls: {
            label: { en: 'Controls', fr: 'Contrôles' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
        },
    },
};
