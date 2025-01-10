<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-white">{{ isLogin ? 'Login' : 'Register' }}</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
          <input type="email" id="email" v-model="email" required class="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
          <input type="password" id="password" v-model="password" required class="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-sm" />
        </div>
        <div v-if="!isLogin" class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required class="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-sm" />
        </div>
        <div class="flex justify-between items-center">
          <button type="submit" class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
            {{ isLogin ? 'Login' : 'Register' }}
          </button>
          <button type="button" @click="toggleMode" class="text-emerald-400 hover:text-emerald-200">
            {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const isOpen = ref(false)
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = () => {
  if (isLogin.value) {
    // Handle login logic
    console.log('Logging in with', email.value, password.value)
  } else {
    // Handle register logic
    console.log('Registering with', email.value, password.value, confirmPassword.value)
  }
  closeModal()
}

defineExpose({
  openModal,
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
