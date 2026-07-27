export default {
    editor: {
        label: {
            en: 'Snake Game',
        },
        icon: 'game-controller',
    },
    properties: {
        boardColor: {
            label: { en: 'Board Color' },
            type: 'Color',
            bindable: true,
            defaultValue: '#90c44b',
            section: 'style',
        },
        gridColor: {
            label: { en: 'Grid Color' },
            type: 'Color',
            bindable: true,
            defaultValue: '#86b846',
            section: 'style',
        },
        snakeColor: {
            label: { en: 'Snake Color' },
            type: 'Color',
            bindable: true,
            defaultValue: '#4a7cff',
            section: 'style',
        },
        foodColor: {
            label: { en: 'Food Color' },
            type: 'Color',
            bindable: true,
            defaultValue: '#ef4444',
            section: 'style',
        },
        speed: {
            label: { en: 'Initial Speed' },
            type: 'Number',
            bindable: true,
            defaultValue: 150,
            section: 'settings',
            options: {
                min: 50,
                max: 300,
                step: 10
            },
        }
    },
    triggerEvents: [
        {
            name: 'scoreChange',
            label: { en: 'On Score Change' },
            event: { value: 0 }
        },
        {
            name: 'gameOver',
            label: { en: 'On Game Over' },
            event: { score: 0 }
        }
    ],
    actions: [
        {
            name: 'resetGame',
            label: { en: 'Reset Game' },
            action: 'resetGame'
        },
        {
            name: 'pauseGame',
            label: { en: 'Pause Game' },
            action: 'pauseGame'
        },
        {
            name: 'resumeGame',
            label: { en: 'Resume Game' },
            action: 'resumeGame'
        }
    ]
};