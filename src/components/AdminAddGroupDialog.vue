<template>
      <q-dialog v-model="show">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Добавление группы</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="groupName" label="Название *" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Введите название группы']">
          </q-input>
          <q-input filled v-model="days" type="integer" label="Дней до истечения *" lazy-rules
          :rules="[ val => val && val >= 0 || 'Введите колличество дней (0 - бесконечно)']">
          </q-input>
          <q-input filled v-model="priority" type="integer" label="Приоритет *" lazy-rules
          :rules="[ val => val && val >= 0 || 'Введите приоритет']">
          </q-input>
        </q-card-section>
        <q-separator dark></q-separator>

        <q-card-actions>
          <q-btn flat color="primary" @click="addGroup">Добавить</q-btn>
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
    user: {
      required: true,
    },
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const groupName = ref(null);
    const days = ref(0);
    const priority = ref(0);
    let show = ref(false);
    return {
      async addGroup() {
        var result = await $store.dispatch("api/request", {
          url: "users/id/"+props.user.id+"/group/"+groupName.value,
          method: "PUT",
          body: {
            days: days.value,
            priority: priority.value,
          },
        });
        if(result.ok) {
          $q.notify({
            "type": "positive",
            "message": "Группа успушно добавлена"
          })
          //props.user.groups.push(result.data); // TODO
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при добавлении группы: SC" + error.code + ": " + error.error
          })
        }
      },
      groupName,
      days,
      priority,
      show
    };
  },
});
</script>
