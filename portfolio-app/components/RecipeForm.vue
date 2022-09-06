<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    name: string;
    items: {
      name: string;
      amount: number | null;
      unit: string;
    }[];
    howToCook: string;
  },
  id: string;
  redirectOnSuccess: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};
const addItem = () => {
  form.value.items.push({
    name: "",
    amount: null,
    unit: "",
  });
};
const dbName = "recipe-memo";
const tableName = "recipe";
const submit = () => {
  const {name, items, howToCook} = form.value;
  // いずれかのフォームが空白ならエラー
  if (!name
    || !howToCook
    || items.some(
      item => !item.name
        || !Number.isFinite(item.amount)
        || !item.unit)) {
    alert('いずれかのフォームが空白です');
    return;
  };
  const openRequest = indexedDB.open(dbName);
  openRequest.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(tableName, "readwrite");
    const table = transaction.objectStore(tableName) as IDBObjectStore;
    const id = props.id;
    const putRequest = table.put({
      id, name, items: items.map(i => ({
        // 下記のエラー対策（シリアライズ可能な値にすべき）
        // Uncaught DOMException: Failed to execute 'put' on 'IDBObjectStore': [object Array] could not be cloned.
        // https://github.com/localForage/localForage/issues/610
        name: i.name, amount: i.amount, unit: i.unit,
      })), howToCook
    });
    putRequest.onsuccess = () => {
      alert("保存に成功しました");
      navigateTo(props.redirectOnSuccess);
    };
    putRequest.onerror = () => {
      alert("保存に失敗しました");
    };
  }
};
</script>
<template>
  <div class="grid gap-8">
    <label>
      レシピの名前
      <InputText v-model="form.name"/>
    </label>
    <div
      v-for="(item, index) in form.items"
      class="bg-cyan-100 p-4 rounded-md shadow-md"
    >
      <div class="w-full text-right">
        <ButtonSecondary v-bind:onClick="
          () => removeItem(index)
        ">材料 {{index+1}} を削除する</ButtonSecondary>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <label>
          材料 {{index+1}} の名前
          <InputText v-model="item.name"/>
        </label>
        <label>
          材料 {{index+1}} の個数
          <InputNum v-model="item.amount"/>
        </label>
        <label>
          材料 {{index+1}} の単位
          <InputText v-model="item.unit"/>
        </label>
      </div>
    </div>
    <div>
      <ButtonPrimary v-bind:onClick="addItem">
        材料を追加する
      </ButtonPrimary>
    </div>
    <label>
      作り方
      <InputTextarea
        v-model="form.howToCook"
      ></InputTextarea>
    </label>
    <div class="w-full text-right">
      <ButtonPrimary v-bind:onClick="submit">
        レシピを保存する
      </ButtonPrimary>
    </div>
  </div>
</template>