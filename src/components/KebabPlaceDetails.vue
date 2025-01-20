<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click.self="onRequestClose">
      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-screen overflow-hidden">
        <div class="overflow-y-auto max-h-[80vh]">
          <div class="flex justify-end items-center mb-4">
            <LightBulbIcon class="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" @click="openSuggestionModal" />
            <XMarkIcon class="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" @click="onRequestClose" />
          </div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">{{ kebabPlace.name }}</h2>
            <button v-if="isLoggedIn" @click="toggleFavorite" class="text-red-500 hover:text-red-700">
              <HeartIcon v-if="isFavorite" class="w-6 h-6" />
              <HeartIconOutline v-else class="w-6 h-6" />
            </button>
          </div>
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
          <p v-if="comments.length" class="mb-2"><strong>Comments:</strong></p>
          <div v-if="comments.length" class="mb-2 flex flex-col gap-2">
            <div v-for="comment in comments" :key="comment.id" class="p-2 bg-gray-700 rounded-lg">
              <p class="mb-1"><strong>{{ comment.userName }}:</strong> {{ comment.content }}</p>
              <p class="text-sm text-gray-400">{{ new Date(comment.createdAt).toLocaleString() }}</p>
              <div v-if="isLoggedIn && comment.userId === loggedInUserId" class="flex gap-2 mt-2">
                <button @click="editComment(comment)" class="text-blue-400 hover:underline">Edit</button>
                <button @click="deleteComment(comment.id)" class="text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          </div>
          <div v-if="isLoggedIn" class="mt-4">
            <textarea v-model="newComment" placeholder="Add a comment..." class="w-full p-2 bg-gray-700 text-white rounded-lg"></textarea>
            <button @click="addComment" class="mt-2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <SuggestionAddComponent v-if="isSuggestionModalOpen" @close="isSuggestionModalOpen = false" :kebabPlaceId="kebabPlace.id" />
</template>

<script>
import BadgeComponent from './BadgeComponent.vue';
import SuggestionAddComponent from './SuggestionAddComponent.vue';
import { ref, watch, computed } from 'vue';
import { get, put, patch, del } from '@/utils/api';
import Filling from '@/models/FillingModel';
import Sauce from '@/models/SauceModel';
import CommentModel from '@/models/CommentModel';
import { XMarkIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline';
import { HeartIcon } from '@heroicons/vue/24/solid';
import Cookies from 'universal-cookie';
import { useToast } from 'vue-toastification';

export default {
  components: {
    BadgeComponent,
    SuggestionAddComponent,
    XMarkIcon,
    LightBulbIcon,
    HeartIcon,
    HeartIconOutline
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
    },
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    loggedInUserId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const cookies = new Cookies();
    const toast = useToast();
    const fillings = ref([]);
    const sauces = ref([]);
    const comments = ref([]);
    const newComment = ref('');
    const editingComment = ref(null);
    const isSuggestionModalOpen = ref(false);
    const isFavorite = ref(props.kebabPlace ? props.kebabPlace.isFavorite : false);

    const openSuggestionModal = () => {
      isSuggestionModalOpen.value = true;
    };

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

    const fetchComments = async () => {
      try {
        const response = await get(`/kebab-places/${props.kebabPlace.id}`);
        if (response) {
          comments.value = CommentModel.fromApiResponse(response.comments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const addComment = async () => {
      if (!newComment.value.trim()) return;
      try {
        const data = await put(`/kebab-places/${props.kebabPlace.id}/comment`, {
          content: newComment.value
        }, {
          headers: {
            Authorization: `Bearer ${cookies.get('auth_token')}`
          }
        });
        comments.value.push(new CommentModel(data.comment));
        newComment.value = '';
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const editComment = (comment) => {
      editingComment.value = { ...comment };
      newComment.value = comment.content;
    };

    const updateComment = async () => {
      if (!editingComment.value || !newComment.value.trim()) return;
      try {
        const data = await patch(`/comment/${editingComment.value.id}`, {
          content: newComment.value
        }, {
          headers: {
            Authorization: `Bearer ${cookies.get('auth_token')}`
          }
        });
        const index = comments.value.findIndex(comment => comment.id === editingComment.value.id);
        if (index !== -1) {
          comments.value[index] = new CommentModel(data.comment);
        }
        editingComment.value = null;
        newComment.value = '';
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    };

    const deleteComment = async (commentId) => {
      try {
        await del(`/comment/${commentId}`, {
          headers: {
            Authorization: `Bearer ${cookies.get('auth_token')}`
          }
        });
        comments.value = comments.value.filter(comment => comment.id !== commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    };

    const addFavorite = async (kebabPlaceId) => {
      try {
        await put(`/kebab-places/${kebabPlaceId}/fav`, {}, {
          headers: {
            'Authorization': `Bearer ${cookies.get('auth_token')}`
          }
        });
        isFavorite.value = true;
        toast.success('Added to favorites');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          isFavorite.value = true;
          toast.success('Already in favorites');
        } else {
          console.error('Error adding favorite:', error);
          toast.error('Failed to add favorite');
        }
      }
    };

    const removeFavorite = async (kebabPlaceId) => {
      try {
        await del(`/kebab-places/${kebabPlaceId}/unfav`, {
          headers: {
            'Authorization': `Bearer ${cookies.get('auth_token')}`
          }
        });
        isFavorite.value = false;
        toast.success('Removed from favorites');
      } catch (error) {
        console.error('Error removing favorite:', error);
        toast.error('Failed to remove favorite');
      }
    };

    const toggleFavorite = () => {
      if (isFavorite.value) {
        removeFavorite(props.kebabPlace.id);
      } else {
        addFavorite(props.kebabPlace.id);
      }
    };

    watch(() => props.kebabPlace, () => {
      if (props.kebabPlace) {
        fetchFillings();
        fetchSauces();
        fetchComments();
        isFavorite.value = props.kebabPlace.isFavorite;
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
      comments,
      newComment,
      editingComment,
      addComment,
      editComment,
      updateComment,
      deleteComment,
      getStatusText,
      getStatusColor,
      getLocationTypeText,
      translatedOrderOptions,
      translateDay,
      openSuggestionModal,
      isSuggestionModalOpen,
      toggleFavorite,
      isFavorite,
      getSocialIconClass(name) {
        switch (name.toLowerCase()) {
          case 'fb':
            return 'fab fa-facebook';
          case 'ig':
            return 'fab fa-instagram';
          case 'tt':
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
