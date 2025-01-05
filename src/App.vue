<script setup>
import { RouterView } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppBar />
    <main class="flex-grow flex items-center justify-center pt-20">
      <RouterView />
    </main>
  </div>
</template>

