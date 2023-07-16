<template>
  <q-card style="width: 100%; max-width: 800px">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <head-avatar :skin="user.assets ? user.assets.skin : null"></head-avatar>
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
        <skin-view-3d :skinUrl="
          user && user.assets && user.assets.skin
            ? user.assets.skin.url
            : null
        " :capeUrl="
  user && user.assets && user.assets.cape
    ? user.assets.cape.url
    : null
">
        </skin-view-3d>
        <q-card-actions>
          <q-btn v-if="owner == true" flat @click="modalSkin.show = true">{{ $t("cabinet.button.change-skin") }}</q-btn>
          <q-btn v-if="owner == true" flat @click="modalCape.show = true">{{ $t("cabinet.button.change-cape") }}</q-btn>
          <q-btn v-if="owner == false && isAdmin == true" flat color="red" @click="adminDeleteAsset(user, 'SKIN')">{{ $t("cabinet.button.delete-skin") }}</q-btn>
          <q-btn v-if="owner == false && isAdmin == true" flat color="red" @click="adminDeleteAsset(user, 'CAPE')">{{ $t("cabinet.button.delete-cape") }}</q-btn>
        </q-card-actions>
      </q-card-section>
      <q-separator vertical></q-separator>
      <q-card-section class="col-6">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("cabinet.label.status") }}
                <q-btn v-if="owner == true" flat round icon="edit" size="xs"
                  @click="modalChangeStatus.show = true"></q-btn>
                <q-btn v-if="isAdmin == true && owner == false" flat round icon="delete" size="xs" color="red"
                  @click="deleteUserStatus(user)"></q-btn>
              </q-item-label>
              <q-item-label caption>{{
                user.status ? user.status : $t("cabinet.label.status.none")
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("cabinet.label.groups") }} <q-btn v-if="isAdmin == true" flat round icon="add" size="xs"
                  @click="modalAddGroup.show = true"></q-btn></q-item-label>
              <q-item-label v-if="!user.groups || user.groups.length == 0" caption>
                {{ $t("cabinet.label.groups.none") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item-section>
            <q-list bordered style="max-width: 400px" v-if="user.groups && user.groups.length > 0">
              <q-item v-for="group in user.groups" v-bind:key="group.name">
                <q-item-section>
                  <q-item-label>
                    {{ group.groupName }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn v-if="isAdmin == true && !(owner == true && group.groupName == 'ADMIN')" flat round icon="delete"
                    @click="deleteUserGroup(user, group)"></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t("cabinet.label.balance") }} <q-btn v-if="isAdmin == true" flat round icon="add" size="xs"
                  @click="modalAddMoney.show = true"></q-btn> <q-btn v-if="owner == true" flat round icon="payment" size="xs"
                  @click="modalPayment.show = true"></q-btn> <q-btn v-if="owner == true" flat round icon="currency_exchange" size="xs"
                  @click="modalExchangeMoney.show = true"></q-btn>
              </q-item-label>
              <q-item-label v-if="balances.length == 0" caption>
                {{ $t("cabinet.label.balance.none") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-list bordered>
            <q-item v-for="balance in balances" v-bind:key="balance.id">
              <q-item-section>
                <q-item-label>{{ balance.currency }}</q-item-label>
                <q-item-label caption>Баланс: {{ balance.balance }} | Номер:
                  {{ balance.id }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item v-if="owner == true && securityInfo != null">
              <q-btn-group>
                <q-btn @click="modalChangePassword.show = true">{{ $t("cabinet.button.change-password") }}</q-btn>
                <q-btn v-if="securityInfo.enabled2FA == false" @click="modalEnable2FA.show = true">{{ $t("cabinet.button.enable2fa") }}</q-btn>
                <q-btn v-if="securityInfo.enabled2FA == true" @click="modalDisable2FA.show = true">{{ $t("cabinet.button.disable2fa") }}</q-btn>
              </q-btn-group>
            </q-item>
            <q-item v-if="isAdmin == true">
              <q-btn-group>
                <q-btn color="red" @click="modalBan.show = true">{{ $t("cabinet.button.ban") }}</q-btn>
                <q-btn color="red" @click="unban(user)">{{ $t("cabinet.button.unban") }}</q-btn>
              </q-btn-group>
            </q-item>
          </q-list>
        </q-list>
      </q-card-section>
    </q-card-section>
    <upload-skin-dialog ref="modalSkin" :skin="user.assets ? user.assets.skin : null"
      @update="(data) => updateAsset('skin', data)">
    </upload-skin-dialog>

    <upload-cape-dialog ref="modalCape" :cape="user.assets ? user.assets.cape : null"
      @update="(data) => updateAsset('cape', data)">
    </upload-cape-dialog>

    <change-password-dialog ref="modalChangePassword"> </change-password-dialog>

    <change-status-dialog ref="modalChangeStatus" :oldStatus="user.status ? user.status : null">
    </change-status-dialog>

    <admin-add-group-dialog ref="modalAddGroup" :user="user"></admin-add-group-dialog>
    <admin-add-money-dialog ref="modalAddMoney" :user="user"></admin-add-money-dialog>
    <ban-dialog ref="modalBan" :user="user"></ban-dialog>
    <enable-2fa-dialog ref="modalEnable2FA"></enable-2fa-dialog>
    <disable-2fa-dialog ref="modalDisable2FA"></disable-2fa-dialog>
    <payment-dialog ref="modalPayment"></payment-dialog>
    <exchange-money-dialog ref="modalExchangeMoney" :balances="balances" :user="user"></exchange-money-dialog>
  </q-card>
</template>
<script>
import SkinView3d from "src/components/utils/SkinView3d.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
import UploadSkinDialog from "./dialogs/UploadSkinDialog.vue";
import UploadCapeDialog from "./dialogs/UploadCapeDialog.vue";
import ChangePasswordDialog from "./dialogs/ChangePasswordDialog.vue";
import Enable2FADialog from "./dialogs/Enable2FADialog.vue";
import Disable2FADialog from "./dialogs/Disable2FADialog.vue";
import BanDialog from "./dialogs/BanDialog.vue";
import HeadAvatar from "./utils/HeadAvatar.vue";
import { useQuasar } from "quasar";
import ChangeStatusDialog from "./dialogs/ChangeStatusDialog.vue";
import AdminAddGroupDialog from "./dialogs/AdminAddGroupDialog.vue";
import AdminAddMoneyDialog from "./dialogs/AdminAddMoneyDialog.vue";
import PaymentDialog from "./dialogs/PaymentDialog.vue";
import ExchangeMoneyDialog from "./dialogs/ExchangeMoneyDialog.vue";

export default defineComponent({
  components: {
    "skin-view-3d": SkinView3d,
    UploadSkinDialog,
    UploadCapeDialog,
    ChangePasswordDialog,
    BanDialog,
    HeadAvatar,
    ChangeStatusDialog,
    AdminAddGroupDialog,
    AdminAddMoneyDialog,
    PaymentDialog,
    ExchangeMoneyDialog,
    "enable-2fa-dialog": Enable2FADialog,
    "disable-2fa-dialog": Disable2FADialog,
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
    var securityInfo = ref(null);
    const modalSkin = ref(false);
    const modalCape = ref(false);
    const modalChangePassword = ref(false);
    const modalChangeStatus = ref(false);
    const modalEnable2FA = ref(false);
    const modalDisable2FA = ref(false);
    const modalAddGroup = ref(false);
    const modalAddMoney = ref(false);
    const modalBan = ref(false);
    const modalPayment = ref(false);
    const modalExchangeMoney = ref(false);
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
        $store
          .dispatch("api/request", {
            url: "cabinet/security/info",
            method: "GET",
          })
          .then((x) => {
            if (x.ok) {
              securityInfo.value = x.data;
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
      var result = await $store.dispatch("api/request", {
        url: "users/id/" + user.id + "/asset/" + assetName,
        method: "DELETE",
      });
      if (result.ok) {
        $q.notify({
          type: "positive",
          message: "Ассет " + assetName + " успешно удалён",
        });
        delete user.assets[assetName.toLowerCase()];
      } else {
        $q.notify({
          type: "negative",
          message:
            "Произошла ошибка при удалении ассета " +
            assetName +
            " SC" +
            result.data.code,
        });
      }
    }
    var updateAsset = (assetName, data) => {
      if (props.owner == true) {
        $store.commit("api/updateCurrentUserAsset", {
          name: assetName,
          value: data,
        });
      } else {
        user.assets[assetName] = data;
      }
    };
    async function deleteUserStatus(user) {
      var result = await $store.dispatch("api/request", {
        url: "users/id/" + user.id + "/status",
        method: "DELETE",
      });
      if (result.ok) {
        $q.notify({
          type: "positive",
          message: "Статус успешно удалён",
        });
        user.status = null;
      } else {
        $q.notify({
          type: "negative",
          message:
            "Произошла ошибка при удалении статуса: SC" + result.data.code,
        });
      }
    }
    async function deleteUserGroup(user, group) {
      var result = await $store.dispatch("api/request", {
        url: "users/id/" + user.id + "/group/" + group.groupName,
        method: "DELETE",
      });
      if (result.ok) {
        $q.notify({
          type: "positive",
          message: "Группа успешно удалена",
        });
        //user.groups.remove(group); // TODO
      } else {
        $q.notify({
          type: "negative",
          message:
            "Произошла ошибка при удалении статуса: SC" + result.data.code,
        });
      }
    }
    async function unban(user) {
      var result = await $store.dispatch("api/request", {
        url: "admin/moderation/unban/" + user.id,
        method: "POST",
        body: {}
      });
      if (result.ok) {
        $q.notify({
          type: "positive",
          message: "Пользователь успешно разбанен",
        });
        //user.groups.remove(group); // TODO
      } else {
        var error = result.data;
        $q.notify({
          type: "negative",
          message:
            "Произошла ошибка при разбане пользователя: SC" + error.code + ": " + error.error,
        });
      }
    }
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
      modalChangeStatus,
      modalAddGroup,
      modalAddMoney,
      modalEnable2FA,
      modalDisable2FA,
      modalBan,
      modalPayment,
      modalExchangeMoney,
      authWatch,
      isAdmin: computed(() => $store.getters["api/isAdmin"]),
      adminDeleteAsset,
      deleteUserStatus,
      deleteUserGroup,
      updateAsset,
      unban,
      securityInfo,
    };
  },
});
</script>
