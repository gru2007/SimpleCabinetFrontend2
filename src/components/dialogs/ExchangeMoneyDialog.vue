<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Обмен валют</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input v-model="fromValue"></q-input>
        <q-select v-model="fromCurrency" :options="myCurrencies" />
        <p>Поменять на</p>
        <q-input v-model="toValue"></q-input>
        <q-select v-model="toCurrency" :options="targetCurrencies" />
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="transfer(fromValue, fromCurrency, toCurrency)">Обменять</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, watch, ref } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
    balances: {
      required: true,
    },
    user: {
      required: true,
    },
  },
  emits: [],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    var myCurrencies = ref([]);
    var targetCurrencies = ref([]);
    var fromCurrency = ref("");
    var toCurrency = ref("");
    var fromValue = ref(1);
    var toValue = ref(1);
    var exchangeRates = ref([]);
    let show = ref(false);
    async function fetchExchangeRates(currencyName) {
      if(!currencyName) {
        return [];
      }
      var result = await $store.dispatch("api/request", {
          url: "exchangerate/get/"+currencyName,
          method: "GET"
      });
      if (result.ok) {
          exchangeRates.value = result.data;
          return result.data.map((e) => e.toCurrency);
        } else {
          var error = result.data;
          $q.notify({
            "type": "negative",
            "message": "Ошибка при получении курсов валют: SC" + error.code + ": " + error.error
          })
          return [];
        }
    }
    async function updateTargetCurrencies() {
      targetCurrencies.value = [];
      console.log(fromCurrency.value);
      targetCurrencies.value = await fetchExchangeRates(fromCurrency.value);
      if(targetCurrencies.value.length > 0) {
        toCurrency.value = targetCurrencies.value[0];
      }
      exchangeRates.value.forEach((v) => {
        if(v.fromCurrency == fromCurrency.value) {
          toValue.value = fromValue.value*v.value;
        }
      })
    }
    props.balances.forEach((v) => {
      console.log(v);
      myCurrencies.value.push(v.currency);
      if(myCurrencies.value.length > 0) {
        fromCurrency.value = myCurrencies.value[0];
      }
    })
    watch(() => props.balances, (balances) => {
      myCurrencies.value = [];
      props.balances.forEach((v) => {
        //console.log(v.value);
        myCurrencies.value.push(v.currency);
      })
      if(myCurrencies.value.length > 0) {
        fromCurrency.value = myCurrencies.value[0];
      }
    })
    updateTargetCurrencies();
    watch(() => fromCurrency.value, (value, oldValue) => {
      if(value == oldValue) {
        return;
      }
      updateTargetCurrencies();
    });
    watch(() => fromValue.value, (value, oldValue) => {
      if(value == oldValue) {
        return;
      }
      exchangeRates.value.forEach((v) => {
        if(v.fromCurrency == fromCurrency.value) {
          toValue.value = fromValue.value*v.value;
        }
      })
    });
    watch(() => toValue.value, (value, oldValue) => {
      if(value == oldValue) {
        return;
      }
      exchangeRates.value.forEach((v) => {
        if(v.fromCurrency == fromCurrency.value) {
          fromValue.value = toValue.value*(1.0/v.value);
        }
      })
    });
    async function transfer(value, from, to) {
      var result = await $store.dispatch("api/request", {
          url: "cabinet/money/transfer/"+from+"/to/"+props.user.id+"/"+to,
          method: "POST",
          body: {
            count: value,
            comment: "SelfExchangeRate",
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Перевод успешно завершен"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при переводе: SC" + error.code + ": " + error.error
          })
        }
    }
    return {
      show,
      myCurrencies, targetCurrencies, fromCurrency, toCurrency, fromValue, toValue, transfer
    };
  },
});
</script>
