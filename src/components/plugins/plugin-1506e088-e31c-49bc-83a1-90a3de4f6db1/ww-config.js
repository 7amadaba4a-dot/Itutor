export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                const connections = settings.privateData.connections || [];
                return (
                    connections.length &&
                    !!connections.every(
                        connection =>
                            !!connection.host &&
                            !!connection.port &&
                            !!connection.user &&
                            !!connection.password &&
                            !!connection.database
                    )
                );
            },
        },
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.connection && !!config.query;
            },
        },
    },
    actions: [
        {
            name: 'SQL Request',
            code: 'sqlRequest',
            isAsync: true,
        },
    ],
};
