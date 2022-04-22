<template>
  <q-card style="width: 100%; max-width: 800px;">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img src="" />
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
        <skin-view-3d :skinUrl="user && user.assets && user.assets.skin ? user.assets.skin.url : null">
        </skin-view-3d>
        <q-card-actions>
          <q-btn flat @click="modalSkin.show = true">Изменить скин</q-btn>
          <q-btn flat @click="modalCape.show = true">Изменить плащ</q-btn>
        </q-card-actions>
      </q-card-section>
      <q-separator vertical></q-separator>
      <q-card-section class="col-6">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Cтатус</q-item-label>
              <q-item-label caption>{{ user.status ? user.status : "Нет статуса" }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Группы</q-item-label>
              <q-item-label caption>{{ user.group && user.group.length > 0 ? user.group.join(", ") : "Нет групп" }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-list>
            <q-item>
              <q-btn-group>
                <q-btn @click="modalChangePassword.show = true">Сменить пароль</q-btn>
              </q-btn-group>
            </q-item>
          </q-list>
        </q-list>
      </q-card-section>
    </q-card-section>
    <upload-skin-dialog ref="modalSkin" :skin="user.assets ? user.assets.skin : null">

    </upload-skin-dialog>

    <upload-cape-dialog ref="modalCape" :cape="user.assets ? user.assets.cape : null">

    </upload-cape-dialog>

    <change-password-dialog ref="modalChangePassword">

    </change-password-dialog>
  </q-card>
</template>
<script>
import SkinView3d from "src/components/SkinView3d.vue";
import { computed, defineComponent, ref } from "vue";
import { useStore, mapState } from "vuex";
import UploadSkinDialog from "./UploadSkinDialog.vue";
import UploadCapeDialog from "./UploadCapeDialog.vue";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import ChangePasswordDialog1 from "./ChangePasswordDialog.vue";

export default defineComponent({
  components: { "skin-view-3d": SkinView3d, UploadSkinDialog, UploadCapeDialog, ChangePasswordDialog, ChangePasswordDialog1 },
  props: {
    user: {
      required: true,
    },
    owner: {
      default: false,
    },
  },
  setup(props) {
    const $store = useStore();
    const modalSkin = ref(false);
    const modalCape = ref(false);
    const modalChangePassword = ref(false);
    return {
      modalSkin,
      modalCape,
      modalChangePassword,
    };
  },
});
</script>
