<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Регистрация в личном кабинете</div>
      <q-input filled v-model="username" label="Ваш логин *" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
      <q-input filled v-model="email" label="Ваш Email *" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
      <q-input filled v-model="password" label="Ваш пароль *" type="password" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
      ]"></q-input>
      <div class="h-captcha" :data-sitekey="sitekey" data-error-callback="onError"></div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="register">Зарегистрироватся</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const username = ref("");
    const email = ref("");
    const password = ref("");
    return {
      async register() {
        var result = await $store.dispatch("api/request", {
          url: "auth/register",
          method: "POST",
          body: {
            username: username.value,
            email: email.value,
            password: password.value,
          },
        });
        console.log(result);
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Регистрация прошла успешно"
          })
          $router.push("/")
        } else {
          var error = result.data;
          $q.notify({
            "type": "negative",
            "message": "Ошибка при регистрации: SC" + error.code + ": " + error.error
          })
        }
      },
      sitekey: computed(() => $store.state.api.recaptcha.sitekey),
      username,
      password,
      email
    };
  }
});
</script>
