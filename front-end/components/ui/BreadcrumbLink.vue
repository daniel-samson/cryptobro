<template>
  <NuxtLink
    :to="to"
    class="transition-colors hover:text-foreground"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>
