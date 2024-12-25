<template>
  <div id="app" class="container">
    <div class="tabs">
      <button :class="{ active: currentTab === 'Spin' }" @click="currentTab = 'Spin'">轉盤</button>
      <button :class="{ active: currentTab === 'TreasureHunt' }" @click="currentTab = 'TreasureHunt'">尋寶</button>
    </div>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
import Spin from './components/Spin.vue';
import TreasureHunt from './components/TreasureHunt.vue';

export default {
  name: 'App',
  components: {
    Spin,
    TreasureHunt,
  },
  data() {
    return {
      currentTab: 'Spin',
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: white;
}
</style>