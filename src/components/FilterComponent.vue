<script setup>
import { defineEmits, ref, watch } from 'vue';

import BadgeComponent from './BadgeComponent.vue';

const props = defineProps({
  filterCraft: Boolean,
  filterChainRestaurant: Boolean,
  filterLocationType: String,
  filterStatus: String,
  filterFillings: Array,
  filterSauces: Array,
  allFillings: Array,
  allSauces: Array,
});

const emits = defineEmits(['updateFilters', 'update:filterCraft', 'update:filterChainRestaurant', 'update:filterLocationType', 'update:filterStatus', 'update:filterFillings', 'update:filterSauces']);

const showFillings = ref(false);
const showSauces = ref(false);

watch([props.filterCraft, props.filterChainRestaurant, props.filterLocationType, props.filterStatus, props.filterFillings, props.filterSauces], () => {
  emits('updateFilters');
});
</script>

<template>
  <div class="w-full flex flex-wrap gap-2 justify-end mb-2">
    <label class="mr-2">Filters:</label>
    <BadgeComponent text="Craft" color="purple" @click="$emit('update:filterCraft', !props.filterCraft)" :class="{ 'bg-purple-500': props.filterCraft }" />
    <BadgeComponent text="Chain Restaurant" color="gray" @click="$emit('update:filterChainRestaurant', !props.filterChainRestaurant)" :class="{ 'bg-gray-500': props.filterChainRestaurant }" />
    <BadgeComponent text="Restaurant" color="orange" @click="$emit('update:filterLocationType', props.filterLocationType === 'lokal' ? '' : 'lokal')" :class="{ 'bg-orange-500': props.filterLocationType === 'lokal' }" />
    <BadgeComponent text="Food Truck" color="orange" @click="$emit('update:filterLocationType', props.filterLocationType === 'buda' ? '' : 'buda')" :class="{ 'bg-orange-500': props.filterLocationType === 'buda' }" />
    <BadgeComponent text="Open" color="green" @click="$emit('update:filterStatus', props.filterStatus === 'otwarte' ? '' : 'otwarte')" :class="{ 'bg-green-500': props.filterStatus === 'otwarte' }" />
    <BadgeComponent text="Closed" color="red" @click="$emit('update:filterStatus', props.filterStatus === 'zamknięte' ? '' : 'zamknięte')" :class="{ 'bg-red-500': props.filterStatus === 'zamknięte' }" />
    <button @click="showFillings = !showFillings" class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
      Fillings
    </button>
    <div v-if="showFillings" class="w-full flex flex-wrap gap-2 justify-end mb-2">
      <div v-for="filling in props.allFillings" :key="filling.id" class="flex items-center gap-2">
        <BadgeComponent :text="filling.name" :color="filling.hexColor" @click="$emit('update:filterFillings', props.filterFillings.includes(filling.id) ? props.filterFillings.filter(id => id !== filling.id) : [...props.filterFillings, filling.id])" :class="{ 'bg-blue-500': props.filterFillings.includes(filling.id) }" />
      </div>
    </div>
    <button @click="showSauces = !showSauces" class="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
      Sauces
    </button>
    <div v-if="showSauces" class="w-full flex flex-wrap gap-2 justify-end mb-2">
      <div v-for="sauce in props.allSauces" :key="sauce.id" class="flex items-center gap-2">
        <BadgeComponent :text="sauce.name" :color="sauce.hexColor" @click="$emit('update:filterSauces', props.filterSauces.includes(sauce.id) ? props.filterSauces.filter(id => id !== sauce.id) : [...props.filterSauces, sauce.id])" :class="{ 'bg-yellow-500': props.filterSauces.includes(sauce.id) }" />
      </div>
    </div>
  </div>
</template>

