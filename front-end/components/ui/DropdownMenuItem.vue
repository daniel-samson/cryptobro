<script setup lang="ts">
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/app/utils/cn'

const props = defineProps<DropdownMenuItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<DropdownMenuItemProps>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      props.class
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>
