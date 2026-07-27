export default {
    editor: {
        label: { en: 'Chart.js' },
        icon: 'chart-bar',
    },
    triggerEvents: [
        {
            name: 'chart:click',
            label: { en: 'On chart click' },
            event: {
                position: { x: 0, y: 0 },
                points: [{ datasetLabel: '', label: '', value: 0, index: 0, datasetIndex: 0 }],
                dataX: null,
                dataY: null,
            },
        },
        {
            name: 'chart:hover',
            label: { en: 'On chart hover' },
            event: {
                position: { x: 0, y: 0 },
                points: [{ datasetLabel: '', label: '', value: 0, index: 0, datasetIndex: 0 }],
                dataX: null,
                dataY: null,
            },
        },
        {
            name: 'chart:ready',
            label: { en: 'On chart ready' },
            event: {},
        },
    ],
    properties: {
        type: {
            label: { en: 'Chart type' },
            type: 'TextSelect',
            section: 'settings',
            options: {
                options: [
                    { value: 'bar', label: 'Bar' },
                    { value: 'line', label: 'Line' },
                    { value: 'pie', label: 'Pie' },
                    { value: 'doughnut', label: 'Doughnut' },
                    { value: 'radar', label: 'Radar' },
                    { value: 'polarArea', label: 'Polar area' },
                    { value: 'scatter', label: 'Scatter' },
                    { value: 'bubble', label: 'Bubble' },
                ],
            },
            defaultValue: 'bar',
            bindable: true,
        },
        data: {
            label: { en: 'Data' },
            type: 'RawObject',
            section: 'settings',
            options: {
                placeholder: '{ labels: [...], datasets: [...] }',
            },
            bindable: true,
            defaultValue: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: '#3b82f6',
                        borderColor: '#1d4ed8',
                        borderWidth: 1,
                    },
                ],
            },
        },
        options: {
            label: { en: 'Options' },
            type: 'RawObject',
            section: 'settings',
            options: {
                placeholder: '{ scales: {...}, plugins: {...}, animation: {...} }',
            },
            bindable: true,
            defaultValue: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false, text: '' },
                },
            },
        },
        enableDatalabels: {
            label: { en: 'Enable datalabels plugin' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
        enableAnnotation: {
            label: { en: 'Enable annotation plugin' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
        enableZoom: {
            label: { en: 'Enable zoom plugin' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
    },
};
