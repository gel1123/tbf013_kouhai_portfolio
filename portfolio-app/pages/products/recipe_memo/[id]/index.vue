<script setup lang="ts">
import { RecipeEntity } from '~~/types/RecipeEntity';

const route = useRoute();
const id = route.params.id;
const dbName = "recipe-memo";
const tableName = "recipe";
const record = ref<RecipeEntity | null>(null);
onMounted(() => {
  // IndexedDB開始リクエスト
  const openRequest = indexedDB.open(dbName);

  openRequest.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName) as IDBObjectStore;
    const getRequest = table.get(id);
    getRequest.onsuccess = (event) => {
      record.value = (event.target as IDBRequest).result;
      if (!record.value) {
        alert("レシピが見つかりません。アプリのトップページに戻ります");
        navigateTo("/products/recipe_memo");
      }
    };
  };
});
const deleteItem = () => {
  if (!confirm(
    `${record.value?.name}のレシピを本当に削除してもよろしいですか？`
  )) return;
  const openRequest = indexedDB.open(dbName);
  openRequest.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(tableName, "readwrite");
    const table = transaction.objectStore(tableName) as IDBObjectStore;
    const deleteRequest = table.delete(id);
    deleteRequest.onsuccess = () => {
      alert("削除に成功しました");
      navigateTo("/products/recipe_memo");
    };
  };
};
const goWrite = () => {
  navigateTo(`/products/recipe_memo/${id}/write`);
};
const goBack = () => {
  navigateTo("/products/recipe_memo");
};
</script>
<template>
  <PageContainer>
    <div>
      <AppH2>{{record ?
        `${record.name}のレシピ`
        : '読み込み中...'}}</AppH2>
      <div class="text-right w-full">
        <ButtonSecondary v-bind:onClick="goBack">アプリTOPに戻る</ButtonSecondary>
      </div>
    </div>
    <AppH3>材料</AppH3>
    <div>
      <div v-for="(item, index) in record?.items">
        {{item.name}} {{item.amount}} {{item.unit}}
      </div>
    </div>
    <AppH3>作り方</AppH3>
    <div class="whitespace-pre-wrap">
      {{record?.howToCook}}
    </div>
    <div v-if="record" class="grid sm:grid-cols-2 gap-3">
      <ButtonPrimary v-bind:onClick="goWrite">このレシピを編集する</ButtonPrimary>
      <ButtonDanger v-bind:onClick="deleteItem">このレシピを削除する</ButtonDanger>
    </div>
  </PageContainer>
</template>