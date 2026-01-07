<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = import.meta.env.VITE_APP_TITLE
})
</script>

<style lang="scss">
#app {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
