<template>
  <button
    :class="buttonVariants({ variant, size, class: props.class })"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/cn'
import { buttonVariants } from '@/app/utils/buttonVariants'

interface Props extends /* @vue-ignore */ VariantProps<typeof buttonVariants> {
  class?: string
}

const props = defineProps<Props>()
</script>
