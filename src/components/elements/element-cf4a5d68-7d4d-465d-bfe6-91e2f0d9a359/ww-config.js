export default {
    editor: {
        label: {
            en: 'Tetris Game',
        },
        icon: 'template',
    },
    properties: {
        initialSpeed: {
            label: { en: 'Initial Speed (ms)' },
            type: 'Number',
            section: 'settings',
            bindable: true,
            options: {
                min: 100,
                max: 2000,
                step: 100
            },
            defaultValue: 1000,
        },
        backgroundColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#1a1a1a',
        },
        gridColor: {
            label: { en: 'Grid Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#333333',
        },
        blockColors: {
            label: { en: 'Block Colors' },
            type: 'Array',
            section: 'style',
            bindable: true,
            defaultValue: [
                '#00f0f0', // Cyan (I)
                '#f0f000', // Yellow (O)
                '#a000f0', // Purple (T)
                '#00f000', // Green (S)
                '#f00000', // Red (Z)
                '#0000f0', // Blue (J)
                '#f0a000'  // Orange (L)
            ],
            options: {
                expandable: true,
                getItemLabel(item, index) {
                    return `Block ${index + 1} Color`;
                },
                item: {
                    type: 'Color',
                }
            },
        },
        showPreview: {
            label: { en: 'Show Next Piece' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: true,
        }
    },
    triggerEvents: [
        {
            name: 'gameOver',
            label: { en: 'On Game Over' },
            event: { score: 0, level: 1 }
        },
        {
            name: 'scoreChange',
            label: { en: 'On Score Change' },
            event: { score: 0 }
        },
        {
            name: 'levelUp',
            label: { en: 'On Level Up' },
            event: { level: 1 }
        }
    ],
    actions: [
        {
            name: 'startGame',
            label: { en: 'Start New Game' }
        },
        {
            name: 'pauseGame',
            label: { en: 'Toggle Pause' }
        },
        {
            name: 'resetGame',
            label: { en: 'Reset Game' }
        }
    ]
};