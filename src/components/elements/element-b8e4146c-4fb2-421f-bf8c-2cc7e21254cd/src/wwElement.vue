<template>
    <div class="snake-game">
        <div 
            class="game-board"
            :style="boardStyle"
        >
            <!-- Snake segments -->
            <div
                v-for="(segment, index) in snake"
                :key="index"
                class="snake-segment"
                :style="snakeSegmentStyle(segment)"
            >
                <!-- Eyes (only for head) -->
                <template v-if="index === 0">
                    <div class="snake-eye left"></div>
                    <div class="snake-eye right"></div>
                </template>
            </div>

            <!-- Food -->
            <div
                class="food"
                :style="foodStyle"
            ></div>

            <!-- Game Over Screen -->
            <div
                v-if="gameOver"
                class="game-over"
            >
                <h2 class="game-over-title">Game Over!</h2>
                <p class="game-over-score">Final Score: {{ score }}</p>
                <button
                    class="game-over-button"
                    @click="resetGame"
                >
                    Play Again
                </button>
            </div>
        </div>

        <!-- Score display -->
        <div class="score-display">
            <div class="score-icon" :style="{ backgroundColor: content?.foodColor || '#ef4444' }"></div>
            <span class="score-text">{{ score }}</span>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true }
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const CELL_SIZE = 20
        const BOARD_SIZE = 30
        const INITIAL_SPEED = props.content?.speed || 150
        const SPEED_INCREASE = 2

        // Game state
        const snake = ref([{ x: 10, y: 10 }])
        const food = ref({ x: 15, y: 15 })
        const direction = ref({ x: 1, y: 0 })
        const nextDirection = ref({ x: 1, y: 0 })
        const gameOver = ref(false)
        const score = ref(0)
        let gameLoop = null
        let currentSpeed = INITIAL_SPEED
        let isPaused = false

        // Computed styles
        const boardStyle = computed(() => ({
            backgroundColor: props.content?.boardColor || '#90c44b',
            backgroundImage: `linear-gradient(${props.content?.gridColor || '#86b846'} 1px, transparent 1px), 
                            linear-gradient(90deg, ${props.content?.gridColor || '#86b846'} 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            width: `${BOARD_SIZE * CELL_SIZE}px`,
            height: `${BOARD_SIZE * CELL_SIZE}px`
        }))

        const snakeSegmentStyle = (segment) => ({
            backgroundColor: props.content?.snakeColor || '#4a7cff',
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${segment.x * CELL_SIZE}px`,
            top: `${segment.y * CELL_SIZE}px`
        })

        const foodStyle = computed(() => ({
            backgroundColor: props.content?.foodColor || '#ef4444',
            left: `${food.value.x * CELL_SIZE + CELL_SIZE/4}px`,
            top: `${food.value.y * CELL_SIZE + CELL_SIZE/4}px`
        }))

        // Game logic
        const spawnFood = () => {
            let newFood
            do {
                newFood = {
                    x: Math.floor(Math.random() * BOARD_SIZE),
                    y: Math.floor(Math.random() * BOARD_SIZE)
                }
            } while (snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y))
            food.value = newFood
        }

        const checkCollision = (head) => {
            if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                return true
            }
            return snake.value.some((segment, index) => {
                if (index === 0) return false
                return segment.x === head.x && segment.y === head.y
            })
        }

        const moveSnake = () => {
            if (gameOver.value || isPaused) return

            direction.value = { ...nextDirection.value }
            const head = snake.value[0]
            const newHead = {
                x: head.x + direction.value.x,
                y: head.y + direction.value.y
            }

            if (checkCollision(newHead)) {
                gameOver.value = true
                emit('trigger-event', { name: 'gameOver', event: { score: score.value } })
                return
            }

            snake.value.unshift(newHead)

            if (newHead.x === food.value.x && newHead.y === food.value.y) {
                score.value++
                emit('trigger-event', { name: 'scoreChange', event: { value: score.value } })
                spawnFood()
                currentSpeed = Math.max(50, INITIAL_SPEED - (score.value * SPEED_INCREASE))
                clearInterval(gameLoop)
                gameLoop = setInterval(moveSnake, currentSpeed)
            } else {
                snake.value.pop()
            }
        }

        const handleKeydown = (e) => {
            const key = e.key
            const currentDir = direction.value

            switch (key) {
                case 'ArrowUp':
                    if (currentDir.y !== 1) nextDirection.value = { x: 0, y: -1 }
                    break
                case 'ArrowDown':
                    if (currentDir.y !== -1) nextDirection.value = { x: 0, y: 1 }
                    break
                case 'ArrowLeft':
                    if (currentDir.x !== 1) nextDirection.value = { x: -1, y: 0 }
                    break
                case 'ArrowRight':
                    if (currentDir.x !== -1) nextDirection.value = { x: 1, y: 0 }
                    break
            }
        }

        const resetGame = () => {
            snake.value = [{ x: 10, y: 10 }]
            direction.value = { x: 1, y: 0 }
            nextDirection.value = { x: 1, y: 0 }
            score.value = 0
            gameOver.value = false
            currentSpeed = INITIAL_SPEED
            isPaused = false
            spawnFood()
            clearInterval(gameLoop)
            gameLoop = setInterval(moveSnake, currentSpeed)
        }

        const pauseGame = () => {
            isPaused = true
        }

        const resumeGame = () => {
            isPaused = false
        }

        onMounted(() => {
            const doc = wwLib.getFrontDocument()
            doc.addEventListener('keydown', handleKeydown)
            gameLoop = setInterval(moveSnake, currentSpeed)
        })

        onUnmounted(() => {
            const doc = wwLib.getFrontDocument()
            doc.removeEventListener('keydown', handleKeydown)
            clearInterval(gameLoop)
        })

        return {
            snake,
            food,
            gameOver,
            score,
            boardStyle,
            snakeSegmentStyle,
            foodStyle,
            resetGame,
            pauseGame,
            resumeGame
        }
    }
}
</script>

<style lang="scss" scoped>
.snake-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 1rem;

    .game-board {
        position: relative;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .snake-segment {
        position: absolute;
        border-radius: 2px;
        transition: all 100ms linear;

        .snake-eye {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 50%;

            &.left {
                left: 25%;
                top: 25%;
            }

            &.right {
                left: 25%;
                top: 60%;
            }
        }
    }

    .food {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .game-over {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.75);
        
        .game-over-title {
            color: white;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }

        .game-over-score {
            color: white;
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }

        .game-over-button {
            padding: 0.5rem 1rem;
            background-color: #4a7cff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 200ms;

            &:hover {
                background-color: #3a6cef;
            }
        }
    }

    .score-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 8px;

        .score-icon {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }

        .score-text {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
        }
    }
}
</style>