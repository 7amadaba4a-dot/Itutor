<template>
    <div class="sql-settings-edit">
        <div v-for="(connection, index) in connections" :key="connection.id">
            <wwEditorFormRow label="Given name">
                <wwEditorInputText
                    :model-value="connection.name"
                    :placeholder="getConnectionName(index)"
                    @update:modelValue="setConnectionProp('name', index, $event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Client" required>
                <wwEditorInputTextSelect
                    :options="clientOptions"
                    :model-value="connection.client"
                    @update:modelValue="setConnectionProp('client', index, $event)"
                />
            </wwEditorFormRow>
            <div class="flex">
                <wwEditorFormRow label="Host" required class="mr-1" style="width: 75%">
                    <wwEditorInputText
                        :model-value="connection.host"
                        placeholder="host.com"
                        small
                        @update:modelValue="setConnectionProp('host', index, $event)"
                    />
                </wwEditorFormRow>
                <wwEditorFormRow label="Port" required class="ml-1" style="width: 25%">
                    <wwEditorInputText
                        type="number"
                        :model-value="connection.port"
                        placeholder="5432"
                        small
                        @update:modelValue="setConnectionProp('port', index, $event)"
                    />
                </wwEditorFormRow>
            </div>
            <div class="flex">
                <wwEditorFormRow label="User" class="mr-1" required>
                    <wwEditorInputText
                        :model-value="connection.user"
                        placeholder="admin"
                        small
                        @update:modelValue="setConnectionProp('user', index, $event)"
                    />
                </wwEditorFormRow>
                <wwEditorFormRow label="Password" lass="ml-1" required>
                    <wwEditorInputText
                        type="password"
                        :model-value="connection.password"
                        placeholder="********"
                        small
                        @update:modelValue="setConnectionProp('password', index, $event)"
                    />
                </wwEditorFormRow>
            </div>
            <wwEditorFormRow label="Database" required>
                <wwEditorInputText
                    :model-value="connection.database"
                    placeholder="SchoolDB"
                    small
                    @update:modelValue="setConnectionProp('database', index, $event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Use SSL" required>
                <wwEditorInputSwitch
                    :model-value="connection.useSsl"
                    small
                    @update:modelValue="setConnectionProp('useSsl', index, $event)"
                />
            </wwEditorFormRow>
            <div class="flex">
                <button
                    type="button"
                    class="ww-editor-button -primary -green -small mr-auto"
                    @click="testConnection(index)"
                >
                    Test
                </button>
                <button
                    type="button"
                    class="ww-editor-button -primary -red -small ml-auto"
                    @click="deleteConnection(index)"
                >
                    <wwEditorIcon class="ww-editor-button-icon -left" name="delete" small />
                    Delete
                </button>
            </div>
            <div class="sql-settings-edit__separator my-4 mx-3"></div>
        </div>
        <button type="button" class="ww-editor-button -primary -small mx-auto" @click="addConnection">
            <wwEditorIcon class="ww-editor-button-icon -left" name="add" small />
            Add connection
        </button>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            clientOptions: [
                { label: 'PostgreSQL', value: 'pg' },
                { label: 'MSSQL', value: 'mssql' },
                { label: 'MySQL', value: 'mysql' },
                { label: 'MariaDB', value: 'mysql-mariadb' },
                { label: 'Amazon Redshift', value: 'pg-redshift' },
            ],
            newConnection: {
                client: 'pg',
                host: undefined,
                port: '5432',
                user: undefined,
                password: undefined,
                database: undefined,
                useSsl: true,
                query: 'SELECT * FROM Student',
            },
        };
    },
    computed: {
        connections() {
            if (!this.settings.privateData.connections) return [];
            return this.settings.privateData.connections.map(co => ({
                ...co,
                useSsl: undefined === co.useSsl ? true : co.useSsl,
            }));
        },
    },
    methods: {
        getConnectionName(index) {
            const connection = this.connections[index];
            if (connection.name) return connection.name;
            if (connection.database && connection.user && connection.host)
                return `${connection.database} - ${connection.user} - ${connection.host}`;
            return 'Enter a name';
        },
        setConnectionProp(key, index, value) {
            const connections = _.cloneDeep(this.connections);
            connections[index][key] = value;
            if (key === 'client') {
                switch (value) {
                    case 'pg':
                        connections[index].port = '5432';
                        break;
                    case 'pg-redshift':
                        connections[index].port = '5439';
                        break;
                    case 'mssql':
                        connections[index].port = '1433';
                        break;
                    case 'mysql':
                    case 'mysql-mariadb':
                        connections[index].port = '3306';
                        break;
                }
            }
            this.updateConnections(connections);
        },
        addConnection() {
            const connections = _.cloneDeep(this.connections);
            connections.push({ ...this.newConnection, id: wwLib.wwUtils.getUid() });
            this.updateConnections(connections);
        },
        deleteConnection(index) {
            const connections = _.cloneDeep(this.connections);
            connections.splice(index, 1);
            this.updateConnections(connections);
        },
        updateConnections(connections) {
            this.$emit('update:settings', { ...this.settings, privateData: { connections } });
        },
        async testConnection(index) {
            try {
                const connection = this.connections[index];
                const websiteId = wwLib.wwWebsiteData.getInfo().id;
                await wwAxios.post(`${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/sql/test`, {
                    connection,
                });
                wwLib.wwNotification.open({ text: 'Connection to database succeeded.', color: 'green' });
            } catch (err) {
                wwLib.wwLog.error(err);
                wwLib.wwNotification.open({ text: 'Connection to database failed.', color: 'red' });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.sql-settings-edit {
    display: flex;
    flex-direction: column;
    &__separator {
        border: 1px solid var(--ww-color-border);
    }
}
</style>
