<template>
<q-file v-model="file" label="Выберите файл для загрузки" accept=".png, image/png">

</q-file>
</template>
<script>
import { computed, defineComponent, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore, mapState } from "vuex";

export default defineComponent({
  props: {
  },
  emits: ["update"],
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    var name = ref(null);
    var file = ref(null);
    async function upload() {
      const fd = new FormData();
      fd.append("file", file.value);
      var response = await fetch($store.state.api.url + "admin/upload/simpleupload", {
          "method": "POST",
          "body": fd
      })
      if (response.ok) {
        var data = await response.json();
          $q.notify({
            "type": "positive",
            "message": "Файл успешно загружен"
          })
          console.log(data);
          name.value = data.name;
          context.emit('update', data)
      } else {
          var error = await response.json()
          $q.notify({
            "type": "negative",
            "message": "Ошибка при загрузке файла: SC" + error.code + ": " + error.error
          })
      }
    }
    watch(() => file.value, (value, oldValue) => {
      if(value) {
        upload();
      }
    })
    return {
      name,
      file
    }
  }
});
</script>
