<script setup lang="ts">
import {ILinkProps} from "./types";
const props = defineProps<ILinkProps>()
</script>

<template><a :href><slot/></a></template>
