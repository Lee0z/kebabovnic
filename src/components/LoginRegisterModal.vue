<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="bg-emerald-950 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-white">{{ isLogin ? 'Login' : 'Register' }}</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
          <input type="text" id="name" v-model="name" required class="mt-1 block w-full border border-teal-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-700 text-white sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
          <input type="email" id="email" v-model="email" required class="mt-1 block w-full border border-teal-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-700 text-white sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
          <input type="password" id="password" v-model="password" required class="mt-1 block w-full border border-teal-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-700 text-white sm:text-sm" />
        </div>
        <div v-if="!isLogin" class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required class="mt-1 block w-full border border-teal-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-700 text-white sm:text-sm" />
        </div>
        <div v-if="isLogin" class="mb-4 flex items-center">
          <input type="checkbox" id="rememberMe" v-model="rememberMe" class="mr-2" />
          <label for="rememberMe" class="block text-sm font-medium text-gray-300">Remember Me</label>
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
import { ref, defineExpose, getCurrentInstance } from 'vue'
import { useToast } from 'vue-toastification'
import Cookies from 'universal-cookie'

const toast = useToast()
const cookies = new Cookies()
const { emit } = getCurrentInstance()

const isOpen = ref(false)
const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const rememberMe = ref(false)

const openModal = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  rememberMe.value = false
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const generateRememberToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const handleSubmit = async () => {
  if (isLogin.value) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          remember_token: rememberMe.value ? generateRememberToken() : null,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Login failed with status:', response.status, 'URL:', response.url, 'Response:', errorBody);
        const errorMessage = JSON.parse(errorBody).message || 'Login failed';
        if (errorMessage === 'Unauthorized') {
          toast.error('Login or password mismatch');
        } else {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      const token = data.token;
      const rememberToken = data.remember_token;
      cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
      if (rememberMe.value) {
        cookies.set('remember_token', rememberToken, { secure: true, sameSite: 'strict' });
      }
      toast.success('Login successful');
      const userInfoResponse = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userInfo = await userInfoResponse.json();
      emit('update-username', userInfo.name);
    } catch (error) {
      console.error('Login failed', error);
    }
  } else {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value, // Correct field name
        }),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Registration failed with status:', response.status, 'URL:', response.url, 'Response:', errorBody);
        const errorMessage = JSON.parse(errorBody).message || 'Registration failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.success('Registration successful');
    } catch (error) {
      console.error('Registration failed', error);
    }
  }
  closeModal();
}

const handleLogout = () => {
  cookies.remove('auth_token')
  cookies.remove('remember_token')
  toast.success('Logout successful')
  closeModal()
}

defineExpose({
  openModal,
  closeModal,
  toggleMode,
  handleSubmit,
  handleLogout,
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
