<template>
  <div class="server-list">
    <div class="controls">
      <button popovertarget="server-add">Add Server</button>

    </div>
    <div popover id="server-add">
      <h2>Add server</h2>
      <form
        @submit.prevent="addServer"
      >
        <label>
          <span>Hostname</span>
          <input
            type="text"
            name="hostname"
            placeholder="localhost"
            v-model="hostname"
            required
          />
        </label>
        <label>
          <span>Port</span>
          <input
            type="number"
            name="port"
            v-model="port"
            placeholder="25585"
            required
          />
        </label>
        <label>
          <span>Name</span>
          <input
            type="text"
            name="name"
            v-model="name"
            placeholder="A Minecraft Server"
          />
        </label>
        <button
          popovertarget="server-add"
          popovertargetaction="toggle"
        >Add</button>
      </form>

    </div>
    <ul>
      <li
        v-for="server in servers"
        :key="server.id"
        @click="$emit('selectServer', server)"
      >{{server.name}}</li>
    </ul>
  </div>

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Server from "@/models/Server";

export default defineComponent({
  name: 'ServerList',
  emits: ['addServer', 'selectServer'],
  data() {
    return {
      hostname: '',
      port: '',
      name: '',
    };
  },
  props: {
    servers: {
      type: Object as PropType<Array<Server>>,
      required: false,
      default: [],
    },
  },
  methods: {
    addServer(): void {
      console.log("Adding server", this.hostname, this.port, this.name);
      const portNumber = this.port ? parseInt(this.port) : 25565;
      const server = new Server(crypto.randomUUID(), this.hostname, portNumber, this.name || null);
      this.$emit('addServer', server);
      this.hostname = '';
      this.port = '';
      this.name = '';

      const popover = document.querySelector("#server-add") as HTMLElement;
      if (!popover) return;
      popover?.hidePopover();
    }
  },
});
</script>

<style scoped lang="scss">
  .server-list {
    padding: 1rem;
  }

  #server-add {
    margin: auto auto;
    width: min(100%, 30rem);
    padding: 1rem;
    &:popover-open {
      display: flex;
      flex-direction: column;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      label {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        text-transform: uppercase;
      }
    }
  }
</style>