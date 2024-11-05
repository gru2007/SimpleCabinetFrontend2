<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Отладочная панель</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-md">
          <q-input filled v-model="url" type="text" label="Частичный URL" lazy-rules
          :rules="[val => val && val.length > 0 || 'Введите  URL']">
        </q-input>
        <q-select v-model="method" :options="methods" label="Метод запроса"></q-select>
        <q-input filled v-model="body" type="textarea" label="Содержимое">
        </q-input>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="startRequest">Выполнить</q-btn>
      </q-card-actions>
      <q-card-section>
        <q-input filled v-model="response" readonly type="textarea" label="Ответ">
        </q-input>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore, mapState } from "vuex";

export default defineComponent({
  components: { },
  name: 'PageIndex',
  setup(props) {
    const $store = useStore();
    const url = ref(null);
    const method = ref("GET");
    const methods = ref(["GET", "POST", "PUT"])
    const body = ref(null);
    const response = ref(null);
    return {
      async startRequest() {
        var pre = {
          url: url.value,
          method: method.value,
        };
        if(body.value.length > 0) {
          pre.body = JSON.parse(body.value);
        }
        var result = await $store.dispatch("api/request", pre);
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Запрос выполнен успешно"
          })
          response.value = JSON.stringify(result.data, null, 2);
        } else {
          var error = result.data
          response.value = JSON.stringify(result.data, null, 2);
          $q.notify({
            "type": "negative",
            "message": "Ошибка при выполнении запроса: SC" + error.code + ": " + error.error
          })
        }
      },
      url,
      method,
      methods,
      body
    }
  }
})
</script>
