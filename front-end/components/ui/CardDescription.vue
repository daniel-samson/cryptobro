<template>
  <p :class="cn('text-sm text-muted-foreground', props.class)" v-bind="$attrs">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from '@/app/utils/cn'

interface Props {
  class?: string
}

defineProps<Props>()
</script>
