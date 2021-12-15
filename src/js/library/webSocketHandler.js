import { replaceProtocolToWS } from "../library/utils/webSocketUtils";
import { WS_PING_INTERVAL } from "../config/commonConfig";

export default class WebSocketHandler {
    constructor(wsUrl = "", wsPath = "") {
        this.wsUrl = replaceProtocolToWS(wsUrl) + wsPath;
        this.wsClient = undefined;
        this.reconnectionTimer = undefined;
        this.retryConnectCount = 0;
        this.pingInterval = undefined;

        this.connect(this.wsUrl);
    }

    async connect(url) {
        if (!url) return console.error("Could not connect to the websocket server, the connection information is empty or undefined!");

        try {
            this.wsClient = new WebSocket(url);
            this.setEventListener();
            return this.wsClient;
        }
        catch (error) {
            console.error(`Error catch at web socket connect: ${error}`);
        }

    }

    async reconnect() {
        // Clear all intervals.
        clearInterval(this.pingInterval);
        clearTimeout(this.reconnectionTimer);
        this.reconnectionTimer = null;
        this.pingInterval = null;

        console.log("Reconnecting to Thingsboard web socket, retry times:", ++this.retryConnectCount);

    }

    setEventListener() {
        this.wsClient.onopen = (evt) => {
            console.log(`Web socket connection open: ${evt.target.url}`);

            // Web socket ping pong.
            this.pingInterval = setInterval(this.ping.bind(this), WS_PING_INTERVAL);
        };
        this.wsClient.onclose = () => {
            this.webSocketEventHandler.setCurrentClientId(this.clientId);
            // If the connection was closed, emit the error event.
            this.wsClient.emit("error");
        };

        this.wsClient.onmessage = (message) => {
            console.log("On ws message", message);
            const p = document.createElement("p");
            p.classList.add("log");
            p.innerText = message.data;

            document.querySelector(".logWrapper").appendChild(p);
        };

        this.wsClient.onerror = (error) => {
            console.error("Error catch at server web socket, will be retry in 10 seconds.");

            if (error) {
                this.webSocketEventHandler.onTBError(error);
            }

            // Try to reconnect to thingsboard.
            this.reconnectionTimer = setTimeout(this.reconnect.bind(this), 10000);
        };
    }

    ping() {
        this.send(JSON.stringify({ dataType: "clientMessage", payload: { dashboardHeartbeat: Date.now() } }));
    }

    send(data) {
        if (this.wsClient.readyState === WebSocket.OPEN) {
            try {
                this.wsClient.send(data);
            } catch (error) {
                console.error(`Error catch at web socket handler send: ${error}`);
            }
        }
    }
}