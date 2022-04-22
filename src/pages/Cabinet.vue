<template>
  <q-page class="flex flex-center">
    <profile :user="user" owner=true>

    </profile>
  </q-page>
</template>
<script>
import Profile from "src/components/Profile.vue";
import { computed, defineComponent } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  components: { Profile },
  name: "PageCabinet",
  setup() {
    const $store = useStore();
    return {
      user: computed(() => $store.state.api.user),
    };
  },
});
</script>
