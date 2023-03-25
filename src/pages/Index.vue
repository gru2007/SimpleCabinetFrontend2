<template>
  <q-page class="flex flex-center">
  </q-page>
</template>

<script>
import { watch, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore, mapState } from "vuex";

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const $store = useStore()
    const $router = useRouter()
    if ($store.state.api.isAuth === false) {
      $router.push("/auth")
    } else if ($store.state.api.isAuth === true) {
      $router.push("/cabinet")
    }
    const authWatch = watch(() => $store.state.api.isAuth, (value, oldValue) => {
      if (value === false) {
        $router.push("/auth")
      } else if (value === true) {
        $router.push("/cabinet")
      }
    })
    return {
      authWatch
    }
  }
})
</script>
