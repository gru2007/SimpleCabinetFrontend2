<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Изменение пароля</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="oldPassword" type="password" label="Старый пароль *" lazy-rules
          :rules="[val => val && val.length > 0 || 'Введите старый пароль']">
        </q-input>
        <q-input filled v-model="newPassword" type="password" label="Новый пароль *" lazy-rules
          :rules="[val => val && val.length > 0 || 'Введите новый пароль']">
        </q-input>
        <q-input filled v-model="newPasswordRetry" type="password" label="Повторите пароль *" lazy-rules
          :rules="[val => val && val.length > 0 || 'Введите новый пароль еще раз']">
        </q-input>
      </q-card-section>
      <q-separator dark></q-separator>

      <q-card-actions>
        <q-btn flat color="primary" @click="changePassword">Изменить</q-btn>
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
    const oldPassword = ref(null);
    const newPassword = ref(null);
    const newPasswordRetry = ref(null);
    let show = ref(false);
    return {
      async changePassword() {
        if (newPassword.value != newPasswordRetry.value) {
          $q.notify({
            "type": "negative",
            "message": "Пароли не совпадают"
          })
          return;
        }
        var result = await $store.dispatch("api/request", {
          url: "cabinet/security/changepassword",
          method: "POST",
          body: {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Пароль успешно изменен"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при смене пароля: SC" + error.code + ": " + error.error
          })
        }
      },
      oldPassword,
      newPassword,
      newPasswordRetry,
      show
    };
  },
});
</script>
