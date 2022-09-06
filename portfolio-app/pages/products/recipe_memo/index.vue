<script setup lang="ts">
const links = ref<{
  url: string;
  text: string;
}[]>([]);

const dbName = "recipe-memo";
const tableName = "recipe";

onMounted(() => {
  // IndexedDB開始リクエスト
  const openRequest = indexedDB.open(dbName);

  openRequest.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName) as IDBObjectStore;
    const cursorRequest = table.openCursor();
    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (!cursor) return;
      const record = cursor.value;
      links.value.push({
        url: `/products/recipe_memo/${record.id}`,
        text: record.name,
      });
      cursor.continue();
    };
  };

  // アプリ内でこのページを最初に開くユースケースが
  // 中心であるはずなので、ここでもテーブル作成処理を挟んでおく
  openRequest.onupgradeneeded = (event) => {
    const db = (event.target as IDBRequest).result;
    db.createObjectStore(tableName, {keyPath: "id"});
  };
});
const goBack = () => {
  navigateTo("/");
}
const goWrite = () => {
  navigateTo("/products/recipe_memo/write");
}
</script>
<template>
  <PageContainer>
    <div>
      <AppH2>レシピをメモできるアプリ</AppH2>
      <div class="text-right w-full">
        <ButtonSecondary v-bind:onClick="goBack">サイトTOPに戻る</ButtonSecondary>
      </div>
    </div>
    <AppH3>レシピ一覧</AppH3>
    <AppLink v-bind:links="links" />
    <ButtonIconPlus v-bind:onClick="goWrite" />
  </PageContainer>
</template>