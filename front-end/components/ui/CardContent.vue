<template>
  <div :class="cn('p-6 pt-0', props.class)" v-bind="$attrs">
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
