<script setup lang="ts">
const props = defineProps<{modelValue: string}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
})
</script>
<template>
  <textarea
    v-model="modelValue"
    class="
      border-2
      border-gray-300
      rounded-lg
      p-2
      w-full
      h-64
      focus:outline-none
      focus:border-gray-500
      focus:shadow-outline-gray
    "
  ></textarea>
</template>