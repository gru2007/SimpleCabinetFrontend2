<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $store = useStore();
    return {
      sitekey: computed(() => $store.state.api.hcaptcha.sitekey)
    }
  },
  render() {
      hcaptcha.render('captcha-1', {
        sitekey: sitekey,
        'error-callback': 'onError',
      });
  }
})
</script>
