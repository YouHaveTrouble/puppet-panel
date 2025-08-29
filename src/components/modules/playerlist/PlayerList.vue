<template>
  <fieldset class="player-list">
    <legend>Players ({{ players.length }})</legend>
    <ul>
      <li class="player-display" v-for="player in players" :key="player.id">
        <div class="head">
          <img :src="`https://minotar.net/helm/${player.id}/100.png`" :alt="`Head of ${player.name}`" />
        </div>
        <span class="name">
          {{player.name}}
        </span>
      </li>
    </ul>
  </fieldset>

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Server from "@/models/Server";
import Player from "@/models/Player";
import NotificationEvent from "@/models/NotificationEvent";

export default defineComponent({
  name: 'PlayerList',
  data() {
    return {
      players: [] as Array<Player>,
    }
  },
  props: {
    server: {
      type: Object as PropType<Server|null>,
      required: false,
      default: null,
    }
  },
  methods: {
    async getFullList(): Promise<Array<Player>> {
      if (!this.server) return [];
      const players: Array<Player> = [];
      const playerList = await this.server.sendMessage("minecraft:players");
      for (const playerData of playerList) {
        const player = new Player(playerData.id, playerData.name);
        players.push(player);
      }
      return players;
    },
  },
  async mounted(): Promise<void> {
    this.players = await this.getFullList();
    window.addEventListener("server-notification", (event: NotificationEvent) => {
        if (event.server !== this.server.id) return;
        if (event.method === "players/joined") {
          if (!Array.isArray(event.params)) return;
          for (const p of event.params) {
            const player = new Player(p.id, p.name);
            this.players.push(player);
          }

        } else if (event.method === "players/left") {
          if (!Array.isArray(event.params)) return;

          this.players = this.players.filter((p: Player) => event.params.includes(p.id) );
        }
    });
  }
});
</script>

<style scoped lang="scss">
  .player-list {
    padding: 0.5rem;

    legend {
      border: 1px solid azure;
      padding: 0.25rem;
    }

    .player-display {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.25rem;
      border: 1px solid azure;
      width: min-content;
      padding: 0.25rem 0.75rem;
      .head {
        width: 1rem;
        height: 1rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

  }
</style>