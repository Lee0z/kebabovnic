<template>
  <div class="suggestions-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-emerald-950 p-4 rounded shadow-lg w-11/12 md:w-1/2">
      <h2 class="text-xl font-bold mb-4">My Suggestions</h2>
      <ul v-if="suggestions.length > 0">
        <li v-for="suggestion in suggestions" :key="suggestion.id" class="mb-4 p-2 border-b">
          <h3 class="font-semibold">{{ suggestion.name }}</h3>
          <p>{{ suggestion.description }}</p>
          <p>Status: {{ suggestion.status }}</p>
          <p v-if="suggestion.comment">Comment: {{ suggestion.comment }}</p>
          <p>Created at: {{ suggestion.created_at.toLocaleString() }}</p>
          <p>Updated at: {{ suggestion.updated_at.toLocaleString() }}</p>
        </li>
      </ul>
      <div v-else class="flex flex-col items-center">
        <InboxIcon class="w-16 h-16 text-gray-500" />
        <p class="mt-4 text-gray-500">No suggestions posted yet!</p>
      </div>
      <button @click="$emit('close')" class="mt-4 bg-emerald-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'universal-cookie'
import SuggestionModel from '../models/SuggestionModel'
import { InboxIcon } from '@heroicons/vue/24/outline'

const cookies = new Cookies()
const suggestions = ref([])

onMounted(() => {
  const token = cookies.get('auth_token')
  if (token) {
    fetch(`${import.meta.env.VITE_API_URL}/mysuggestions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      suggestions.value = SuggestionModel.fromApiResponse(data).filter(suggestion => suggestion.user_id === parseInt(cookies.get('user_id')))
    })
    .catch(error => {
      console.error('Error fetching suggestions:', error)
    })
  }
})

</script>

<style scoped>
.suggestions-modal {
  z-index: 1000;
}
</style>
