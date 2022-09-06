<script setup lang="ts">
const props = defineProps<{
  onClick: Function
}>()
</script>
<template>
  <button
    class="
      text-sm
      text-rose-900
      bg-red-200
      hover:opacity-70
      p-1
      rounded-md
      shadow-md
    "
    @click="props.onClick()"
  >
    <slot />
  </button>
</template>