<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="page-container">
        <div class="spinner-container">
            <h1 style="color: red;">輪盤</h1>
            <ul class="name-list">
                <li v-for="(name, index) in names" :key="index" :class="{ selected: index === selectedIndex }">
                    {{ name }}
                </li>
            </ul>
            <button @click="spin">開轉</button>
            <div v-if="winner" class="winner">
                🎉 得獎者: {{ winner }} 🎉
            </div>
        </div>

        <div class="name-editor">
            <h3>名單編輯</h3>
            <textarea v-model="namesText" rows="10" cols="30"></textarea>
            <button @click="saveNames">儲存名單</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const names = ref([]);
const namesText = ref('');
const selectedIndex = ref(null);
const winner = ref(null);
const spinning = ref(false);

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const spin = () => {
    if (spinning.value) return;
    spinning.value = true;
    winner.value = null;
    let spinCount = 0;
    const totalSpins = 30;
    const spinInterval = setInterval(() => {
        selectedIndex.value = Math.floor(Math.random() * names.value.length);
        spinCount++;
        if (spinCount >= totalSpins) {
            clearInterval(spinInterval);
            winner.value = names.value[selectedIndex.value];
            spinning.value = false;
        }
    }, 100);
};

const saveNames = () => {
    localStorage.spinnerNames = namesText.value;
    names.value = namesText.value.split('\n').map(name => name.trim()).filter(name => name);
    selectedIndex.value = null;
    winner.value = null;
};

onMounted(() => {
    if (localStorage.spinnerNames) {
        namesText.value = localStorage.spinnerNames;
        names.value = localStorage.spinnerNames.split('\n');
        names.value = shuffleArray(names.value);
    }
});
</script>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    position: relative;
}

.spinner-container {
    text-align: center;
    margin-inline: auto;
}

.name-list {
    list-style-type: none;
    padding: 0;
}

.name-list li {
    font-size: 20px;
    margin: 5px 0;
}

.name-list li.selected {
    color: red;
    font-weight: bold;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
}

.winner {
    margin-top: 20px;
    font-size: 24px;
    color: green;
}

.name-editor {
    position: absolute;
    right: 20px;
    top: 20px;
    width: fit-content;
    text-align: center;
    display: flex;
    flex-direction: column;
}
</style>