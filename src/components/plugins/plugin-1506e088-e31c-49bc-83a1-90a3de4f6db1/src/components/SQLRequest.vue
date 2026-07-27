<template>
    <wwEditorFormRow label="Connection" required>
        <wwEditorInputTextSelect
            :options="connectionOptions"
            :actions="connectionActions"
            :model-value="connection"
            placeholder="Select a connection"
            @update:modelValue="setConnection"
            @action="onAction"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Query"
        required
        type="code"
        :model-value="query"
        language="sql"
        bindable
        @update:modelValue="setQuery"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    data() {
        return {
            connectionActions: [{ icon: 'add', label: 'Add connection', onAction: this.addConnection }],
        };
    },
    computed: {
        connection() {
            return this.args.connection;
        },
        query() {
            return this.args.query;
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
        setConnection(connection) {
            this.$emit('update:args', { ...this.args, connection });
        },
        setQuery(query) {
            this.$emit('update:args', { ...this.args, query });
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
