<template>
  <q-page class="flex flex-center">
    <profile v-if="user" :user="user" :owner="false">

    </profile>
    <error404 v-if="err404" message="Пользователь не найден"></error404>
  </q-page>
</template>
<script>
import Profile from "src/components/Profile.vue";
import { computed, ref, defineComponent } from "vue";
import { useStore, mapState } from "vuex";
import { useRoute } from "vue-router"
import Error404 from "src/components/utils/Error404.vue";

export default defineComponent({
  components: { Profile, Error404 },
  name: "PageCabinet",
  setup() {
    var user = ref(null);
    var err404 = ref(false);
    const $store = useStore();
    const $route = useRoute();
    async function fetchUser(uuid) {
      return await $store.dispatch("api/request", {
        url: "users/uuid/" + uuid + "?assets=true",
        method: "GET",
      });
    }
    fetchUser($route.params.uuid).then((r) => {
      if (r.code == 404) {
        err404.value = true;
      }
      if (r.ok) {
        user.value = r.data;
      }
    })
    return {
      user,
      err404,
      fetchUser
    };
  },
});
</script>
