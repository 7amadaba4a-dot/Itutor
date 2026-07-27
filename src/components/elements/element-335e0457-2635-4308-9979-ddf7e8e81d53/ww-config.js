export default {
    editor: {
        label: { en: 'Realtime Inbox Listener' },
        icon: 'wifi',
    },
    options: {},
    properties: {
        userId: {
            label: { en: 'User id' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: '',
        },
        supabaseUrl: {
            label: { en: 'Supabase URL' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: 'https://kotzxqkagptcokpaviol.supabase.co',
        },
        supabaseAnonKey: {
            label: { en: 'Supabase anon key' },
            type: 'Text',
            bindable: true,
            section: 'settings',
            defaultValue: '',
        },
    },
    triggerEvents: [
        {
            name: 'messageReceived',
            label: { en: 'On message received' },
            event: { conversation_id: 0, sender_id: 0, content: '', created_at: '', id: 0 },
            default: true,
        },
        {
            name: 'messagesRead',
            label: { en: 'On messages read' },
            event: { conversation_id: 0, reader_id: 0 },
            default: false,
        },
        {
            name: 'lessonChanged',
            label: { en: 'On lesson changed' },
            event: { lesson_id: 0, action: '' },
            default: false,
        },
    ],
};
