// Single source of truth for the chart-config examples.
// Used by tests/smoke/examples.test.js and mirrored in docs/examples.md.
// Each entry has the exact { type, data, options } payload a user would bind in WeWeb,
// plus the per-instance plugin toggles.

export const examples = [
    {
        id: 1,
        title: 'Bar — minimal',
        type: 'bar',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ label: 'Sales', data: [12, 19, 3, 5, 2], backgroundColor: '#3b82f6' }],
        },
        options: {},
    },
    {
        id: 2,
        title: 'Line — multi-series',
        type: 'line',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: '2024', data: [10, 15, 13, 18, 22, 25], borderColor: '#3b82f6', tension: 0.3 },
                { label: '2025', data: [12, 18, 16, 22, 28, 32], borderColor: '#10b981', tension: 0.3 },
            ],
        },
        options: {
            plugins: {
                title: { display: true, text: 'Monthly Revenue' },
                legend: { position: 'bottom' },
            },
        },
    },
    {
        id: 3,
        title: 'Pie — custom palette',
        type: 'pie',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Direct', 'Organic', 'Referral', 'Paid'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            }],
        },
        options: { plugins: { legend: { position: 'right' } } },
    },
    {
        id: 4,
        title: 'Scatter — {x,y} data, linear x scale',
        type: 'scatter',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            datasets: [{
                label: 'Cluster A',
                data: [{ x: 1, y: 2 }, { x: 2, y: 5 }, { x: 3, y: 3 }, { x: 4, y: 7 }, { x: 5, y: 6 }],
                backgroundColor: '#3b82f6',
            }],
        },
        options: { scales: { x: { type: 'linear', position: 'bottom' } } },
    },
    {
        id: 5,
        title: 'Doughnut + datalabels',
        type: 'doughnut',
        plugins: { enableDatalabels: true, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                data: [25, 30, 20, 25],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            }],
        },
        options: {
            cutout: '60%',
            plugins: { datalabels: { color: '#fff', font: { weight: 'bold', size: 14 } } },
        },
    },
    {
        id: 6,
        title: 'Bar + annotation (threshold line)',
        type: 'bar',
        plugins: { enableDatalabels: false, enableAnnotation: true, enableZoom: false },
        data: {
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: [{ label: 'Score', data: [65, 80, 45, 90, 70], backgroundColor: '#3b82f6' }],
        },
        options: {
            plugins: {
                annotation: {
                    annotations: {
                        target: {
                            type: 'line',
                            yMin: 75,
                            yMax: 75,
                            borderColor: '#ef4444',
                            borderWidth: 2,
                            label: { display: true, content: 'Target', position: 'end' },
                        },
                    },
                },
            },
        },
    },
    {
        id: 7,
        title: 'Line + zoom + time axis (date-fns)',
        type: 'line',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: true },
        data: {
            datasets: [{
                label: 'Stock price',
                data: [
                    { x: '2025-01-01', y: 100 }, { x: '2025-02-01', y: 115 }, { x: '2025-03-01', y: 108 },
                    { x: '2025-04-01', y: 125 }, { x: '2025-05-01', y: 130 }, { x: '2025-06-01', y: 122 },
                    { x: '2025-07-01', y: 140 }, { x: '2025-08-01', y: 138 }, { x: '2025-09-01', y: 150 },
                    { x: '2025-10-01', y: 148 }, { x: '2025-11-01', y: 160 }, { x: '2025-12-01', y: 165 },
                ],
                borderColor: '#3b82f6',
                tension: 0.2,
            }],
        },
        options: {
            scales: { x: { type: 'time', time: { unit: 'month' } } },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                },
            },
        },
    },
    {
        id: 8,
        title: 'Bubble — {x,y,r}',
        type: 'bubble',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            datasets: [{
                label: 'Customers',
                data: [
                    { x: 10, y: 20, r: 8 },
                    { x: 15, y: 35, r: 12 },
                    { x: 25, y: 25, r: 6 },
                    { x: 30, y: 45, r: 15 },
                    { x: 40, y: 30, r: 10 },
                ],
                backgroundColor: 'rgba(59,130,246,0.6)',
            }],
        },
        options: { scales: { x: { type: 'linear' }, y: { type: 'linear' } } },
    },
    {
        id: 9,
        title: 'Radar — two series',
        type: 'radar',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Speed', 'Power', 'Range', 'Comfort', 'Price', 'Tech'],
            datasets: [
                {
                    label: 'Model A',
                    data: [80, 60, 70, 90, 50, 75],
                    backgroundColor: 'rgba(59,130,246,0.3)',
                    borderColor: '#3b82f6',
                },
                {
                    label: 'Model B',
                    data: [65, 85, 80, 70, 75, 60],
                    backgroundColor: 'rgba(239,68,68,0.3)',
                    borderColor: '#ef4444',
                },
            ],
        },
        options: { scales: { r: { beginAtZero: true, max: 100 } } },
    },
    {
        id: 10,
        title: 'MIXED — bar + line + scatter',
        type: 'bar',
        plugins: { enableDatalabels: false, enableAnnotation: false, enableZoom: false },
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Volume',
                    data: [120, 150, 180, 130, 160, 200],
                    backgroundColor: '#93c5fd',
                },
                {
                    type: 'line',
                    label: 'Trend',
                    data: [125, 140, 165, 145, 155, 180],
                    borderColor: '#1d4ed8',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3,
                },
                {
                    type: 'scatter',
                    label: 'Anomaly',
                    data: [{ x: 'Mar', y: 250 }, { x: 'Jun', y: 240 }],
                    backgroundColor: '#ef4444',
                    pointRadius: 8,
                },
            ],
        },
        options: {
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } },
        },
    },
    {
        id: 11,
        title: 'Super complex — multi-axis financial dashboard',
        type: 'bar',
        plugins: { enableDatalabels: false, enableAnnotation: true, enableZoom: true },
        data: {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Volume',
                    data: [220, 180, 240, 190, 260, 310, 280, 220, 195, 240, 290, 320],
                    backgroundColor: 'rgba(148,163,184,0.5)',
                    yAxisID: 'yVolume',
                    order: 2,
                },
                {
                    type: 'line',
                    label: 'Price',
                    data: [102, 108, 105, 112, 118, 115, 122, 120, 128, 132, 130, 138],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'yPrice',
                    order: 1,
                },
                {
                    type: 'line',
                    label: 'MA-3',
                    data: [null, null, 105, 108.3, 111.7, 115, 118.3, 119, 123.3, 126.7, 130, 133.3],
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    yAxisID: 'yPrice',
                    order: 0,
                },
            ],
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            plugins: {
                title: { display: true, text: '12-week Performance', font: { size: 16, weight: 'bold' } },
                legend: { position: 'top' },
                annotation: {
                    annotations: {
                        support: {
                            type: 'line',
                            yMin: 105,
                            yMax: 105,
                            yScaleID: 'yPrice',
                            borderColor: '#10b981',
                            borderWidth: 1,
                            borderDash: [4, 4],
                            label: { display: true, content: 'Support 105', position: 'start', backgroundColor: '#10b981' },
                        },
                        resistance: {
                            type: 'line',
                            yMin: 130,
                            yMax: 130,
                            yScaleID: 'yPrice',
                            borderColor: '#ef4444',
                            borderWidth: 1,
                            borderDash: [4, 4],
                            label: { display: true, content: 'Resistance 130', position: 'start', backgroundColor: '#ef4444' },
                        },
                    },
                },
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                },
            },
            scales: {
                yPrice: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Price ($)' },
                    beginAtZero: false,
                },
                yVolume: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Volume' },
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                },
            },
        },
    },
];
