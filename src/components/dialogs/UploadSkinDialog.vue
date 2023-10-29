<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Изменение скина</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section v-if="skin">
        <p>
          Текущий URL: {{ skin.url }} <br />
          Текущий тип скина:
          {{
            skin.metadata && skin.metadata.model == "slim"
            ? "Slim"
            : "Обычный"
          }}
        </p>
      </q-card-section>
      <q-card-section>
        <q-file v-model="file" label="Выберите файл для загрузки" accept=".png, image/png">

        </q-file>
        <q-toggle v-model="toggleSlim" label="Slim скин"></q-toggle>
      </q-card-section>
      <q-separator dark></q-separator>

      <q-card-actions>
        <q-btn flat color="primary" @click="upload" :disable="!file">Загрузить</q-btn>
        <q-btn flat color="secondary">Изменить тип</q-btn>
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
    skin: {
      required: true,
    },
  },
  emits: ["update"],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    const toggleSlim = ref(false);
    const file = ref(null);
    let show = ref(false);
    return {
      async upload() {
        const fd = new FormData();
        fd.append("options", new Blob([JSON.stringify({
          "modelSlim": toggleSlim.value
        })], {
          type: "application/json"
        }))
        fd.append("file", file.value)
        var response = await fetch($store.state.api.url + "cabinet/upload/skin", {
          "method": "POST",
          "body": fd
        })
        if (response.ok) {
          var data = await response.json();
          $q.notify({
            "type": "positive",
            "message": "Скин успешно загружен"
          })
          context.emit('update', data)
          show = false
        } else {
          var error = await response.json()
          $q.notify({
            "type": "negative",
            "message": "Ошибка при загрузке скина: SC" + error.code + ": " + error.error
          })
        }
      },
      async remove() {
        var response = await fetch($store.state.api.url + "cabinet/upload/skin", {
          "method": "DELETE"
        })
        if (response.ok) {
          show = false
        }
      },
      toggleSlim,
      file,
      show
    };
  },
});
</script>
