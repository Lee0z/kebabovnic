<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import KebabPlaceList from '@/components/KebabPlaceList.vue';
import KebabPlaceDetails from '@/components/KebabPlaceDetails.vue';
import Pusher from 'pusher-js';

const searchResults = ref([]);
const selectedKebabPlace = ref(null);
const isModalOpen = ref(false);

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

onMounted(() => {
  fetchSearchResults();

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_WEBSOCKET_DOMAIN,
  });

  Pusher.logToConsole = true;

  const channel = pusher.subscribe('kebab-places');
  console.log('Subscribed to channel:', channel.name);

  channel.bind('KebabPlaceCreated', (event) => {
    console.log('KebabPlaceCreated event received', event)
    const kebabPlaceData = event.kebabPlace;
    console.log('KebabPlace data:', kebabPlaceData);
    const kebabPlace = new KebabPlace(kebabPlaceData);
    console.log('Adding kebab place to search results:', kebabPlace);
    searchResults.value.push(kebabPlace);
  });
});
</script>

<template>
  <div class="kebab-list flex flex-col items-center w-full max-w-4xl mx-auto">
    <KebabPlaceList :kebabPlaces="searchResults" @kebabPlaceClick="openModal" />
    <KebabPlaceDetails :isOpen="isModalOpen" :onRequestClose="closeModal" :kebabPlace="selectedKebabPlace" />
  </div>
</template>

<style scoped>
.kebab-list {
  margin-top: 10rem;
}
</style>
