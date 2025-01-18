<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
      <span class="text-gray-500 hover:text-gray-900 cursor-pointer float-right text-2xl" @click="onRequestClose">&times;</span>
      <h2 class="text-2xl font-bold mb-4">{{ kebabPlace.name }}</h2>
      <img :src="kebabPlace.image" :alt="kebabPlace.name" class="w-full h-auto mb-4" />
      <p class="mb-2"><strong>Address:</strong> {{ kebabPlace.address }}</p>
      <p class="mb-2"><strong>Phone:</strong> {{ kebabPlace.phone }}</p>
      <p class="mb-2"><strong>Website:</strong> <a :href="kebabPlace.website" target="_blank" class="text-blue-500">{{ kebabPlace.website }}</a></p>
      <p class="mb-2"><strong>Google Maps Rating:</strong> {{ kebabPlace.googleMapsRating }}</p>
      <p class="mb-2"><strong>Opened At:</strong> {{ kebabPlace.openedAtYear }}</p>
      <p class="mb-2"><strong>Closed At:</strong> {{ kebabPlace.closedAtYear }}</p>
      <p class="mb-2"><strong>Opening Hours:</strong> {{ kebabPlace.openingHours }}</p>
      <p class="mb-2"><strong>Fillings:</strong></p>
      <div class="mb-2">
        <BadgeComponent v-for="filling in kebabPlace.fillings" :key="filling" :text="filling" color="blue" />
      </div>
      <p class="mb-2"><strong>Sauces:</strong></p>
      <div class="mb-2">
        <BadgeComponent v-for="sauce in kebabPlace.sauces" :key="sauce" :text="sauce" color="green" />
      </div>
      <p class="mb-2"><strong>Status:</strong> <BadgeComponent :text="kebabPlace.status" color="red" /></p>
      <p class="mb-2"><strong>Is Craft:</strong> <BadgeComponent :text="kebabPlace.isCraft ? 'Yes' : 'No'" color="purple" /></p>
      <p class="mb-2"><strong>Is Chain Restaurant:</strong> <BadgeComponent :text="kebabPlace.isChainRestaurant ? 'Yes' : 'No'" color="yellow" /></p>
      <p class="mb-2"><strong>Location Type:</strong> {{ kebabPlace.locationType }}</p>
      <p class="mb-2"><strong>Order Options:</strong></p>
      <div class="mb-2">
        <BadgeComponent v-for="option in kebabPlace.orderOptions" :key="option" :text="option" color="orange" />
      </div>
      <p class="mb-2"><strong>Social Media:</strong></p>
      <div class="mb-2">
        <BadgeComponent v-for="social in kebabPlace.socialMedia" :key="social" :text="social" color="pink" />
      </div>
      <p class="mb-2"><strong>Created At:</strong> {{ new Date(kebabPlace.createdAt).toLocaleDateString() }}</p>
      <p class="mb-2"><strong>Updated At:</strong> {{ new Date(kebabPlace.updatedAt).toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script>
import BadgeComponent from './BadgeComponent.vue';

export default {
  components: {
    BadgeComponent
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    onRequestClose: {
      type: Function,
      required: true
    },
    kebabPlace: {
      type: Object,
      required: true
    }
  }
};
</script>
