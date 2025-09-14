const { WebSocket } = require("ws");

let ws: WebSocket | null = null;
let lastMessage: string | null = null;

type WollokObject = { [key: string]: any; innerValue: string };

const wsApi = {
  *connect(
    this: any,
    self: any,
    url: WollokObject,
    playerId: WollokObject
  ): any {
    ws = new WebSocket(url.innerValue);

    ws.onopen = () => {
      console.log("Connected to server.");
      ws.send(`player_connected|${playerId.innerValue}`);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      switch (data.type) {
        case "player_connected":
        case "player_disconnected":
          lastMessage = `${data.type}|${data.player.id}`;
          return;
        case "player_update":
          lastMessage = `${data.type}|${data.player.id}|${data.player.x}@${data.player.y}`;
          return;
        default:
          throw new Error(`Error in wsApi. Unknown message type: ${data.type}`);
      }
    };
  },
  *send(this: any, self: any, msgObj: WollokObject) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msgObj.innerValue);
    }
  },
  *getMessage(this: any, self: any) {
    const msg = lastMessage;
    lastMessage = null; // Clear after reading
    return this.reify(msg);
  },
};

export { wsApi };
