<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click.self="onRequestClose">
      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <span class="text-gray-500 hover:text-gray-300 cursor-pointer float-right text-2xl" @click="onRequestClose">&times;</span>
        <h2 class="text-xl font-bold mb-4">{{ kebabPlace.name }}</h2>
        <div class="mb-4 flex flex-wrap gap-2">
          <BadgeComponent v-if="kebabPlace.isCraft" text="Craft" color="purple" />
          <BadgeComponent v-if="kebabPlace.isChainRestaurant" text="Chain Restaurant" color="yellow" />
          <BadgeComponent :text="getStatusText(kebabPlace.status)" :color="getStatusColor(kebabPlace.status)" />
          <BadgeComponent :text="getLocationTypeText(kebabPlace.locationType)" color="orange" />
          <div v-for="social in kebabPlace.socialMedia" :key="social.name" class="flex items-center gap-2">
            <a :href="social.url" target="_blank" rel="noopener noreferrer">
              <i :class="getSocialIconClass(social.name)" class="text-pink-500"></i>
            </a>
          </div>
        </div>
        <p v-if="kebabPlace.address" class="mb-2"><strong>Address:</strong> {{ kebabPlace.address }}</p>
        <p v-if="kebabPlace.phone" class="mb-2"><strong>Phone:</strong> {{ kebabPlace.phone }}</p>
        <p v-if="kebabPlace.website" class="mb-2"><strong>Website:</strong> <a :href="kebabPlace.website" target="_blank" class="text-blue-400">{{ kebabPlace.website }}</a></p>
        <p v-if="kebabPlace.googleMapsRating" class="mb-2"><strong>Google Maps Rating:</strong> {{ kebabPlace.googleMapsRating }}</p>
        <p v-if="kebabPlace.openedAtYear" class="mb-2"><strong>Opened At:</strong> {{ kebabPlace.openedAtYear }}</p>
        <p v-if="kebabPlace.closedAtYear" class="mb-2"><strong>Closed At:</strong> {{ kebabPlace.closedAtYear }}</p>
        <p class="mb-2"><strong>Opening Hours:</strong></p>
        <table class="mb-2 w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-700">
              <th class="p-2 border border-gray-600">Day</th>
              <th class="p-2 border border-gray-600">From</th>
              <th class="p-2 border border-gray-600">To</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hours in kebabPlace.openingHours" :key="hours.day" class="hover:bg-gray-700">
              <td class="p-2 border border-gray-600">{{ translateDay(hours.day) }}</td>
              <td class="p-2 border border-gray-600" :class="{ 'text-red-500': !hours.from || hours.from === 'nieczynne' }">{{ hours.from === 'nieczynne' ? 'Closed' : (hours.from || 'Closed') }}</td>
              <td class="p-2 border border-gray-600" :class="{ 'text-red-500': !hours.to || hours.to === 'nieczynne' }">{{ hours.to === 'nieczynne' ? 'Closed' : (hours.to || 'Closed') }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="fillings.length" class="mb-2"><strong>Fillings:</strong></p>
        <div v-if="fillings.length" class="mb-2 flex flex-wrap gap-2">
          <BadgeComponent v-for="filling in fillings" :key="filling.id" :text="filling.name" :color="filling.hexColor" />
        </div>
        <p v-if="sauces.length" class="mb-2"><strong>Sauces:</strong></p>
        <div v-if="sauces.length" class="mb-2 flex flex-wrap gap-2">
          <BadgeComponent v-for="sauce in sauces" :key="sauce.id" :text="sauce.name" :color="sauce.hexColor" />
        </div>
        <p v-if="translatedOrderOptions.length" class="mb-2"><strong>Order Options:</strong></p>
        <div v-if="translatedOrderOptions.length" class="mb-2 flex flex-wrap gap-2">
          <BadgeComponent v-for="option in translatedOrderOptions" :key="option" :text="option" color="orange" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BadgeComponent from './BadgeComponent.vue';
import { ref, watch, computed } from 'vue';
import { get } from '@/utils/api';
import Filling from '@/models/FillingModel';
import Sauce from '@/models/SauceModel';

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
      required: true,
      default: () => ({})
    }
  },
  setup(props) {
    const fillings = ref([]);
    const sauces = ref([]);

    const fetchFillings = async () => {
      try {
        const response = await get('/fillings');
        if (response) {
          fillings.value = response
            .filter(filling => props.kebabPlace.fillings.includes(filling.id))
            .map(filling => new Filling(filling));
        }
      } catch (error) {
        console.error('Error fetching fillings:', error);
      }
    };

    const fetchSauces = async () => {
      try {
        const response = await get('/sauces');
        if (response) {
          sauces.value = response
            .filter(sauce => props.kebabPlace.sauces.includes(sauce.id))
            .map(sauce => new Sauce(sauce));
        }
      } catch (error) {
        console.error('Error fetching sauces:', error);
      }
    };

    watch(() => props.kebabPlace, () => {
      if (props.kebabPlace) {
        fetchFillings();
        fetchSauces();
      }
    }, { immediate: true });

    const getStatusText = (status) => {
      switch (status) {
        case 'otwarte':
          return 'Open';
        case 'zamknięte':
          return 'Closed';
        case 'planowane':
          return 'Planned';
        default:
          return status;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'otwarte':
          return 'green';
        case 'zamknięte':
          return 'red';
        case 'planowane':
          return 'orange';
        default:
          return 'gray';
      }
    };

    const getLocationTypeText = (locationType) => {
      switch (locationType) {
        case 'lokal':
          return 'Restaurant';
        case 'buda':
          return 'Food Truck';
        default:
          return locationType;
      }
    };

    const translateOrderOption = (option) => {
      switch (option) {
        case 'przez telefon':
          return 'By Phone';
        case 'własna strona':
          return 'Own Website';
        case 'własna aplikacja':
          return 'Own App';
        default:
          return option;
      }
    };

    const translatedOrderOptions = computed(() => {
      return props.kebabPlace.orderOptions.map(option => translateOrderOption(option));
    });

    const translateDay = (day) => {
      switch (day) {
        case 'Poniedziałek':
          return 'Monday';
        case 'Wtorek':
          return 'Tuesday';
        case 'Środa':
          return 'Wednesday';
        case 'Czwartek':
          return 'Thursday';
        case 'Piątek':
          return 'Friday';
        case 'Sobota':
          return 'Saturday';
        case 'Niedziela':
          return 'Sunday';
        default:
          return day;
      }
    };

    return {
      fillings,
      sauces,
      getStatusText,
      getStatusColor,
      getLocationTypeText,
      translatedOrderOptions,
      translateDay,
      getSocialIconClass(name) {
        switch (name.toLowerCase()) {
          case 'facebook':
            return 'fab fa-facebook';
          case 'instagram':
            return 'fab fa-instagram';
          case 'tiktok':
            return 'fab fa-tiktok';
          case 'x':
            return 'fab fa-twitter';
          default:
            return '';
        }
      }
    };
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>


