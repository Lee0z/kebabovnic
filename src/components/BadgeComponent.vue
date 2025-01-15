<template>
  <div :class="badgeClass" :style="badgeStyle">
    {{ text }}
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

const badgeClass = computed(() => 'inline-block px-4 py-2 border rounded-full');
const badgeStyle = computed(() => ({
  borderColor: props.color,
  color: props.color
}));
</script>
