<template>
  <q-page>
  <div style="margin: 10px;" v-if="isAdmin">
      <q-btn @click="modalCreate.show = true">Создать</q-btn>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">

    <shop-group-card :item="item" :key="item.id" v-for="item in items">

    </shop-group-card>
  </div>
  <q-pagination v-model="currentPage" :max="maxPages"></q-pagination>
  <create-shop-group-dialog ref="modalCreate">

  </create-shop-group-dialog>
  </q-page>
</template>
<script>
import ShopGroupCard from "src/components/ShopGroupCard.vue";
import CreateShopGroupDialog from "src/components/dialogs/CreateShopGroupDialog.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  components: { ShopGroupCard, CreateShopGroupDialog },
  setup() {
    const $store = useStore();
    var modalCreate = ref(false);
    var items = ref([]);
    var maxPages = ref(1);
    var currentPage = ref(1);
    async function fetchItems(page) {
      return await $store.dispatch("api/request", {
        url: "shop/group/page/" + page,
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
      maxPages,
      modalCreate,
      isAdmin: computed(() => $store.getters["api/isAdmin"])
    }
  },
})
</script>
