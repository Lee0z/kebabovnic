<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import KebabPlaceList from '@/components/KebabPlaceList.vue';
import echo from '@/utils/echo';

const searchResults = ref([]);

const fetchSearchResults = async () => {
  try {
    const data = await get('/kebab-places');
    searchResults.value = data.data.map(place => new KebabPlace(place));
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

onMounted(() => {
  fetchSearchResults();

  echo.channel('kebab-places')
    .listen('kebab-place-created', (event) => {
      const kebabPlace = new KebabPlace(event.kebabPlace);
      searchResults.value.push(kebabPlace);
    });
});
</script>

<template>
  <div class="kebab-list flex flex-col items-center w-full max-w-4xl mx-auto">
    <KebabPlaceList :kebabPlaces="searchResults" />
  </div>
</template>

<style scoped>
.kebab-list {
  margin-top: 10rem;
}
</style>
