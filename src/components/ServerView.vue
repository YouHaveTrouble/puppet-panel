<template>

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Server from "@/models/Server";

export default defineComponent({
  name: 'App',
  props: {
    server: Object as PropType<Server>,
  },
  mounted(): void {

  }
});
</script>

<style scoped lang="scss">

</style>