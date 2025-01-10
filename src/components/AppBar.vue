<template>
  <nav class="app-bar p-4 bg-white fixed w-full top-0 z-50 flex items-center shadow-md">
    <div class="logo absolute left-1/2 transform -translate-x-1/2 text-xl md:text-3xl font-bold">
      Kebabovnic
    </div>
    <div class="nav-links flex items-center space-x-2 text-base md:text-lg ml-auto">
      <RouterLink to="/" class="flex items-center space-x-1 md:space-x-2">
        <HomeIcon class="w-5 h-5 md:w-6 md:h-6" />
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/search" class="flex items-center space-x-1 md:space-x-2">
        <MagnifyingGlassIcon class="w-5 h-5 md:w-6 md:h-6" />
        <span>List kebabs</span>
      </RouterLink>
      <button class="flex items-center space-x-1 md:space-x-2" @click="$emit('open-modal')">
        <UserIcon class="w-5 h-5 md:w-6 md:h-6" />
        <span>Menu</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { HomeIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.app-bar {
  background-color: var(--color-background);
}
</style>
