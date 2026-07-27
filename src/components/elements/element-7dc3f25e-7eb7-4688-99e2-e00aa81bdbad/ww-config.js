export default {
    editor: { label: { en: 'Languato Whiteboard' }, icon: 'pencil' },
    properties: {
        isTeacher: {
            label: { en: 'Is Teacher' }, type: 'OnOff', bindable: true, section: 'settings', defaultValue: false,
        },
        locked: {
            label: { en: 'Locked For Student' }, type: 'OnOff', bindable: true, section: 'settings', defaultValue: false,
        },
        accentColor: {
            label: { en: 'Accent Color' }, type: 'Color', bindable: true, section: 'style', defaultValue: '#007bff',
        },
        savedState: {
            label: { en: 'Saved State' }, type: 'Textarea', bindable: true, section: 'settings', defaultValue: '',
        },
    },
    triggerEvents: [
        { name: 'sendUpdate', label: { en: 'On Local Change (send to peer)' }, event: { value: '' }, default: true },
        { name: 'changed', label: { en: 'On Content Changed (persist)' }, event: { value: '' } },
        { name: 'closeRequested', label: { en: 'On Close Requested' }, event: { value: '' } },
    ],
    actions: [
        { label: { en: 'Receive Remote Update' }, action: 'receiveUpdate', args: [{ name: 'payloadJson', type: 'string', label: { en: 'Message JSON' } }] },
        { label: { en: 'Load Saved State' }, action: 'loadState', args: [{ name: 'stateJson', type: 'string', label: { en: 'State JSON' } }] },
    ],
};
