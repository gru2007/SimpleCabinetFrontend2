<template>
  <q-card style="width: 100%; max-width: 800px">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <head-avatar
            :skin="user.assets ? user.assets.skin : null"
          ></head-avatar>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ user.username }}</q-item-label>
        <q-item-label caption>UUID: {{ user.uuid }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
    <q-card-section horizontal>
      <q-card-section>
        <skin-view-3d
          :skinUrl="
            user && user.assets && user.assets.skin
              ? user.assets.skin.url
              : null
          "
          :capeUrl="
            user && user.assets && user.assets.cape
              ? user.assets.cape.url
              : null
          "
        >
        </skin-view-3d>
        <q-card-actions>
          <q-btn v-if="owner == true" flat @click="modalSkin.show = true"
            >Изменить скин</q-btn
          >
          <q-btn v-if="owner == true" flat @click="modalCape.show = true"
            >Изменить плащ</q-btn
          >
          <q-btn v-if="owner == false && isAdmin == true" flat color="red" @click="adminDeleteAsset(user, 'SKIN')"
            >Удалить скин</q-btn
          >
          <q-btn v-if="owner == false && isAdmin == true" flat color="red" @click="adminDeleteAsset(user, 'CAPE')"
            >Удалить плащ</q-btn
          >
        </q-card-actions>
      </q-card-section>
      <q-separator vertical></q-separator>
      <q-card-section class="col-6">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Cтатус</q-item-label>
              <q-item-label caption>{{
                user.status ? user.status : "Нет статуса"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Группы</q-item-label>
              <q-item-label caption>{{
                user.groups && user.groups.length > 0
                  ? user.groups.map((x) => x.groupName).join(", ")
                  : "Нет групп"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="balances.length > 0"></q-separator>
          <q-item v-for="balance in balances" v-bind:key="balance.id">
            <q-item-section>
              <q-item-label>{{ balance.currency }}</q-item-label>
              <q-item-label caption
                >Баланс: {{ balance.balance }} | Номер:
                {{ balance.id }}</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-list>
            <q-item v-if="owner == true">
              <q-btn-group>
                <q-btn @click="modalChangePassword.show = true"
                  >Сменить пароль</q-btn
                >
                <q-btn v-if="isAdmin == true" @click="modalChangePassword.show = true"
                  >Включить 2FA</q-btn
                >
              </q-btn-group>
            </q-item>
            <q-item v-if="isAdmin == true">
              <q-btn-group>
                <q-btn color="red"
                  >Забанить</q-btn
                >
                <q-btn color="red"
                  >Удалить</q-btn
                >
              </q-btn-group>
            </q-item>
          </q-list>
        </q-list>
      </q-card-section>
    </q-card-section>
    <upload-skin-dialog
      ref="modalSkin"
      :skin="user.assets ? user.assets.skin : null"
      @update="(data) => updateAsset('skin', data)"
    >
    </upload-skin-dialog>

    <upload-cape-dialog
      ref="modalCape"
      :cape="user.assets ? user.assets.cape : null"
      @update="(data) => updateAsset('cape', data)"
    >
    </upload-cape-dialog>

    <change-password-dialog ref="modalChangePassword"> </change-password-dialog>
  </q-card>
</template>
<script>
import SkinView3d from "src/components/SkinView3d.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
import UploadSkinDialog from "./UploadSkinDialog.vue";
import UploadCapeDialog from "./UploadCapeDialog.vue";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import ChangePasswordDialog1 from "./ChangePasswordDialog.vue";
import HeadAvatar from "./HeadAvatar.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  components: {
    "skin-view-3d": SkinView3d,
    UploadSkinDialog,
    UploadCapeDialog,
    ChangePasswordDialog,
    ChangePasswordDialog1,
    HeadAvatar,
  },
  props: {
    user: {
      required: true,
    },
    owner: {
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const $store = useStore();
    var balances = ref([]);
    const modalSkin = ref(false);
    const modalCape = ref(false);
    const modalChangePassword = ref(false);
    async function updateInfo(user) {
      if (!user) {
        return;
      }
      if (props.owner == true) {
        $store
          .dispatch("api/request", {
            url: "cabinet/money/balance/page/0",
            method: "GET",
          })
          .then((x) => {
            if (x.ok) {
              balances.value = x.data.data;
            }
          });
      } else if ($store.getters["api/isAdmin"]) {
        $store
          .dispatch("api/request", {
            url: "admin/money/userbalance/all/userid/" + user.id + "/page/0",
            method: "GET",
          })
          .then((x) => {
            if (x.ok) {
              balances.value = x.data.data;
            }
          });
      }
    }
    async function adminDeleteAsset(user, assetName) {
      var result = await $store
          .dispatch("api/request", {
            url: "users/id/"+user.id+"/asset/"+assetName,
            method: "DELETE",
          });
      if(result.ok) {
        $q.notify({
            "type": "positive",
            "message": "Ассет "+assetName+" успешно удалён"
          })
        delete user.assets[assetName.toLowerCase()];
      } else {
        $q.notify({
            "type": "negative",
            "message": "Произошла ошибка при удалении ассета "+assetName+" SC"+result.data.code
          })
      }
    }
    var updateAsset = (assetName, data) => {
        if(props.owner == true) {
            $store.commit("api/updateCurrentUserAsset", {"name" : assetName, "value": data})
        } else {
            user.assets[assetName] = data
        }
    };
    updateInfo(props.user);
    const authWatch = watch(
      () => $store.state.api.user,
      (value, oldValue) => {
        updateInfo(value);
      }
    );
    return {
      owner: ref(props.owner),
      balances,
      modalSkin,
      modalCape,
      modalChangePassword,
      authWatch,
      isAdmin: computed(() => $store.getters["api/isAdmin"]),
      adminDeleteAsset,
      updateAsset
    };
  },
});
</script>
