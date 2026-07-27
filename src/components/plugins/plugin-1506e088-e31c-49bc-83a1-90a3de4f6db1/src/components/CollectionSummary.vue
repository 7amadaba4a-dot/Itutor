<template>
    <div class="sql-collection-summary">
        <div class="sql-collection-summary__elem caption-s">Connection: {{ connection }}</div>
        <div class="sql-collection-summary__elem caption-s">Query: {{ config.query || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    computed: {
        connection() {
            const connections = this.plugin.settings.privateData.connections || [];
            const connection = connections.find(connection => connection.id === this.config.connection);
            if (!connection) return 'Not found';
            if (connection.name) return connection.name;
            return `${connection.database} - ${connection.user} - ${connection.host}`;
        },
    },
};
</script>

<style lang="scss" scoped>
.sql-collection-summary {
    &__elem {
        margin-bottom: var(--ww-spacing-01);
    }
}
</style>
