<template>
  <div :class="cn('flex flex-col space-y-1.5 p-6', $props.class)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/app/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>
