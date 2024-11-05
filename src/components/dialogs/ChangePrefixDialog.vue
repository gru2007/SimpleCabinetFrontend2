<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Изменение префикса</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="newPrefix" type="text" label="Новый префикс" lazy-rules
          :rules="[val => val && val.length > 0 || 'Введите новый префикс']">
        </q-input>
      </q-card-section>
      <q-card-section v-if="paided == null">
        Смена префикса недоступна
      </q-card-section>
      <q-card-section v-if="paided == false">
        <q-select map-options option-label="description" v-model="product" :options="products" label="Название услуги"></q-select>
        Стоимость смены префикса будет составлять {{ product.price }} {{ product.currency }}
      </q-card-section>
      <q-card-section v-if="paided == true">
        Вам доступна смена префикса бесплатно
      </q-card-section>
      <q-separator dark></q-separator>
      <q-card-actions>
        <q-btn flat color="primary" @click="changePrefix">Изменить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const newPrefix = ref(null);
    const paided = ref(null);
    const orderId = ref(null);
    const product = ref(null);
    const products = ref([]);
    let show = ref(false);
    async function checkPrefixPrice() {
      var result = await $store.dispatch("api/request", {
          url: "cabinet/prefix",
          method: "GET",
      });
      if(result.ok) {
        newPrefix.value = result.data.prefix;
        if(result.data.freePrefixChangeAvailable) {
          paided.value = true;
          return;
        }
      }
      var result2 = await $store.dispatch("api/request", {
          url: "shop/service/type/CHANGE_PREFIX/0",
          method: "GET",
      });
      if(result2.ok) {
          products.value = result2.data.data;
          product.value = result2.data.data[0];
      } else {
        products.value = [];
        product.value = null;
      }
      var result2 = await $store.dispatch("api/request", {
          url: "shop/service/type/CHANGE_PREFIX/order",
          method: "GET",
      });
      if(result2.ok) {
        orderId.value = result2.data.id;
        paided.value = true;
      } else {
        orderId.value = 0;
        paided.value = false;
      }
    }
    checkPrefixPrice();
    return {
      async changePrefix() {
        if(!paided.value) {
          var result = await $store.dispatch("api/request", {
          url: "shop/service/buy",
          method: "POST",
          body: {
            id: product.value.id,
            quantity: 1
          },
        });
        if(!result.ok) {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при смене префикса: SC" + error.code + ": " + error.error
          })
          checkPrefixPrice();
          return;
        }
        }
        var result = await $store.dispatch("api/request", {
          url: "cabinet/prefix",
          method: "PUT",
          body: {
            prefix: newPrefix.value,
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Префикс успешно изменен"
          })
          checkPrefixPrice();
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при смене префикса: SC" + error.code + ": " + error.error
          })
          checkPrefixPrice();
        }
      },
      product,
      products,
      paided,
      newPrefix,
      show
    };
  },
});
</script>
