<template>
  <main>
    <ServerList
      v-if="currentView === 'server-list'"
      :servers="servers as Array<Server>"
      @add-server="addServer"
      @select-server="selectedServer = $event; currentView = 'server-view';"
    />
    <ServerView
      v-if="currentView === 'server-view' && selectedServer"
      :server="selectedServer as Server|null"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Server from "@/models/Server";
import ServerList from "@/components/ServerList.vue";
import ServerView from "@/components/ServerView.vue";

export default defineComponent({
  name: 'App',
  components: {
    ServerList,
    ServerView,
  },
  data() {
    return {
      currentView: 'server-list',
      selectedServer: null as Server | null,
      servers: [] as Array<Server>,
    }
  },
  methods: {
    addServer(server: Server) {
      console.debug("Adding server", server);
      this.servers.push(server);
      this.saveServerList();
    },
    saveServerList() {
      const list: Array<{id: string, hostname: string, port: number, name: string }> = [];
      this.servers.forEach((server: Server) => {
        list.push({id: server.id, hostname: server.hostname, port: server.port, name: server.name });
      });
      window.localStorage.setItem("servers", JSON.stringify(list));
    },
  },
  mounted() {
    let serverData = window.localStorage.getItem("servers");
    if (!serverData) return;
    const servers = JSON.parse(serverData);
    if (!Array.isArray(servers)) {
      this.servers = [];
      return;
    }

    for (const serverData of servers) {
      if (!serverData.id || !serverData.hostname || !serverData.port) continue;
      const server = new Server(serverData.id, serverData.hostname, serverData.port, serverData?.name || null);
      this.servers.push(server);
    }
  },
  unmounted(): void {
    this.servers.forEach(server => {
      server?.connection?.close();
    })
  },
})

</script>

<style lang="scss" scoped>

</style>
