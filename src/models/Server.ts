import {ServerState} from "@/models/ServerState";
import Deferred from "@/models/Deferred";

export default class Server {

  id: string;
  hostname: string;
  port: number;
  name: string;

  connection: WebSocket | null = null;

  state: ServerState = ServerState.UNKNOWN;

  private rpcIdCounter: number = 1;
  private awaitingResponses: Map<number, Deferred<object>> = new Map();

  constructor(id: string, hostname: string, port: number, name: string | null = null) {
    this.id = id;
    this.hostname = hostname;
    this.port = port;
    this.name = name || hostname + ':' + port;

    this.connectWebSocket();
  }

  connectWebSocket() {

    console.log("Connecting to WebSocket:", `ws://${this.hostname}:${this.port}`);

    const socket = new WebSocket(`ws://${this.hostname}:${this.port}`);
    this.connection = socket;
    socket.addEventListener("open", async () => {
      console.log(`WebSocket to ${this.hostname}:${this.port} connected.`);
      this.state = ServerState.ONLINE;
      console.log(await this.sendMessage("minecraft:players"))
      //this.discover();
    });
    socket.addEventListener("close", () => {
      console.log(`WebSocket to ${this.hostname}:${this.port} disconnected.`);
      this.state = ServerState.OFFLINE;
    });
    socket.addEventListener("message", (event) => {
      console.log(`Message from ${this.hostname}:${this.port}:`, event.data);
      const message = JSON.parse(event.data);
      if (typeof message?.id === "number" && message?.result !== undefined) {
        const deferred = this.awaitingResponses.get(message.id);
        if (deferred === undefined) return;
        deferred.resolve(message.result);
      }
    });
  }

  discover() {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({id:1 ,method:"rpc.discover"}));
    } else {
      console.warn(`WebSocket to ${this.hostname}:${this.port} is not open.`);
    }
  }

  async sendMessage(method: string, payload: object | null = null): Promise<object> {
    const id = this.rpcIdCounter++;

    const deferred = new Deferred<object>();

    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({id: id, method: method}));
    } else {
      deferred.reject(new Error(`WebSocket to ${this.hostname}:${this.port} is not open.`))
    }

    this.awaitingResponses.set(id, deferred)

    // Make it clean up after itself
    deferred.promise.finally(() => {
      this.awaitingResponses.delete(id);
    });

    return await deferred.promise;
  }

}