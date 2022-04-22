<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Вход в личный кабинет</div>
      <q-input
        filled
        v-model="username"
        label="Ваш логин или email *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
        ]"
      ></q-input>
      <q-input
        filled
        v-model="password"
        label="Ваш пароль *"
        type="password"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Это поле не может быть пустым',
        ]"
      ></q-input>
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="authorize">Войти</q-btn>
      <q-btn flat @click="redirectRegister" >Регистрация</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"

export default defineComponent({
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const username = ref("");
    const password = ref("");
    return {
      async authorize() {
        var result = await $store.dispatch("api/request", {
          url: "auth/authorize",
          method: "POST",
          body: {
            username: username.value,
            password: password.value,
          },
        });
        console.log(result);
        if(result.ok) {
          localStorage.setItem("session", JSON.stringify(result.data))
          $store.dispatch("api/setup", {})
          $router.push("/cabinet")
        }
      },
      redirectRegister() {
          $router.push("/register")
      },
      username,
      password
    };
  }
});
</script>
