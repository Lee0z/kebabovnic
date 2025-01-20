<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import KebabPlaceDetails from '@/components/KebabPlaceDetails.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Pusher from 'pusher-js';

const map = ref(null);
const kebabPlaces = ref([]);
const selectedKebabPlace = ref(null);
const isModalOpen = ref(false);

const fetchKebabPlaces = async () => {
  try {
    const data = await get('/kebab-places?paginate=1000');
    kebabPlaces.value = data.data.map(place => new KebabPlace(place));
    kebabPlaces.value.forEach(addKebabPlaceToMap);
  } catch (error) {
    console.error('Error fetching kebab places:', error);
  }
};

const addKebabPlaceToMap = (kebabPlace) => {
  const { latitude, longitude } = kebabPlace.getCoordinates();
  const marker = L.marker([latitude, longitude]).addTo(map.value)

  marker.on('click', () => {
    openModal(kebabPlace);
  });
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
  map.value = L.map('map').setView([51.207, 16.161], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  fetchKebabPlaces();

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_WEBSOCKET_DOMAIN,
  });

  const channel = pusher.subscribe('kebab-places');

  channel.bind('KebabPlaceCreated', (event) => {
    const kebabPlaceData = event.kebabPlace;
    const kebabPlace = new KebabPlace(kebabPlaceData);
    addKebabPlaceToMap(kebabPlace);
  });

  window.addEventListener('resize', () => {
    map.value.invalidateSize();
  });
});
</script>

<template>
  <main class="flex flex-col items-center flex-grow h-screen pt-16 w-full">
    <div class="map-container flex-grow w-full max-w-4xl mx-auto">
      <div id="map" class="h-full w-full"></div>
    </div>
    <KebabPlaceDetails :isOpen="isModalOpen" :onRequestClose="closeModal" :kebabPlace="selectedKebabPlace" class="z-50" />
  </main>
</template>

<style scoped>
.map-container {
  flex-grow: 1;
  max-width: 100%;
  max-height: 100%;
  position: relative;
}

#map {
  height: 100%;
  width: 100%;
  z-index: 1;
  background-color: #1a1a1a;
}
</style>
