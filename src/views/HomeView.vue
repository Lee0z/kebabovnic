<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

onMounted(() => {
  const map = L.map('map').setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup()
})
</script>

<template>
  <main class="flex flex-col items-center">
    <h1 class="text-4xl font-bold text-center my-8">Home</h1>
    <div class="map-container w-full max-w-4xl mx-auto">
      <div id="map" class="h-96 w-full"></div>
    </div>
  </main>
</template>

<style scoped>
.map-container {
  height: 100%;
}
</style>
