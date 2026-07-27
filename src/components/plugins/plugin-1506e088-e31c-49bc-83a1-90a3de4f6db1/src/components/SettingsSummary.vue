<template>
    <div v-for="connection in settings.privateData.connections" :key="connection.id" class="sql-settings-summary">
        <wwEditorIcon large name="sql" class="sql-settings-summary__icon" />
        <span v-if="connection.name" class="caption-m">
            {{ connection.name }}
        </span>
        <span v-else class="caption-m">
            {{ connection.database }} - {{ connection.user }} - {{ connection.host }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.sql-settings-summary {
    display: flex;
    align-items: center;
    &__icon {
        margin-right: var(--ww-spacing-02);
    }
}
</style>
