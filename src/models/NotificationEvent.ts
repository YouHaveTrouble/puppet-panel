export default class NotificationEvent extends Event {

  server: string;
  method: string;
  params: { [key: string]: any } | Array<any> | null;

  constructor(server: string, method: string, params: { [key: string]: any } | Array<any> | null  = null) {
    super("server-notification");
    this.server = server;
    this.method = method;
    this.params = params;
  }

}
