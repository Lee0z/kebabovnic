<template>
  <nav class="app-bar p-4 top-0 z-50 flex items-center shadow-md">
    <div class="flex-1 flex justify-center">
      <div class="logo text-2xl md:text-5xl font-bold">Kebabovnic</div>
    </div>
    <div class="nav-links flex items-center space-x-4 text-lg absolute right-4">
      <RouterLink to="/" class="flex items-center space-x-2">
        <HomeIcon class="w-6 h-6" />
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/search" class="flex items-center space-x-2">
        <MagnifyingGlassIcon class="w-6 h-6" />
        <span>List kebabs</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { HomeIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.app-bar {
  background-color: var(--color-background);
}
</style>