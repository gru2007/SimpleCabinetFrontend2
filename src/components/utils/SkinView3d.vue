<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { defineComponent, unref, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { SkinViewer, createOrbitControls } from "skinview3d"

export default defineComponent({
  props: {
    skinUrl: {
      required: true
    },
    capeUrl: {
      default: ''
    },
  },
  setup(props) {
    const $store = useStore();
    const canvas = ref(null);
    var skinViewer = ref(null);
    const skinWatch = watch(() => props.skinUrl, (value, oldValue) => {
      skinViewer.loadSkin(value);
    })
    const capeWatch = watch(() => props.capeUrl, (value, oldValue) => {
      skinViewer.loadCape(value);
    })
    onMounted(() => {
      skinViewer = new SkinViewer({
        canvas: unref(canvas),
        width: 300,
        height: 400,
        skin: unref(props.skinUrl)
      });
      let control = createOrbitControls(skinViewer);
      control.enableRotate = true;
      control.enableZoom = false;
      control.enablePan = false;
    });
    return {
      canvas,
      skinWatch,
      capeWatch
    };
  }
});
</script>
