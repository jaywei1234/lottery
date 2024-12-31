<template>
  <div id="app" class="container">
    <div class="tabs">
      <router-link to="/spinner">
        <button :class="{ active: route.name === 'Spinner' }" @click="currentTab = 'Spin'">轉盤</button>
      </router-link>
      <router-link to="/treasure-hunt">
        <button :class="{ active: route.name === 'TreasureHunt' }" @click="currentTab = 'TreasureHunt'">尋寶</button>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route);
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