<template>
      <q-dialog v-model="show">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Изменение плаща</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section v-if="cape">
          <p>
            Текущий URL: {{ cape.url }} <br />
          </p>
        </q-card-section>
        <q-card-section>
          <q-file v-model="file" label="Выберите файл для загрузки" accept=".png, image/png">

          </q-file>
        </q-card-section>
        <q-separator dark></q-separator>

        <q-card-actions>
          <q-btn flat color="primary" @click="upload">Загрузить</q-btn>
          <q-btn flat color="red" @click="remove">Удалить</q-btn>
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
    cape: {
      required: true,
    },
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const file = ref(null);
    let show = ref(false);
    return {
      async upload() {
        const fd = new FormData();
        fd.append("options", new Blob([JSON.stringify({})], {
          type: "application/json"
        }))
        fd.append("file", file.value)
        var response = await fetch($store.state.api.url + "cabinet/upload/cape", {
          "method": "POST",
          "body": fd
        })
        if(response.ok) {
          $q.notify({
            "type": "positive",
            "message": "Плащ успешно загружен"
          })
          show = false
        } else {
          var error = await response.json()
          $q.notify({
            "type": "negative",
            "message": "Ошибка при загрузке плаща: SC" + error.code + ": " + error.error
          })
        }
      },
      async remove() {
        var response = await fetch($store.state.api.url + "cabinet/upload/cape", {
          "method": "DELETE"
        })
        if(response.ok) {
          show = false
        }
      },
      file,
      show
    };
  },
});
</script>
