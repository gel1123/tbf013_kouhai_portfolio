<script setup lang="ts">
const props = defineProps<{
  onClick: Function;
}>()
</script>
<template>
  <button
    class="
      text-sm
      bg-blue-200
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