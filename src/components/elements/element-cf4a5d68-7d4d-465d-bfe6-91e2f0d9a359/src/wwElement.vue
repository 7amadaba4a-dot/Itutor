<template>
    <div 
        class="tetris-game"
        :style="{
            backgroundColor: content.backgroundColor,
            '--grid-color': content.gridColor
        }"
        tabindex="0"
        @keydown="handleKeydown"
        ref="gameContainer"
    >
        <div class="game-area" :class="{ 'game-over-blur': gameOver }">
            <div class="game-board">
                <div 
                    v-for="(row, y) in displayBoard" 
                    :key="y" 
                    class="row"
                >
                    <div 
                        v-for="(cell, x) in row" 
                        :key="x" 
                        class="cell"
                        :class="{ 
                            'filled': cell !== 0,
                            'active': isActivePiece(x, y)
                        }"
                        :style="getCellStyle(cell)"
                    ></div>
                </div>
            </div>
            
            <div class="game-info">
                <div class="score-box">
                    <div class="label">Score</div>
                    <div class="value">{{ score }}</div>
                </div>
                <div class="level-box">
                    <div class="label">Level</div>
                    <div class="value">{{ level }}</div>
                </div>
                <div v-if="content.showPreview" class="preview-box">
                    <div class="label">Next</div>
                    <div class="preview-grid">
                        <div 
                            v-for="(row, y) in nextPiecePreview" 
                            :key="y" 
                            class="preview-row"
                        >
                            <div 
                                v-for="(cell, x) in row" 
                                :key="x" 
                                class="preview-cell"
                                :class="{ filled: cell !== 0 }"
                                :style="getCellStyle(cell)"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="controls-info">
                    <div>← → : Move</div>
                    <div>Space : Rotate</div>
                    <div>↓ : Drop Faster</div>
                    <div>P : Pause</div>
                </div>
            </div>
        </div>
        
        <div v-if="gameOver" class="game-over">
            <div class="game-over-content">
                <h2>Game Over!</h2>
                <div class="final-score">Final Score: {{ score }}</div>
                <div class="high-score">
                    High Score: {{ highScore }}
                    <span v-if="score > previousHighScore" class="new-record">New Record!</span>
                </div>
                <button @click="resetGame" class="play-again-btn">Play Again</button>
            </div>
        </div>
        
        <div v-if="isPaused && !gameOver" class="pause-screen">
            <div class="pause-content">
                <h2>Paused</h2>
                <button @click="togglePause" class="resume-btn">Resume</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const PIECES = [
    {
        shape: [[1, 1, 1, 1]],
        width: 4,
        color: 1
    },
    {
        shape: [[2, 2], [2, 2]],
        width: 2,
        color: 2
    },
    {
        shape: [[0, 3, 0], [3, 3, 3]],
        width: 3,
        color: 3
    },
    {
        shape: [[0, 4, 4], [4, 4, 0]],
        width: 3,
        color: 4
    },
    {
        shape: [[5, 5, 0], [0, 5, 5]],
        width: 3,
        color: 5
    },
    {
        shape: [[6, 0, 0], [6, 6, 6]],
        width: 3,
        color: 6
    },
    {
        shape: [[0, 0, 7], [7, 7, 7]],
        width: 3,
        color: 7
    }
];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const PREVIEW_SIZE = 4;

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true }
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const gameBoard = ref(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
        const currentPiece = ref(null);
        const nextPiece = ref(null);
        const currentPos = ref({ x: 0, y: 0 });
        const gameOver = ref(false);
        const isPaused = ref(false);
        const gameLoop = ref(null);
        const score = ref(0);
        const level = ref(1);
        const previousHighScore = ref(0);
        const highScore = ref(parseInt(localStorage.getItem('tetrisHighScore')) || 0);
        const gameContainer = ref(null);

        const blockColors = computed(() => props.content?.blockColors || [
            '#00f0f0', '#f0f000', '#a000f0', '#00f000', '#f00000', '#0000f0', '#f0a000'
        ]);

        const dropSpeed = computed(() => {
            const baseSpeed = props.content?.initialSpeed || 1000;
            return Math.max(baseSpeed - (level.value - 1) * 50, 100);
        });

        const displayBoard = computed(() => {
            const board = gameBoard.value.map(row => [...row]);
            if (currentPiece.value && !gameOver.value) {
                currentPiece.value.shape.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (cell !== 0) {
                            const boardY = currentPos.value.y + y;
                            const boardX = currentPos.value.x + x;
                            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                                board[boardY][boardX] = cell;
                            }
                        }
                    });
                });
            }
            return board;
        });

        const isActivePiece = (x, y) => {
            if (!currentPiece.value) return false;
            const pieceX = x - currentPos.value.x;
            const pieceY = y - currentPos.value.y;
            return pieceY >= 0 && pieceY < currentPiece.value.shape.length &&
                   pieceX >= 0 && pieceX < currentPiece.value.shape[0].length &&
                   currentPiece.value.shape[pieceY][pieceX] !== 0;
        };

        const getCellStyle = (cell) => {
            if (cell === 0) return {};
            return {
                backgroundColor: blockColors.value[cell - 1],
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3)'
            };
        };

        const nextPiecePreview = computed(() => {
            if (!nextPiece.value) return Array(PREVIEW_SIZE).fill().map(() => Array(PREVIEW_SIZE).fill(0));
            
            const preview = Array(PREVIEW_SIZE).fill().map(() => Array(PREVIEW_SIZE).fill(0));
            const piece = nextPiece.value;
            const offsetX = Math.floor((PREVIEW_SIZE - piece.width) / 2);
            const offsetY = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);
            
            piece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell !== 0) {
                        preview[y + offsetY][x + offsetX] = cell;
                    }
                });
            });
            
            return preview;
        });

        const checkGameOver = () => {
            // Check if any piece in the top row
            if (gameBoard.value[0].some(cell => cell !== 0)) {
                endGame();
                return true;
            }
            return false;
        };

        const endGame = () => {
            gameOver.value = true;
            clearInterval(gameLoop.value);
            
            if (score.value > highScore.value) {
                previousHighScore.value = highScore.value;
                highScore.value = score.value;
                localStorage.setItem('tetrisHighScore', highScore.value.toString());
            }
            
            emit('trigger-event', {
                name: 'gameOver',
                event: { score: score.value, level: level.value }
            });
        };

        const createNewPiece = () => {
            const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
            return JSON.parse(JSON.stringify(piece));
        };

        const canMove = (piece, pos) => {
            return piece.shape.every((row, y) => {
                return row.every((cell, x) => {
                    if (cell === 0) return true;
                    const newX = pos.x + x;
                    const newY = pos.y + y;
                    return (
                        newX >= 0 &&
                        newX < BOARD_WIDTH &&
                        newY < BOARD_HEIGHT &&
                        (newY < 0 || gameBoard.value[newY][newX] === 0)
                    );
                });
            });
        };

        const merge = () => {
            currentPiece.value.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell !== 0) {
                        const boardY = currentPos.value.y + y;
                        if (boardY >= 0) {
                            gameBoard.value[boardY][currentPos.value.x + x] = cell;
                        }
                    }
                });
            });
            
            if (checkGameOver()) {
                return false;
            }
            
            return true;
        };

        const clearLines = () => {
            let linesCleared = 0;
            
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (gameBoard.value[y].every(cell => cell !== 0)) {
                    gameBoard.value.splice(y, 1);
                    gameBoard.value.unshift(Array(BOARD_WIDTH).fill(0));
                    linesCleared++;
                    y++;
                }
            }
            
            if (linesCleared > 0) {
                const points = [0, 40, 100, 300, 1200][linesCleared] * level.value;
                score.value += points;
                
                emit('trigger-event', {
                    name: 'scoreChange',
                    event: { score: score.value }
                });
                
                const newLevel = Math.floor(score.value / 1000) + 1;
                if (newLevel > level.value) {
                    level.value = newLevel;
                    emit('trigger-event', {
                        name: 'levelUp',
                        event: { level: level.value }
                    });
                }
            }
        };

        const rotate = () => {
            const piece = currentPiece.value;
            const newShape = Array(piece.shape[0].length).fill()
                .map((_, i) => piece.shape.map(row => row[row.length - 1 - i]));
            
            const oldShape = piece.shape;
            piece.shape = newShape;
            
            if (!canMove(piece, currentPos.value)) {
                piece.shape = oldShape;
            }
        };

        const moveLeft = () => {
            if (!isPaused.value && !gameOver.value && canMove(currentPiece.value, { ...currentPos.value, x: currentPos.value.x - 1 })) {
                currentPos.value.x--;
            }
        };

        const moveRight = () => {
            if (!isPaused.value && !gameOver.value && canMove(currentPiece.value, { ...currentPos.value, x: currentPos.value.x + 1 })) {
                currentPos.value.x++;
            }
        };

        const moveDown = () => {
            if (!isPaused.value && !gameOver.value && canMove(currentPiece.value, { ...currentPos.value, y: currentPos.value.y + 1 })) {
                currentPos.value.y++;
                return true;
            }
            return false;
        };

        const hardDrop = () => {
            while (moveDown()) {
                // Keep moving down
            }
            dropPiece();
        };

        const dropPiece = () => {
            if (!merge()) return; // If merge returns false, game is over
            clearLines();
            
            currentPiece.value = nextPiece.value;
            nextPiece.value = createNewPiece();
            currentPos.value = {
                x: Math.floor((BOARD_WIDTH - currentPiece.value.width) / 2),
                y: -2
            };
            
            if (!canMove(currentPiece.value, currentPos.value)) {
                endGame();
            }
        };

        const handleKeydown = (event) => {
            if (gameOver.value) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    resetGame();
                }
                return;
            }
            
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    moveLeft();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    moveRight();
                    break;
                case ' ':
                    event.preventDefault();
                    rotate();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    moveDown();
                    break;
                case 'p':
                case 'P':
                    event.preventDefault();
                    togglePause();
                    break;
            }
        };

        const startGame = () => {
            if (gameLoop.value) clearInterval(gameLoop.value);
            
            gameBoard.value = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
            currentPiece.value = createNewPiece();
            nextPiece.value = createNewPiece();
            currentPos.value = {
                x: Math.floor((BOARD_WIDTH - currentPiece.value.width) / 2),
                y: -2
            };
            score.value = 0;
            level.value = 1;
            gameOver.value = false;
            isPaused.value = false;
            previousHighScore.value = highScore.value;
            
            gameLoop.value = setInterval(() => {
                if (!isPaused.value) {
                    if (!moveDown()) {
                        dropPiece();
                    }
                }
            }, dropSpeed.value);
        };

        const togglePause = () => {
            if (!gameOver.value) {
                isPaused.value = !isPaused.value;
            }
        };

        const resetGame = () => {
            startGame();
        };

        onMounted(() => {
            gameContainer.value?.focus();
            startGame();
        });

        onUnmounted(() => {
            if (gameLoop.value) clearInterval(gameLoop.value);
        });

        watch(dropSpeed, (newSpeed) => {
            if (gameLoop.value) {
                clearInterval(gameLoop.value);
                gameLoop.value = setInterval(() => {
                    if (!isPaused.value) {
                        if (!moveDown()) {
                            dropPiece();
                        }
                    }
                }, newSpeed);
            }
        });

        return {
            displayBoard,
            nextPiecePreview,
            score,
            level,
            highScore,
            previousHighScore,
            gameOver,
            isPaused,
            gameContainer,
            handleKeydown,
            startGame,
            resetGame,
            togglePause,
            isActivePiece,
            getCellStyle
        };
    }
};
</script>

<style lang="scss" scoped>
.tetris-game {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 600px;
    padding: 20px;
    position: relative;
    outline: none;
    font-family: 'Arial', sans-serif;
    
    .game-area {
        display: flex;
        gap: 20px;
        background: rgba(0, 0, 0, 0.1);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        transition: filter 0.3s ease;
        
        &.game-over-blur {
            filter: blur(2px);
        }
    }

    .game-board {
        display: grid;
        grid-template-rows: repeat(20, 30px);
        gap: 1px;
        background-color: var(--grid-color);
        padding: 1px;
        border: 2px solid var(--grid-color);
        border-radius: 4px;
        overflow: hidden;
    }

    .row {
        display: grid;
        grid-template-columns: repeat(10, 30px);
        gap: 1px;
    }

    .cell {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.1);
        transition: background-color 0.1s ease;
        border-radius: 2px;
        
        &.filled {
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        &.active {
            filter: brightness(1.2);
            box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4);
        }
    }

    .game-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 150px;
    }

    .score-box,
    .level-box {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        
        .label {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .value {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
    }

    .preview-box {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        
        .label {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .preview-grid {
            display: grid;
            grid-template-rows: repeat(4, 20px);
            gap: 1px;
            background-color: var(--grid-color);
            padding: 1px;
            border-radius: 4px;
        }
        
        .preview-row {
            display: grid;
            grid-template-columns: repeat(4, 20px);
            gap: 1px;
        }
        
        .preview-cell {
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            
            &.filled {
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        }
    }

    .controls-info {
        margin-top: auto;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.8;
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .game-over,
    .pause-screen {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
        
        h2 {
            font-size: 42px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
            animation: slideDown 0.5s ease;
        }
        
        .final-score,
        .high-score {
            font-size: 24px;
            margin: 10px 0;
            color: rgba(255, 255, 255, 0.9);
            animation: slideUp 0.5s ease;
        }
        
        .new-record {
            color: #4CAF50;
            font-weight: bold;
            margin-left: 10px;
            animation: pulse 2s infinite;
        }
        
        button {
            margin-top: 30px;
            padding: 15px 30px;
            font-size: 18px;
            background: #4CAF50;
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            animation: fadeIn 0.5s ease 0.3s both;
            
            &:hover {
                background: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }
            
            &:active {
                transform: translateY(0);
            }
        }
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
</style>