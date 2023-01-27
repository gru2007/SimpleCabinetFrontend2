<template>
      <q-dialog v-model="show">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Добавление счета/начисление монет</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="currency" label="Валюта *" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Введите валюту']">
          </q-input>
          <q-input filled v-model="money" type="integer" label="Сумма *" lazy-rules
          :rules="[ val => val && val >= 0 || 'Введите сумму']">
          </q-input>
          <q-input filled v-model="comment" label="Комментарий *" lazy-rules
          :rules="[ val => val && val.length >= 0 || 'Введите комментарий']">
          </q-input>
        </q-card-section>
        <q-separator dark></q-separator>

        <q-card-actions>
          <q-btn flat color="primary" @click="addGroup">Добавить</q-btn>
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
    user: {
      required: true,
    },
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const currency = ref(null);
    const money = ref(0);
    const comment = ref(null);
    let show = ref(false);
    return {
      async addGroup() {
        var result = await $store.dispatch("api/request", {
          url: "admin/money/addmoney/byid/"+props.user.id+"/"+currency.value,
          method: "POST",
          body: {
            count: money.value,
            comment: comment.value,
          },
        });
        if(result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Монеты успешно начислены"
          })
          //props.user.groups.push(result.data); // TODO
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при начислении монет: SC" + error.code + ": " + error.error
          })
        }
      },
      currency,
      money,
      comment,
      show
    };
  },
});
</script>
