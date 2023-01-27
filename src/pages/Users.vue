<template>
  <q-page>
    <q-input filled v-model="status" label="Строка поиска *" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Введите имя пользователя или его часть']" @click="search(status)">
    </q-input>
    <q-card flat>
      <q-card-section>

    <q-list>
      <q-item v-for="user in users" v-bind:key="user.id">
        <q-card style="width: 600px;">
          <q-item>
                <q-item-section avatar>
        <q-avatar>
          <head-avatar
            :skin="user.assets ? user.assets.skin : null"
          ></head-avatar>
        </q-avatar>
        </q-item-section>
        <q-item-section>

            <q-item-label>
              {{ user.username }}
            </q-item-label>
            <q-item-label caption>
              UUID: {{ user.uuid }}
            </q-item-label>
        </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-card-section>
            <q-btn flat @click="go(user)">Перейти в профиль</q-btn>
          </q-card-section>
        </q-card>
      </q-item>
    </q-list>
      </q-card-section>
      <q-card-section>

    <q-pagination
    v-model="currentPage"
    :max="maxPages"></q-pagination>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import Profile from "src/components/Profile.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore, mapState } from "vuex";
import HeadAvatar from "src/components/utils/HeadAvatar.vue";

export default defineComponent({
  components: { Profile, HeadAvatar },
  name: "PageCabinet",
  setup() {
    const $store = useStore();
    const $router = useRouter();
    var users = ref(null);
    var status = ref(null);
    var maxPages = ref(1);
    var currentPage = ref(1);
    async function search(str, page) {
      return await $store.dispatch("api/request", {
        url: "users/search/" + str + "?assets=true",
        method: "GET",
      });
    }
    async function getAll(page) {
      return await $store.dispatch("api/request", {
        url: "users/page/" + page,
        method: "GET",
      });
    }
    async function go(user) {
      $router.push("/user/name/" + user.username);
    }
    getAll(0).then((v) => {
      if (v.ok) {
        users.value = v.data.data;
        console.log(v.data);
        maxPages.value = v.data.totalPages;
        currentPage.value = 1;
      }
    });
    var watcher = watch(
      () => currentPage.value,
      (value, oldValue) => {
        if (value != oldValue) {
          getAll(value - 1).then((v) => {
            if (v.ok) {
              users.value = v.data.data;
              console.log(v.data);
              maxPages.value = v.data.maxPages;
              currentPage.value = value;
            }
          });
        }
      }
    );
    return {
      users,
      status,
      search,
      go,
      maxPages,
      currentPage,
    };
  },
});
</script>
