<template>
    <div class="sql-collection-edit">
        <wwEditorFormRow label="Connection" required>
            <wwEditorInputTextSelect
                :options="connectionOptions"
                :actions="connectionActions"
                :model-value="query.connection"
                placeholder="Select a connection"
                @update:modelValue="setProp('connection', $event)"
                @action="onAction"
            />
        </wwEditorFormRow>
        <wwEditorInputRow
            label="Query"
            type="code"
            required
            :model-value="query.query"
            :bindable="collection.mode === 'dynamic'"
            language="sql"
            @update:modelValue="setProp('query', $event)"
        />
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            connectionActions: [{ icon: 'add', label: 'Add connection', onAction: this.addConnection }],
        };
    },
    computed: {
        query() {
            return {
                connection: undefined,
                query: 'SELECT * FROM Student',
                ...this.config,
            };
        },
        connectionOptions() {
            const connections = this.plugin.settings.privateData.connections || [];
            return connections.map(connection => ({
                label: connection.name || `${connection.database} - ${connection.user} - ${connection.host}`,
                value: connection.id,
            }));
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', { ...this.query, [key]: value });
        },
        addConnection() {
            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('wwTopBar:open', 'WEBSITE_PLUGIN');
            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('wwTopBar:plugins:setPlugin', this.plugin.id);
        },
        onAction(action) {
            action && action.onAction();
        },
    },
};
</script>

<style scoped lang="scss">
.sql-collection-edit {
    display: flex;
    flex-direction: column;
}
</style>
