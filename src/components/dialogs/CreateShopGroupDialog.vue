<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Создание нового товара (группа)</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input v-model="displayName" label="Отображаемое имя"></q-input>
        <q-input outlined v-model="description" type="textarea" label="Описание"></q-input>
        <q-input v-model="price" label="Цена"></q-input>
        <q-input v-model="currency" label="Валюта"></q-input>
        <UploadFile ref="file"></UploadFile>
        <q-separator></q-separator>
        <q-checkbox v-model="local" label="Локальная группа"></q-checkbox>
        <q-input v-if="!local" v-model="name_" label="Имя группы luckperms"></q-input>
        <q-input v-if="!local" v-model="server" label="Сервер"></q-input>
        <q-input v-if="!local" v-model="world" label="Мир"></q-input>
        <q-input v-if="!local" v-model="context" label="Контекст"></q-input>
        <q-separator></q-separator>
        <q-input v-model="expireDays" label="Колличество дней"></q-input>
        <q-input v-model="localName" label="Имя группы в SimpleCabinet 2"></q-input>
        <q-checkbox v-model="stackable" label="Разрешить стакинг"></q-checkbox>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="send()">Загрузить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";
import UploadFile from "./UploadFile.vue";

export default defineComponent({
  props: {
  },
  emits: [],
  components: { UploadFile, UploadFile },
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    let show = ref(false);
    var displayName = ref("");
    var description = ref("");
    var name_ = ref("");
    var server = ref("global");
    var world = ref("global");
    var context = ref("{}");
    var local = ref(false);
    var expireDays = ref(-1);
    var price = ref(100.0);
    var currency = ref("DONATE");
    var stackable = ref(false);
    var localName = ref("");
    var file = ref(null);
    async function send() {
      var result = await $store.dispatch("api/request", {
          url: "shop/group/new",
          method: "PUT",
          body: {
            displayName: displayName.value,
            description: description.value,
            name: name_.value,
            server: server.value,
            world: world.value,
            context: context.value,
            local: local.value,
            expireDays: expireDays.value,
            price: price.value,
            currency: currency.value,
            stacktable: stackable.value,
            localName: localName.value,
            pictureName: file.value.name
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Товар создан"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при создании товара: SC" + error.code + ": " + error.error
          })
        }
    }
    return {
      show,
      displayName,
      description,
      name_,
      server,
      world,
      context,
      local,
      expireDays,
      price,
      currency,
      stackable,
      localName,
      file,
      send
    };
  },
});
</script>
