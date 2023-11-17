<template>
  <q-page>
  <div class="q-pa-md row items-start q-gutter-md">

    <shop-item-card :item="item" :key="item.id" v-for="item in items">

    </shop-item-card>
  </div>
  <q-pagination v-model="currentPage" :max="maxPages"></q-pagination>
  </q-page>
</template>
<script>
import ShopItemCard from "src/components/ShopItemCard.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  components: { ShopItemCard },
  setup() {
    const $store = useStore();
    var items = ref([]);
    var maxPages = ref(1);
    var currentPage = ref(1);
    async function fetchItems(page) {
      return await $store.dispatch("api/request", {
        url: "shop/item/page/" + page,
        method: "GET",
      });
    };
    fetchItems(0).then((v) => {
      if (v.ok) {
        items.value = v.data.data;
        console.log(v.data);
        maxPages.value = v.data.totalPages;
        currentPage.value = 1;
      }
    });
    var watcher = watch(
      () => currentPage.value,
      (value, oldValue) => {
        if (value != oldValue) {
          fetchItems(value - 1).then((v) => {
            if (v.ok) {
              users.value = v.data.data;
              console.log(v.data);
              maxPages.value = v.data.totalPages;
              currentPage.value = value;
            }
          });
        }
      }
    );
    return {
      fetchItems,
      items,
      currentPage,
      maxPages
    }
  },
})
</script>
