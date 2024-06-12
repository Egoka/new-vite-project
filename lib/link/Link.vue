<script setup lang="ts">
import Button from 'primevue/button';
import type {ILinkProps} from "primevue/link";
import {ref} from "vue";
defineProps<ILinkProps>()
const color = ref("#ababb4")
</script>

<template>
  <Button><slot/></Button>
  <a :href :class="'text-fuchsia-800 border border-neutral-500 hover:border-fuchsia-900 rounded px-2 py-1 transition-all link ' + className">
    <slot/>
  </a>
</template>
<style scoped lang="css">
.link {
  color: v-bind(color);
}
</style>
