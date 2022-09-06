<script setup lang="ts">
const props = defineProps<{
  onClick: Function
}>()
</script>
<template>
  <button
    class="
      fixed
      bottom-10
      right-10
      w-20
      h-20
      bg-amber-100
      shadow-xl
      text-center
      rounded-full
      hover:opacity-70
    "
    @click="props.onClick()"
  >
  <div class="
    text-6xl
    text-slate-700
    h-full
    w-full
    pt-1
  ">+</div>
  </button>
</template>