<template>

</template>
<script>
import { defineComponent } from 'vue';
import { useStore, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router"
import { useQuasar } from "quasar";

export default defineComponent({
  components: { },
  name: 'PageIndex',
  setup(props) {
    const $store = useStore();
    const $router = useRouter();
    const $route = useRoute();
    const $q = useQuasar();
    async function confirm() {
      var result = await $store.dispatch("api/request", {
          url: "auth/regconfirm",
          method: "POST",
          body: {
            token: $route.params.token,
          },
        });
        console.log(result);
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Регистрация подтверждена"
          })
          $router.push("/auth")
        } else {
          var error = result.data;
          $q.notify({
            "type": "negative",
            "message": "Ошибка при подтверждении регистрации: SC" + error.code + ": " + error.error
          })
          $router.push("/auth")
        }
    }
    confirm();
  }
});
</script>
