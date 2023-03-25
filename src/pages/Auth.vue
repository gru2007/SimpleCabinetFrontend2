<template>
  <q-page class="flex flex-center">
    <auth-pane />
  </q-page>
</template>

<script>
import AuthPane from 'src/components/AuthPane.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { AuthPane },
  name: 'PageIndex'
})
</script>
