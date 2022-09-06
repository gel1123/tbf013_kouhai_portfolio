<script setup lang="ts">
import { RecipeEntity } from "~~/types/RecipeEntity";

const route = useRoute();
const id = route.params.id as string;
const dbName = "recipe-memo";
const tableName = "recipe";
const form = reactive<RecipeEntity>({
  name: "",
  items: [{
    name: "",
    amount: null as null | number,
    unit: "",
  }],
  howToCook: "",
});

onMounted(() => {
  // IndexedDB開始リクエスト
  const openRequest = indexedDB.open(dbName);

  openRequest.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName) as IDBObjectStore;
    const getRequest = table.get(id);
    getRequest.onsuccess = (event) => {
      const r = (event.target as IDBRequest).result;
      form.name = r.name;
      form.items = r.items;
      form.howToCook = r.howToCook;
    };
  };
});
const goBack = () => {
  navigateTo(`/products/recipe_memo/${id}`);
};
</script>
<template>
  <PageContainer>
    <div>
      <AppH2>{{(form && form.name) ?
        `${form.name}のレシピを編集する`
        : 'レシピを編集する'}}</AppH2>
      <div class="text-right w-full">
        <ButtonSecondary v-bind:onClick="goBack">前画面に戻る</ButtonSecondary>
      </div>
    </div>
    <AppH3>レシピを編集する</AppH3>
    <RecipeForm
      v-bind:id="id"
      redirectOnSuccess="/products/recipe_memo"
      v-model="form"></RecipeForm>
  </PageContainer>
</template>