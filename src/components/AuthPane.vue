<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Вход в личный кабинет</div>
      <q-input filled v-model="username" label="Ваш логин или email *" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
      <q-input filled v-model="password" label="Ваш пароль *" type="password" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
      <q-input v-if="require2FA" filled v-model="totp" label="Введите код 2FA *" type="password" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="authorize">Войти</q-btn>
      <q-btn flat @click="redirectRegister">Регистрация</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const username = ref("");
    const password = ref("");
    const totp = ref(null);
    var require2FA = ref(false);
    return {
      async authorize() {
        var result = await $store.dispatch("api/request", {
          url: "auth/authorize",
          method: "POST",
          body: {
            username: username.value,
            password: password.value,
            totpPassword: totp.value
          },
        });
        console.log(result);
        if (result.ok) {
          localStorage.setItem("session", JSON.stringify(result.data))
          $store.dispatch("api/setup", {})
          $router.push("/cabinet")
        } else if(result.data.error == "auth.require2fa") {
          require2FA.value = true;
        } else {
          var error = result.data;
          $q.notify({
            "type": "negative",
            "message": "Ошибка при авторизации: SC" + error.code + ": " + error.error
          })
        }
      },
      redirectRegister() {
        $router.push("/register")
      },
      username,
      password,
      require2FA,
      totp
    };
  }
});
</script>
