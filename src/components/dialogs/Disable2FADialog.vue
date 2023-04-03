<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Отключение 2FA</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="code" type="password" label="Введите код из приложения *" lazy-rules
          :rules="[val => val && val.length == 6 && ( val >= 0 && val <= 999999 ) || 'Проверьте правильность написания кода']">
        </q-input>
      </q-card-section>
      <q-separator dark></q-separator>

      <q-card-actions>
        <q-btn flat color="primary" @click="disable2FA">Отключить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore, mapState } from "vuex";


export default defineComponent({
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const code = ref(null);
    let show = ref(false);
    return {
      async disable2FA() {
        var result = await $store.dispatch("api/request", {
          url: "cabinet/security/disable2fa",
          method: "POST",
          body: {
            code: code.value,
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "2FA успешно отключен"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при отключении 2FA: SC" + error.code + ": " + error.error
          })
        }
      },
      code,
      show,
    };
  },
});
</script>
