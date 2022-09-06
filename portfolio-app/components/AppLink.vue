<script setup lang="ts">
// Props(親から渡される情報)を定義
const props = defineProps<{
  links: {
    url: string;
    text: string;
  }[]
}>();
</script>
<template>
  <ul class="
    p-8
    grid
    gap-y-4
    rounded-md
    bg-slate-200
  ">
    <!-- リンク情報リストをループで回す -->
    <li v-for="link in props.links">
      <!-- v-bindで特定の属性に変数の値を渡す -->
      <NuxtLink
        v-bind:href="link.url"
        class="text-blue-700 hover:opacity-70"
      >
        <!-- 波括弧２つで画面に変数の文字列を出す -->
        {{ link.text }}
      </NuxtLink>
    </li>
  </ul>
</template>
