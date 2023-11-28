<template>
  <q-dialog full-height full-width v-model="show">
    <q-card style="width: auto">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Выдача бана</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="reason" label="Причина *"
          :rules="[(val) => (val && val.length > 0) || 'Введите причину бана']" type="text"></q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h7">Время бана</div>
      </q-card-section>
      <q-card-section horizontal>
        <q-date :readonly="isForever" v-model="endDate" mask="YYYY-MM-DD HH:mm" />
        <q-time :readonly="isForever" v-model="endDate" mask="YYYY-MM-DD HH:mm" />
      </q-card-section>
      <q-card-section>
        <q-checkbox filled v-model="isForever" label="Бан навсегда"></q-checkbox>
      </q-card-section>
      <q-card-section>
        <q-checkbox filled v-model="isHardware" label="Бан по железу"></q-checkbox>
      </q-card-section>
      <q-card-actions>
        <q-btn color="red" @click="ban">Забанить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar, date } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
    user: {
      required: true,
    },
  },
  emits: [],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    let show = ref(false);
    let reason = ref("");
    let endDate = ref(new Date().toISOString());
    let isHardware = ref(false);
    let isForever = ref(false);
    return {
      async ban() {
        if (true) {
          console.log(new Date(endDate.value));
        }
        var result = await $store.dispatch("api/request", {
          url: "admin/moderation/ban/" + props.user.id,
          method: "POST",
          body: {
            reason: reason.value,
            endDate: isForever ? null : new Date(endDate.value).toISOString(),
            isHardware: isHardware.value,
          },
        });
        if (result.ok) {
          $q.notify({
            type: "positive",
            message: "Пользователь успешно забанен",
          });
          show = false;
        } else {
          var error = result.data;
          $q.notify({
            type: "negative",
            message:
              "Ошибка при бане пользователя: SC" + error.code + ": " + error.error,
          });
        }
      },
      show,
      reason,
      isHardware,
      isForever,
      endDate,
    };
  },
});
</script>
