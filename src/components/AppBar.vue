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
      <span v-if="username" class="text-white mr-4">Hello, {{ username }}!</span>
      <button v-if="username" @click="handleLogout" class="flex items-center space-x-1 md:space-x-2">
        <UserIcon class="w-5 h-5 md:w-6 md:h-6" />
        <span>Logout</span>
      </button>
      <button v-else class="flex items-center space-x-1 md:space-x-2" @click="$emit('open-modal')">
        <UserIcon class="w-5 h-5 md:w-6 md:h-6" />
        <span>Login</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { HomeIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import Cookies from 'universal-cookie'
import { useToast } from 'vue-toastification'

const cookies = new Cookies()
const username = ref('')
const toast = useToast()

const handleLogout = () => {
  cookies.remove('auth_token')
  username.value = ''
  toast.success('Logout successful')
}

onMounted(() => {
  const token = cookies.get('auth_token')
  if (token) {
    // Fetch user info using the token
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      username.value = data.name
    })
    .catch(() => {
      handleLogout()
    })
  }
})

defineExpose({
  updateUsername: (name) => {
    username.value = name
  }
})
</script>

<style scoped>
.app-bar {
  background-color: var(--color-background);
}
</style>
