<template>
    <q-item>
        Пользователь {{ value.targetUsername }} был забанен модератором {{ value.moderatorUsername }} по причине {{ value.reason ? value.reason : "?" }}
    </q-item>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
export default defineComponent({
  props: {
    value: {
      required: true,
    }
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    return {
    }
  }
})
</script>