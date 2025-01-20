<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import { get } from '@/utils/api';
import KebabPlace from '@/models/KebabPlaceModel';
import BadgeComponent from '@/components/BadgeComponent.vue';
import Filling from '@/models/FillingModel';
import Sauce from '@/models/SauceModel';

const kebabPlaces = ref([]);
const totalKebabPlaces = ref(0);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref('id');
const sortOrder = ref('asc');
const filterCraft = ref(null);
const filterChainRestaurant = ref(false);
const filterLocationType = ref('');
const filterStatus = ref('');
const filterFillings = ref([]);
const filterSauces = ref([]);
const filterLocation = ref('');
const filterChain = ref(null);
const filterOrdering = ref('');
const filterOpen = ref('');
const filterDateTime = ref('');
const allFillings = ref([]);
const allSauces = ref([]);
const showFillings = ref(false);
const showSauces = ref(false);

const fetchKebabPlaces = async (page = 1) => {
  try {
    const params = {
      paginate: itemsPerPage.value,
      page,
      sby: sortBy.value,
      sdirection: sortOrder.value,
      filterFillings: filterFillings.value,
      filterSauces: filterSauces.value,
      filterCraft: filterCraft.value,
      filterLocationType: filterLocationType.value,
      filterStatus: filterStatus.value,
    };

    if (filterFillings.value.length) params.ffillings = JSON.stringify(filterFillings.value);
    if (filterSauces.value.length) params.fsauces = JSON.stringify(filterSauces.value);
    if (filterStatus.value) params.fstatus = filterStatus.value;
    if (filterCraft.value !== null) params.fcraft = filterCraft.value;
    if (filterLocationType.value) params.flocation = filterLocationType.value;
    if (filterChainRestaurant.value) params.fchain = filterChainRestaurant.value;
    if (filterOrdering.value) params.fordering = filterOrdering.value;
    if (filterOpen.value) params.fopen = filterOpen.value;
    if (filterDateTime.value) params.fdatetime = filterDateTime.value;

    console.log('Filter parameters:', params);

    const queryString = new URLSearchParams(params).toString();
    const data = await get(`/kebab-places?${queryString}`);
    kebabPlaces.value = data.data.map(place => new KebabPlace(place));
    totalKebabPlaces.value = data.total;
    currentPage.value = data.current_page;
    totalPages.value = data.last_page;
  } catch (error) {
    console.error('Error fetching kebab places:', error);
  }
};

const fetchFillings = async () => {
  try {
    const response = await get('/fillings');
    allFillings.value = response.map(filling => new Filling(filling));
  } catch (error) {
    console.error('Error fetching fillings:', error);
  }
};

const fetchSauces = async () => {
  try {
    const response = await get('/sauces');
    allSauces.value = response.map(sauce => new Sauce(sauce));
  } catch (error) {
    console.error('Error fetching sauces:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchKebabPlaces(page);
  }
};

watch([itemsPerPage, sortBy, sortOrder, searchQuery, filterCraft, filterChainRestaurant, filterLocationType, filterStatus, filterFillings, filterSauces, filterLocation, filterChain, filterOrdering, filterOpen, filterDateTime], () => {
  fetchKebabPlaces(currentPage.value);
});

onMounted(() => {
  fetchKebabPlaces();
  fetchFillings();
  fetchSauces();
});

const emits = defineEmits(['kebabPlaceClick']);
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="mb-4 w-full max-w-2xl flex flex-col items-center">
      <div class="w-full flex justify-end mb-2">
        <label for="itemsPerPage" class="mr-2">Items per page:</label>
        <select v-model="itemsPerPage" id="itemsPerPage" class="p-2 border bg-emerald-900 border-gray-300 rounded-lg">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <span class="mb-2">Found {{ totalKebabPlaces }} kebabs!</span>
      <div class="w-full flex justify-end mb-2">
        <label for="sort" class="mr-2">Sort by:</label>
        <select v-model="sortBy" id="sort" class="p-2 border bg-emerald-900 border-gray-300 rounded-lg mr-2">
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="googleRating">Google Rating</option>
        </select>
        <select v-model="sortOrder" class="p-2 border bg-emerald-900 border-gray-300 rounded-lg">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div class="w-full flex flex-wrap gap-2 justify-end mb-2">
        <label class="mr-2">Filters:</label>
        <button @click="filterCraft = !filterCraft" :class="{ 'bg-purple-500': filterCraft }" class="p-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Craft
        </button>
        <button @click="filterChainRestaurant = !filterChainRestaurant" :class="{ 'bg-gray-500': filterChainRestaurant }" class="p-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Chain Restaurant
        </button>
        <button @click="filterLocationType = filterLocationType === 'lokal' ? '' : 'lokal'" :class="{ 'bg-orange-500': filterLocationType === 'lokal' }" class="p-2 bg-orange-300 text-white rounded-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500">
          Restaurant
        </button>
        <button @click="filterLocationType = filterLocationType === 'buda' ? '' : 'buda'" :class="{ 'bg-orange-500': filterLocationType === 'buda' }" class="p-2 bg-orange-300 text-white rounded-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500">
          Food Truck
        </button>
        <button @click="filterStatus = filterStatus === 'otwarte' ? '' : 'otwarte'" :class="{ 'bg-green-500': filterStatus === 'otwarte' }" class="p-2 bg-green-300 text-white rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500">
          Open
        </button>
        <button @click="filterStatus = filterStatus === 'zamknięte' ? '' : 'zamknięte'" :class="{ 'bg-red-500': filterStatus === 'zamknięte' }" class="p-2 bg-red-300 text-white rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500">
          Closed
        </button>
        <button @click="showFillings = !showFillings" class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Fillings
        </button>
        <div v-if="showFillings" class="w-full flex flex-wrap gap-2 justify-end mb-2">
          <div v-for="filling in allFillings" :key="filling.id" class="flex items-center gap-2">
            <button @click="filterFillings.includes(filling.id) ? filterFillings.splice(filterFillings.indexOf(filling.id), 1) : filterFillings.push(filling.id)" :class="{ 'bg-blue-500': filterFillings.includes(filling.id) }" class="p-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {{ filling.name }}
            </button>
          </div>
        </div>
        <button @click="showSauces = !showSauces" class="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          Sauces
        </button>
        <div v-if="showSauces" class="w-full flex flex-wrap gap-2 justify-end mb-2">
          <div v-for="sauce in allSauces" :key="sauce.id" class="flex items-center gap-2">
            <button @click="filterSauces.includes(sauce.id) ? filterSauces.splice(filterSauces.indexOf(sauce.id), 1) : filterSauces.push(sauce.id)" :class="{ 'bg-yellow-500': filterSauces.includes(sauce.id) }" class="p-2 bg-yellow-300 text-white rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              {{ sauce.name }}
            </button>
          </div>
        </div>
        <button @click="filterOrdering = filterOrdering === 'przez telefon' ? '' : 'przez telefon'" :class="{ 'bg-indigo-500': filterOrdering === 'przez telefon' }" class="p-2 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          By Phone
        </button>
        <button @click="filterOrdering = filterOrdering === 'własna strona' ? '' : 'własna strona'" :class="{ 'bg-indigo-500': filterOrdering === 'własna strona' }" class="p-2 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Own Website
        </button>
        <button @click="filterOrdering = filterOrdering === 'własna aplikacja' ? '' : 'własna aplikacja'" :class="{ 'bg-indigo-500': filterOrdering === 'własna aplikacja' }" class="p-2 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Own App
        </button>
        <button @click="filterOrdering = filterOrdering === 'pyszne.pl' ? '' : 'pyszne.pl'" :class="{ 'bg-indigo-500': filterOrdering === 'pyszne.pl' }" class="p-2 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Pyszne.pl
        </button>
        <button @click="filterOrdering = filterOrdering === 'glovo' ? '' : 'glovo'" :class="{ 'bg-indigo-500': filterOrdering === 'glovo' }" class="p-2 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Glovo
        </button>
        <button @click="filterOpen = filterOpen === 'open' ? '' : 'open'" :class="{ 'bg-teal-500': filterOpen === 'open' }" class="p-2 bg-teal-300 text-white rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500">
          Open
        </button>
        <button @click="filterOpen = filterOpen === 'closed' ? '' : 'closed'" :class="{ 'bg-teal-500': filterOpen === 'closed' }" class="p-2 bg-teal-300 text-white rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500">
          Closed
        </button>
        <input v-model="filterDateTime" type="text" placeholder="Day-HH:MM" class="p-2 bg-gray-300 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" />
      </div>
    </div>
    <TransitionGroup name="list" tag="ul" class="w-full max-w-2xl">
      <li v-for="place in kebabPlaces" :key="place.id" class="flex flex-col mb-2 p-2 border border-gray-300 rounded-lg hover:bg-emerald-900 cursor-pointer" @click="emits('kebabPlaceClick', place)">
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
          <img v-if="place.image" :src="place.image" alt="Kebab Place Image" class="w-full h-auto mb-2 rounded-lg" />
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

