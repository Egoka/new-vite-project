<script setup lang="ts">
import type {ILinkProps} from "./types";
const props = defineProps<ILinkProps>()
</script>

<template><a :href :class="'text-fuchsia-800 border border-neutral-500 hover:border-fuchsia-900 rounded px-2 py-1 transition-all ' + className"><slot/></a></template>
