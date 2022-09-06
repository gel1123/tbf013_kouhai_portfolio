<script setup lang="ts">
const links = [{
  url: '/about',
  text: 'このサイトについて'
}, {
  url: '/profile',
  text: 'プロフィール'
}, {
  url: '/products',
  text: '作品集'
}];
</script>
<template>
  <PageContainer>
    <AppH2>トップページ</AppH2>
    <AppLink v-bind:links="links" />
  </PageContainer>
</template>