<template>
  <q-dialog v-model="show" @before-show="fetchNewCode()">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Включение 2FA</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section v-if="key != null">
        <p>Отсканируйте qr код с помощью мобильного приложения <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Google Authenticator</a>, <a href="https://play.google.com/store/apps/details?id=com.authy.authy">Authy</a> или другого приложения с поддержкой генерации TOTP кодов</p>
        <div class="flex flex-center">
          <qrcode-vue :value="value" :size=300 level="H" />
        </div>
        <p style="word-wrap: break-word;">Или введите код вручную: <b>{{ key }}</b></p>
      </q-card-section>
      <q-card-section v-if="key == null">
        Выполняется запрос...
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="code" type="password" label="Введите код из приложения *" lazy-rules
          :rules="[val => val && val.length == 6 && ( val >= 0 && val <= 999999 ) || 'Проверьте правильность написания кода']">
        </q-input>
      </q-card-section>
      <q-separator dark></q-separator>

      <q-card-actions>
        <q-btn flat color="primary" @click="enable2FA">Включить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
import QrcodeVue from 'qrcode.vue'


export default defineComponent({
  components: {
    QrcodeVue,
  },
  setup(props) {
    const $store = useStore();
    const $q = useQuasar();
    const key = ref(null);
    const value = ref("");
    const code = ref(null);
    let show = ref(false);
    async function fetchNewCode() {
      var result = await $store.dispatch("api/request", {
          url: "cabinet/security/prepare2fa",
          method: "POST",
          body: {
          },
        });
      key.value = result.data.secret;
      value.value = result.data.uri;
    }
    return {
      async enable2FA() {
        var result = await $store.dispatch("api/request", {
          url: "cabinet/security/enable2fa",
          method: "POST",
          body: {
            secret: key.value,
            code: code.value,
          },
        });
        if (result.ok) {
          $q.notify({
            "type": "positive",
            "message": "2FA успешно включен"
          })
          show = false
        } else {
          var error = result.data
          $q.notify({
            "type": "negative",
            "message": "Ошибка при включении 2FA: SC" + error.code + ": " + error.error
          })
        }
      },
      key,
      value,
      code,
      show,
      fetchNewCode
    };
  },
});
</script>
