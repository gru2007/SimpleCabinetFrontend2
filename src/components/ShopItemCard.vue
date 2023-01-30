<template>
  <q-card>
    <q-card-section>
      {{ item.displayName }}
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>{{ item.description }}</q-card-section>
    <q-card-actions>
      <q-input v-model.number="num"
      type="number"></q-input>
      <span style="margin: 1em"> {{ sum }} {{ item.currency }} </span>
      <q-btn flat color="blue" @click="buy">Купить</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
export default defineComponent({
  props: {
    item: {
      required: true,
    }
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    var num = ref(1);
    var sum = computed(() => {
      return props.item.price * num.value;
    })
    return {
      async buy() {
        var result = await $store.dispatch("api/request", {
          url: "shop/item/buy",
          method: "POST",
          body: {
            "id": props.item.id,
            "quantity": num.value
          },
        });
        if(result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Покупка успешно совершена"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при покупке: SC" + error.code + ": " + error.error
          })
        }
      },
      num, sum
    }
  }
})
</script>
