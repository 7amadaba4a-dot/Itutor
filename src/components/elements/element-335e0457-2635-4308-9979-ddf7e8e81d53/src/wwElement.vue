<template>
    <div class="realtime-inbox-listener" :style="{ display: 'none' }"></div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { createClient } from '@supabase/supabase-js';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const client = ref(null);
        const channel = ref(null);

        function teardown() {
            if (channel.value) {
                try {
                    console.log('[RealtimeInboxListener] tearing down previous channel');
                    channel.value.unsubscribe();
                } catch (e) {
                    console.log('[RealtimeInboxListener] teardown error', e);
                }
                channel.value = null;
            }
        }

        function setup(userId, url, anonKey) {
            teardown();
            console.log('[RealtimeInboxListener] setup called with', { userId, url, hasKey: !!anonKey });

            if (!userId || !url || !anonKey) {
                console.log('[RealtimeInboxListener] missing userId/url/key, not subscribing');
                return;
            }

            if (!client.value) {
                client.value = createClient(url, anonKey);
                console.log('[RealtimeInboxListener] supabase client created');
            }

            const topic = 'user-' + String(userId);
            console.log('[RealtimeInboxListener] subscribing to topic', topic);
            const ch = client.value.channel(topic, { config: { broadcast: { self: false } } });

            ch.on('broadcast', { event: 'new_message' }, payload => {
                console.log('[RealtimeInboxListener] new_message received!', payload);
                const data = payload?.payload || {};
                emit('trigger-event', {
                    name: 'messageReceived',
                    event: {
                        id: data.id,
                        conversation_id: data.conversation_id,
                        sender_id: data.sender_id,
                        content: data.content,
                        created_at: data.created_at,
                    },
                });
            });

            ch.on('broadcast', { event: 'messages_read' }, payload => {
                console.log('[RealtimeInboxListener] messages_read received!', payload);
                const data = payload?.payload || {};
                emit('trigger-event', {
                    name: 'messagesRead',
                    event: {
                        conversation_id: data.conversation_id,
                        reader_id: data.reader_id,
                    },
                });
            });

            ch.on('broadcast', { event: 'lesson_changed' }, payload => {
                console.log('[RealtimeInboxListener] lesson_changed received!', payload);
                const data = payload?.payload || {};
                emit('trigger-event', {
                    name: 'lessonChanged',
                    event: {
                        lesson_id: data.lesson_id,
                        action: data.action,
                    },
                });
            });

            ch.subscribe(status => {
                console.log('[RealtimeInboxListener] subscribe status:', status, 'topic:', topic);
            });
            channel.value = ch;
        }

        onMounted(() => {
            console.log('[RealtimeInboxListener] component mounted', props.content);
            setup(props.content?.userId, props.content?.supabaseUrl, props.content?.supabaseAnonKey);
        });

        watch(
            () => [props.content?.userId, props.content?.supabaseUrl, props.content?.supabaseAnonKey],
            ([userId, url, anonKey]) => {
                console.log('[RealtimeInboxListener] props changed, re-subscribing');
                setup(userId, url, anonKey);
            }
        );

        onBeforeUnmount(() => {
            teardown();
        });

        return {};
    },
};
</script>

<style scoped>
.realtime-inbox-listener {
    width: 0;
    height: 0;
}
</style>
