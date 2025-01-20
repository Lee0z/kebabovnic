<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import LoginRegisterModal from '@/components/LoginRegisterModal.vue' // Import the component
import Cookies from 'universal-cookie';

const loginRegisterModal = ref(null)
const appBar = ref(null)

const openModal = () => {
  loginRegisterModal.value.openModal()
}

const handleLogout = () => {
  loginRegisterModal.value.handleLogout()
}

const updateUsername = (name) => {
  appBar.value.updateUsername(name)
}

const cookies = new Cookies();
const isLoggedIn = ref(!!cookies.get('auth_token'));
const loggedInUserId = ref(cookies.get('user_id'));
const isKebabPlaceDetailsOpen = ref(false);
const selectedKebabPlace = ref(null);


const closeKebabPlaceDetails = () => {
  isKebabPlaceDetailsOpen.value = false;
  selectedKebabPlace.value = null;
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppBar ref="appBar" @open-modal="openModal" @logout="handleLogout" />
    <main class="flex-grow flex items-center justify-center">
      <RouterView />
    </main>
    <LoginRegisterModal ref="loginRegisterModal" @update-username="updateUsername" />
    <KebabPlaceDetails
      :isOpen="isKebabPlaceDetailsOpen"
      :onRequestClose="closeKebabPlaceDetails"
      :kebabPlace="selectedKebabPlace"
      :isLoggedIn="isLoggedIn"
      :loggedInUserId="loggedInUserId"
    />
  </div>
</template>

