<template>
  <img style="image-rendering: pixelated;" ref="avatar">
</template>
<script>
import { computed, ref, unref, watch } from '@vue/runtime-core'
export default {
  props: {
    skin: {
      required: true,
    },
  },
  setup(props) {
    const avatar = ref(null);
    const skin = ref(null);
    const update = (skinurl) => {
      if (!skinurl) {
        return;
      }
      var canvas = document.createElement("canvas");
      var context = canvas.getContext('2d');
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        var scale = img.naturalWidth / 64;
        var headpos = scale * 8;
        canvas.width = headpos;
        canvas.height = headpos;
        context.drawImage(img, headpos /*sourceX*/, headpos /*sourceX*/, headpos /*sourceWidth*/, headpos /*sourceHeight*/,
          0 /*destX*/, 0/*destY*/, headpos /*destWidth*/, headpos /*destHeight*/);
        context.drawImage(img, headpos * 5 /*sourceX*/, headpos /*sourceY*/, headpos /*sourceWidth*/, headpos /*sourceHeight*/,
          0 /*destX*/, 0/*destY*/, headpos /*destWidth*/, headpos /*destHeight*/);
        avatar.value.src = canvas.toDataURL("image/png");
      };
      img.onerror = function (e) {
        console.log(e);
      }
      img.src = skinurl.url;
    }
    const watcher = watch(() => props.skin, (newvalue) => {
      update(unref(newvalue));
    })
    if (props.skin) {
      update(unref(props.skin));
    }
    return {
      skin, avatar, watcher
    }
  },
}
</script>
