<script setup lang="ts">
import { v4 } from "uuid";
import { RecipeEntity } from "~~/types/RecipeEntity";

const form = reactive<RecipeEntity>({
  name: "",
  items: [{
    name: "",
    amount: null as null | number,
    unit: "",
  }],
  howToCook: "",
});
const dbName = "recipe-memo";
const tableName = "recipe";

// IndexedDBはブラウザ上の実装であり、サーバ（Node.js）には存在しないので、
// onMountedなしでは ReferenceError: indexedDB is not defined になる
onMounted(() => {
  // IndexedDB開始リクエスト
  const openRequest = indexedDB.open(dbName);

  openRequest.onupgradeneeded = (event) => {
    // テーブル (Object Store) を作成する。
    // その際、IndexedDBはKey-Valueストアなので、
    // レコードの識別子となるキーの名前を指定する（今回は "id" としている）
    const db = (event.target as IDBRequest).result;
    db.createObjectStore(tableName, {keyPath: "id"});
  };
});
const goBack = () => {
  navigateTo("/products/recipe_memo");
};
</script>
<template>
  <PageContainer>
    <div>
      <AppH2>レシピをメモできるアプリ</AppH2>
      <div class="text-right w-full">
        <ButtonSecondary v-bind:onClick="goBack">アプリTOPに戻る</ButtonSecondary>
      </div>
    </div>
    <AppH3>レシピを書く</AppH3>
    <RecipeForm
      v-bind:id="v4()"
      redirectOnSuccess="/products/recipe_memo"
      v-model="form"></RecipeForm>
  </PageContainer>
</template>