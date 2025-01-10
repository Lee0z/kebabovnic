<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import LoginRegisterModal from '@/components/loginRegisterModal.vue'

const loginRegisterModal = ref(null)

const openModal = () => {
  loginRegisterModal.value.openModal()
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppBar @open-modal="openModal" />
    <main class="flex-grow flex items-center justify-center">
      <RouterView />
    </main>
    <LoginRegisterModal ref="loginRegisterModal" />
  </div>
</template>

