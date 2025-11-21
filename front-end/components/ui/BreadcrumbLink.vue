<template>
  <NuxtLink
    :to="to"
    class="transition-colors hover:text-white"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>
