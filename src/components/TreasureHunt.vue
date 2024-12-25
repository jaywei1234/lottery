<template>
    <div class="container">
        <h1>尋寶</h1>
        <button @click="reset">隨機名單</button>
        <div class="game-area">
            <div class="player-list">
                <h3>玩家順序:</h3>
                <ul>
                    <li v-for="(name, index) in shuffledNames" :key="index"
                        :class="{ 'current-player': currentPlayer === name, 'taken-turn': playersTakenTurn.includes(name) }">
                        {{ index + 1 }}. {{ name }}
                    </li>
                </ul>
            </div>
            <div class="player-list">
                <h3>獎品清單:</h3>
                <ul>
                    <li v-for="(prize, index) in prizes" :key="index">
                        {{ prize.prize }}: {{ prize.count }} 個
                    </li>
                </ul>
            </div>
            <div class="game-board">
                <button @click="startGame" v-if="!gameStarted && shuffledNames.length && prizes.length">開始</button>
                <div v-if="gameStarted">
                    <h3>目前玩家: {{ currentPlayer }}</h3>
                    <div id="game-board">
                        <div v-for="(cell, index) in gameBoard" :key="index"
                            :class="['cell', { 'revealed': cell.revealed }]" @click="dig(index)">
                            <span v-if="!cell.revealed">
                                {{ index + 1 }} <!-- Display box number -->
                            </span>
                            <span v-else>
                                <template v-if="cell.content !== 'Empty'">
                                    {{ cell.content }}<br>
                                    {{ cell.chosenBy }}
                                </template>
                                <template v-else>
                                    沒中<br>
                                    {{ cell.chosenBy }}
                                </template>
                            </span>
                        </div>
                    </div>
                    <div v-if="winners.length" id="winners-list">
                        <h2>中獎者:</h2>
                        <ul>
                            <li v-for="winner in winners" :key="winner.chosenBy">
                                {{ winner.chosenBy }} - {{ winner.prize || '沒中' }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="name-editor">
                <h3>名單編輯</h3>
                <textarea v-model="namesText" rows="10" cols="30"></textarea>
                <button @click="saveNames">儲存名單</button>
            </div>
            <div class="name-editor">
                <h3>獎品編輯</h3>
                <textarea v-model="prizesText" rows="10" cols="30" placeholder="獎品, 數量"></textarea>
                <button @click="savePrizes">儲存獎品</button>
            </div>
            <div class="name-editor">
                <h3>空箱數量</h3>
                <input v-model="totalEmptyBoxes" type="number" min="0">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const namesText = ref('');
const names = ref([]);
const shuffledNames = ref([]);
const gameBoard = ref([]);
const gameStarted = ref(false);
const winners = ref([]);
const currentPlayerIndex = ref(0);
const playersTakenTurn = ref([]);
const totalEmptyBoxes = ref(0);

const prizesText = ref('');
// Define prizes with different levels
const prizes = ref([]);

// Computed property for the current player
const currentPlayer = computed(() => shuffledNames.value[currentPlayerIndex.value]);

// Shuffle the names list
const shuffleNames = () => {
    shuffledNames.value = [...names.value].sort(() => Math.random() - 0.5);
    playersTakenTurn.value = []; // Reset the list of players who have taken turns
    currentPlayerIndex.value = 0;
};

// Start the treasure hunt game
const startGame = () => {
    gameStarted.value = true;
    gameBoard.value = [];

    // Create a flat list of all prizes
    let allPrizes = prizes.value.flatMap(prize =>
        Array(prize.count).fill(prize.prize)
    );

    // Add empty boxes
    allPrizes = allPrizes.concat(Array(totalEmptyBoxes.value).fill('Empty'));

    // Shuffle the prizes with empty boxes
    allPrizes.sort(() => Math.random() - 0.5);

    // Assign prizes or empty slots to boxes, not players
    gameBoard.value = allPrizes.map(prize => ({ content: prize, revealed: false, chosenBy: '' }));
};

// Dig into a cell
const dig = (index) => {
    if (gameBoard.value[index].revealed || playersTakenTurn.value.includes(currentPlayer.value)) return;
    gameBoard.value[index].revealed = true;
    gameBoard.value[index].chosenBy = currentPlayer.value; // Record who chose this box

    if (gameBoard.value[index].content !== 'Empty') {
        winners.value.push({ chosenBy: currentPlayer.value, prize: gameBoard.value[index].content });
    } else {
        winners.value.push({ chosenBy: currentPlayer.value, prize: null }); // Record empty box selection
    }

    playersTakenTurn.value.push(currentPlayer.value); // Mark that this player has taken their turn
    nextPlayer();
};

// Move to the next player who hasn't taken their turn yet
const nextPlayer = () => {
    let nextIndex = currentPlayerIndex.value;
    do {
        nextIndex = (nextIndex + 1) % shuffledNames.value.length;
    } while (playersTakenTurn.value.includes(shuffledNames.value[nextIndex]) && playersTakenTurn.value.length < shuffledNames.value.length);

    currentPlayerIndex.value = nextIndex;

    if (playersTakenTurn.value.length === shuffledNames.value.length) {
        console.log("Game over! All players have taken their turns.");
        // Here you might want to add logic to end the game or reset for another round
    }
};

const saveNames = () => {
    localStorage.treasureHuntNames = namesText.value;
    names.value = namesText.value.split('\n').map(name => name.trim()).filter(name => name);
    shuffleNames();
};

const savePrizes = () => {
    localStorage.treasureHuntPrizes = prizesText.value;
    prizes.value = prizesText.value.split('\n').map(prize => {
        const [prizeName, count] = prize.split(',').map(item => item.trim());
        return { prize: prizeName, count: parseInt(count) };
    });
};

const reset = () => {
    gameStarted.value = false;
    winners.value = [];
    playersTakenTurn.value = [];
    currentPlayerIndex.value = 0;
    shuffleNames();
};

onMounted(() => {
    if (localStorage.treasureHuntNames) {
        namesText.value = localStorage.treasureHuntNames;
        names.value = namesText.value.split('\n').map(name => name.trim()).filter(name => name);
    }

    if (localStorage.treasureHuntPrizes) {
        prizesText.value = localStorage.treasureHuntPrizes;
        prizes.value = prizesText.value.split('\n').map(prize => {
            const [prizeName, count] = prize.split(',').map(item => item.trim());
            return { prize: prizeName, count: parseInt(count) };
        });
    }
})
</script>

<style scoped>
.container {
    text-align: center;
}

.game-area {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.player-list {
    width: 200px;
    text-align: left;
    margin-right: 20px;
}

.name-editor {
    display: flex;
    flex-direction: column;
    width: 200px;
    text-align: center;
    margin-left: 20px;
    gap: 8px;
}

.game-board {
    flex-grow: 1;
}

#game-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    max-width: 500px;
    margin: 20px auto;
    color: black;
}

.cell {
    width: 100px;
    height: 100px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.3s;
}

.cell:hover {
    background-color: #e0e0e0;
}

.cell.revealed {
    background-color: #d0d0d0;
}

#winners-list {
    margin-top: 20px;
    text-align: left;
}

.current-player {
    font-weight: bold;
}

.taken-turn {
    text-decoration: line-through;
}
</style>