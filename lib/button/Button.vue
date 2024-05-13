<script setup lang="ts">
import type {IButtonProps} from "primevue/button";
defineProps<IButtonProps>()
</script>

<template>
  <button :href :class="'text-fuchsia-800 border border-neutral-500 hover:border-fuchsia-900 rounded px-2 py-1 transition-all ' + className">
    <slot/>
  </button>
</template>

<style scoped>

</style>
