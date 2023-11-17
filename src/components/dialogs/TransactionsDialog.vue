<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Транзакции {{ balance.currency }} <q-badge>ALPHA</q-badge></div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="t in items">
              <q-card class="full-width">
                <q-card-section>
                Транзакция {{ t.id }} <q-badge v-if="t.multicurrency" color="green">Мультивалютная</q-badge>
                </q-card-section>
                <q-card-section>
                  <span v-if="t.fromId == balance.id && t.toId != balance.id">Вы перевели {{ -t.fromCount }} {{ t.fromCurrency }}<br v-if="t.toCount != 0"/><span v-if="t.toCount != 0">Получатель получил {{ t.toCount }} {{ t.toCurrency }}</span></span>
                  <span v-if="t.toId == balance.id && t.fromId != balance.id">Вы получили {{ t.toCount }} {{ t.toCurrency }}<br v-if="t.fromCount != 0"/><span v-if="t.fromCount != 0">Отправитель потратил {{ t.fromCount }} {{ t.fromCurrency }}</span></span>
                  <span v-if="t.fromId == t.toId == balance.id">Вы обменяли {{ -t.fromCount }} {{ t.fromCurrency }} на {{ t.toCount }} {{ t.toCurrency }}</span>
                </q-card-section>
                <q-card-section v-if="t.comment">
                  <span>{{ t.comment }}</span>
                </q-card-section>
                <q-card-section>
                  <span>{{ t.createdAt }}</span>
                </q-card-section>
              </q-card>
          </q-item>
        </q-list>
        <q-pagination v-model="currentPage" :max="maxPages"></q-pagination>
      </q-card-section>
      <q-card-actions>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
    balance: {
      required: true
    }
  },
  emits: [],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    let show = ref(false);
    var items = ref([]);
    var maxPages = ref(1);
    var currentPage = ref(1);
    async function fetchItems(page) {
      return await $store.dispatch("api/request", {
        url: "/cabinet/money/balance/id/" + props.balance.id + "/transactions/page/" + page,
        method: "GET",
      });
    };
    if(props.balance) {
      fetchItems(0).then((v) => {
        if (v.ok) {
          items.value = v.data.data;
          console.log(v.data);
          maxPages.value = v.data.totalPages;
          currentPage.value = 1;
        }
      });
    }
    watch(() => props.balance, (value, oldValue) => {
      if(oldValue != value) {
        fetchItems(0).then((v) => {
          if (v.ok) {
            items.value = v.data.data;
            console.log(v.data);
            maxPages.value = v.data.totalPages;
            currentPage.value = 1;
          }
        });
      }
    })
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
      show,
      fetchItems,
      items,
      currentPage,
      maxPages
    };
  },
});
</script>
