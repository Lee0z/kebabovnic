<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import KebabPlaceList from '@/components/KebabPlaceList.vue';
import KebabPlaceDetails from '@/components/KebabPlaceDetails.vue';
import LoginRegisterModal from '@/components/LoginRegisterModal.vue';
import Pusher from 'pusher-js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const searchResults = ref([]);
const selectedKebabPlace = ref(null);
const isModalOpen = ref(false);
const isLoggedIn = ref(false);
const loggedInUserId = ref(null);
const userName = ref('');

const fetchSearchResults = async () => {
  try {
    const data = await get('/kebab-places');
    searchResults.value = data.data.map(place => new KebabPlace(place));
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

const openModal = (kebabPlace) => {
  selectedKebabPlace.value = kebabPlace;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedKebabPlace.value = null;
};

const updateUserName = (name) => {
  userName.value = name;
};

onMounted(() => {
  fetchSearchResults();

  const token = cookies.get('auth_token');
  if (token) {
    isLoggedIn.value = true;
    loggedInUserId.value = Number(localStorage.getItem('userId'));
    userName.value = localStorage.getItem('userName');
  }

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_WEBSOCKET_DOMAIN,
  });

  const channel = pusher.subscribe('kebab-places');

  channel.bind('KebabPlaceCreated', (event) => {
    const kebabPlaceData = event.kebabPlace;
    const kebabPlace = new KebabPlace(kebabPlaceData);
    searchResults.value.push(kebabPlace);
  });

  channel.bind('KebabPlaceDeleted', (event) => {
    const kebabPlaceId = event.kebabPlace.id;
    searchResults.value = searchResults.value.filter(place => place.id !== kebabPlaceId);
  });

  channel.bind('KebabPlaceRatingChanged', (event) => {
    const updatedKebabPlace = new KebabPlace(event.kebabPlace);
    const index = searchResults.value.findIndex(place => place.id === updatedKebabPlace.id);
    if (index !== -1) {
      searchResults.value[index] = updatedKebabPlace;
    }
  });

  channel.bind('KebabPlaceUpdated', (event) => {
    const updatedKebabPlace = new KebabPlace(event.kebabPlace);
    const index = searchResults.value.findIndex(place => place.id === updatedKebabPlace.id);
    if (index !== -1) {
      searchResults.value[index] = updatedKebabPlace;
    }
  });
});
</script>

<template>
  <div class="kebab-list flex flex-col items-center w-full max-w-4xl mx-auto">
    <KebabPlaceList :kebabPlaces="searchResults" @kebabPlaceClick="openModal" />
    <KebabPlaceDetails :isOpen="isModalOpen" :onRequestClose="closeModal" :kebabPlace="selectedKebabPlace" :isLoggedIn="isLoggedIn" :loggedInUserId="loggedInUserId" />
    <LoginRegisterModal @update-username="updateUserName" />
  </div>
</template>

<style scoped>
.kebab-list {
  margin-top: 10rem;
}
</style>
