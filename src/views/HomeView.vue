<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { get } from '@/utils/api'
import KebabPlace from '@/models/KebabPlaceModel'
import echo from '@/utils/echo'


onMounted(async () => {
  const map = L.map('map').setView([51.207, 16.161], 13)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  const addKebabPlaceToMap = (kebabPlace) => {
    const { latitude, longitude } = kebabPlace.getCoordinates()
    L.marker([latitude, longitude],).addTo(map)
      .bindPopup(`<b>${kebabPlace.name}</b><br>${kebabPlace.address}`)
  }

  try {
    const response = await get('/kebab-places')
    const kebabPlaces = response.data.map(place => new KebabPlace(place))

    kebabPlaces.forEach(kebabPlace => {
      addKebabPlaceToMap(kebabPlace)
    })
  } catch (error) {
    console.error('Error fetching kebab places:', error)
  }

  echo.channel('kebab-place-created')
    .listen('KebabPlaceCreated', (event) => {
      const kebabPlace = new KebabPlace(event.kebabPlace)
      addKebabPlaceToMap(kebabPlace)
    })

  window.addEventListener('resize', () => {
    map.invalidateSize()
  })
})
</script>

<template>
  <main class="flex flex-col items-center flex-grow h-screen pt-16 w-full">
    <div class="map-container flex-grow w-full max-w-4xl mx-auto">
      <div id="map" class="h-full w-full"></div>
    </div>
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
