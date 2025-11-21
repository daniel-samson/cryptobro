<template>
  <h2 :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)" v-bind="$attrs">
    <slot />
  </h2>
</template>

<script setup lang="ts">
import { cn } from '~/app/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>
