<template>
  <q-page class="flex flex-center">
  <register-pane />
  </q-page>
</template>

<script>
import RegisterPane from 'src/components/RegisterPane.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { RegisterPane },
  name: 'PageRegister'
})
</script>
