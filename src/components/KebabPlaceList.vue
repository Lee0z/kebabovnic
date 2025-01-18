<script setup>
import { ref, onMounted, computed, watch, defineEmits } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import BadgeComponent from '@/components/BadgeComponent.vue';

const kebabPlaces = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(4);
const sortBy = ref('name');
const sortOrder = ref('asc');
const filterCraft = ref(false);
const filterChainRestaurant = ref(false);
const filterLocationType = ref('');
const filterStatus = ref('');

const fetchKebabPlaces = async (page = 1, perPage = 4) => {
  try {
    const data = await get('/kebab-places', { page, per_page: perPage });
    kebabPlaces.value = data.data.map(place => new KebabPlace(place));
    currentPage.value = data.current_page;
    totalPages.value = data.last_page;
  } catch (error) {
    console.error('Error fetching kebab places:', error);
  }
};

const sortedKebabPlaces = computed(() => {
  return kebabPlaces.value.slice().sort((a, b) => {
    let result = 0;
    if (sortBy.value === 'name') {
      result = a.name.localeCompare(b.name);
    } else if (sortBy.value === 'openingDate') {
      result = (a.openedAtYear || 0) - (b.openedAtYear || 0);
    } else if (sortBy.value === 'googleRating') {
      result = (b.googleMapsRating || 0) - (a.googleMapsRating || 0);
    }
    return sortOrder.value === 'asc' ? result : -result;
  });
});

const filteredKebabPlaces = computed(() => {
  return sortedKebabPlaces.value.filter(place => {
    const matchesSearchQuery = place.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCraft = !filterCraft.value || place.isCraft;
    const matchesChainRestaurant = !filterChainRestaurant.value || place.isChainRestaurant;
    const matchesLocationType = !filterLocationType.value || place.locationType === filterLocationType.value;
    const matchesStatus = !filterStatus.value || place.status === filterStatus.value;
    return matchesSearchQuery && matchesCraft && matchesChainRestaurant && matchesLocationType && matchesStatus;
  });
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchKebabPlaces(page, itemsPerPage.value);
  }
};

watch(itemsPerPage, () => {
  fetchKebabPlaces(currentPage.value, itemsPerPage.value);
});

onMounted(() => {
  fetchKebabPlaces();
});

const emits = defineEmits(['kebabPlaceClick']);
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="mb-4 w-full max-w-2xl flex flex-col items-center">
      <span class="mb-2">Found {{ filteredKebabPlaces.length }} kebabs!</span>
      <div class="w-full flex mb-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name"
          class="flex-1 p-2 bg-emerald-800 border border-emerald-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
        />
        <button
          @click="fetchKebabPlaces"
          class="p-2 bg-emerald-500 text-white rounded-r-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Search
        </button>
      </div>
      <div class="w-full flex justify-end mb-2">
        <label for="sort" class="mr-2">Sort by:</label>
        <select v-model="sortBy" id="sort" class="p-2 border bg-emerald-900 border-gray-300 rounded-lg mr-2">
          <option value="name">Name</option>
          <option value="openingDate">Opening Date</option>
          <option value="googleRating">Google Rating</option>
        </select>
        <select v-model="sortOrder" class="p-2 border bg-emerald-900 border-gray-300 rounded-lg">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div class="w-full flex flex-wrap gap-2 justify-end mb-2">
        <label class="mr-2">Filters:</label>
        <BadgeComponent text="Craft" color="purple" @click="filterCraft = !filterCraft" :class="{ 'bg-purple-500': filterCraft }" />
        <BadgeComponent text="Chain Restaurant" color="gray" @click="filterChainRestaurant = !filterChainRestaurant" :class="{ 'bg-gray-500': filterChainRestaurant }" />
        <BadgeComponent text="Restaurant" color="orange" @click="filterLocationType = filterLocationType === 'lokal' ? '' : 'lokal'" :class="{ 'bg-orange-500': filterLocationType === 'lokal' }" />
        <BadgeComponent text="Food Truck" color="orange" @click="filterLocationType = filterLocationType === 'buda' ? '' : 'buda'" :class="{ 'bg-orange-500': filterLocationType === 'buda' }" />
        <BadgeComponent text="Open" color="green" @click="filterStatus = filterStatus === 'otwarte' ? '' : 'otwarte'" :class="{ 'bg-green-500': filterStatus === 'otwarte' }" />
        <BadgeComponent text="Closed" color="red" @click="filterStatus = filterStatus === 'zamknięte' ? '' : 'zamknięte'" :class="{ 'bg-red-500': filterStatus === 'zamknięte' }" />
      </div>
    </div>
    <TransitionGroup name="list" tag="ul" class="w-full max-w-2xl">
      <li v-for="place in filteredKebabPlaces" :key="place.id" class="flex flex-col mb-2 p-2 border border-gray-300 rounded-lg hover:bg-emerald-900 cursor-pointer" @click="emits('kebabPlaceClick', place)">
        <div class="flex-1">
          <h2 class="text-lg font-bold mb-1">{{ place.name }}</h2>
          <p class="mb-1">{{ place.address }}</p>
          <div class="flex flex-wrap gap-2 mb-1">
            <BadgeComponent v-if="place.isChainRestaurant" text="Chain Restaurant" color="gray" />
            <BadgeComponent v-if="place.isCraft" text="Craft" color="purple" />
            <BadgeComponent v-if="place.locationType" :text="place.locationType === 'lokal' ? 'Restaurant' : 'Food Truck'" color="orange" />
            <BadgeComponent :text="place.status === 'otwarte' ? 'Open' : 'Closed'" :color="place.status === 'otwarte' ? 'green' : 'red'" />
            <BadgeComponent v-if="place.openedAtYear" :text="`Since ${place.openedAtYear}`" color="blue" />
            <BadgeComponent v-if="place.googleMapsRating" :text="`⭐️ ${place.googleMapsRating}`" color="yellow" />
          </div>
          <a :href="place.googleMapsUrl" target="_blank" class="text-emerald-500 hover:underline">View on Google Maps</a>
        </div>
      </li>
    </TransitionGroup>
    <div class="flex justify-between items-center w-full max-w-2xl mt-4">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Previous
      </button>
      <div class="flex items-center">
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <select v-model="itemsPerPage" class="ml-4 p-2 border border-gray-300 rounded-lg">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

