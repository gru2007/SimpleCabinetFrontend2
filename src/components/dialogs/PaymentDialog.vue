<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Пополнение баланса</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-select v-model="option" :options="options" label="Метод оплаты *"></q-select>
        <q-input v-model="amount" label="Сумма пополнения *" :rules="[ val => val && val >= 0 || 'Введите сумму']"></q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="payment">Пополнить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
  },
  emits: [],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    const methods = {
      "YooMoney": "Yoo",
      "Qiwi": "Qiwi",
      "Freekassa": "Freekassa",
      "Test": "Test",
      "Stripe": "Stripe"
    }
    const options = Object.keys(methods);
    const option = ref("");
    const amount = ref(100);
    let show = ref(false);
    async function payment() {
      var result = await $store.dispatch("api/request", {
          url: "/cabinet/payment/create",
          method: "POST",
          body: {
            system: methods[option.value],
            sum: amount.value,
          },
        });
        if(result.ok) {
          console.log(result);
          location.href = result.data.redirect.url;
          //props.user.groups.push(result.data); // TODO
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при начислении монет: SC" + error.code + ": " + error.error
          })
        }
    }
    return {
      show,
      options,
      option,
      amount,
      payment
    };
  },
});
</script>
