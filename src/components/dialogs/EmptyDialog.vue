<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Диалог</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="() => { }">Загрузить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
    skin: {
      required: true,
    },
  },
  emits: [],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    let show = ref(false);
    return {
      show
    };
  },
});
</script>
