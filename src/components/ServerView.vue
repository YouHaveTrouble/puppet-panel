<template>
  <PlayerList :server="server" />
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Server from "@/models/Server";
import PlayerList from "./modules/playerlist/PlayerList.vue";

export default defineComponent({
  name: 'ServerView',
  components: {
    PlayerList,
  },
  props: {
    server: {
      type: Object as PropType<Server|null>,
      required: false,
      default: null,
    }
  },
  mounted(): void {

  }
});
</script>

<style scoped lang="scss">

</style>