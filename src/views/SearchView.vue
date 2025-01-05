<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/utils/api';

const searchResults = ref([]);

const fetchSearchResults = async () => {
  try {
    const data = await get('/search', { query: 'kebab' }); // Adjust the endpoint and parameters as needed
    searchResults.value = data.results;
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

onMounted(() => {
  fetchSearchResults();
});
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold text-center my-8">Search Results</h1>
    <ul>
      <li v-for="result in searchResults" :key="result.id">{{ result.name }}</li>
    </ul>
  </div>
</template>
