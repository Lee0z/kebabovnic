<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-gray-800 p-4 rounded shadow-lg w-11/12 md:w-1/2">
      <h2 class="text-xl font-bold mb-4">Add New Suggestion</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-white-700">Name</label>
          <input type="text" id="name" v-model="name" required class="mt-1 bg-gray-900 block w-full border border-white-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-white-700">Description</label>
          <textarea id="description" v-model="description" required class="mt-1 bg-gray-900 block w-full border border-white-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, getCurrentInstance } from 'vue'
import { useToast } from 'vue-toastification'
import Cookies from 'universal-cookie'

const toast = useToast()
const cookies = new Cookies()
const props = defineProps({
  kebabPlaceId: {
    type: Number,
    required: true
  }
})
const { emit } = getCurrentInstance()

const name = ref('')
const description = ref('')

const handleSubmit = async () => {
  const token = cookies.get('auth_token')
  const userId = cookies.get('user_id')
  if (!token || !userId) {
    toast.error('You must be logged in to add a suggestion')
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/kebab-places/${props.kebabPlaceId}/suggest?name=${encodeURIComponent(name.value)}&description=${encodeURIComponent(description.value)}&kebabPlace=${props.kebabPlaceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorBody = await response.text()
      const errorMessage = JSON.parse(errorBody).message || 'Failed to add suggestion'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }

    toast.success('Suggestion added successfully')
    emit('close')
  } catch (error) {
    console.error('Error adding suggestion:', error)
  }
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>
