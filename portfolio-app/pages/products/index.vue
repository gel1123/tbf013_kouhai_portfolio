<script setup lang="ts">
const links = [{
  url: '/products/recipe_memo',
  text: 'レシピを保存できるメモアプリ'
}];
</script>
<template>
  <PageContainer>
    <AppH2>作品集</AppH2>
    <!-- Propsのlinks属性にv-bindで変数を渡す -->
    <AppLink v-bind:links="links" />
  </PageContainer>
</template>
