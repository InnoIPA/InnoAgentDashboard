import { replaceProtocolToWS } from "../library/utils/webSocketUtils";
import { WS_PING_INTERVAL } from "../applicationConstants";

// Pop-up alert utils.
import { alertUtils } from "../library/alertUtils";


export default class WebSocketHandler {
    constructor(wsUrl = "", wsPath = "") {
        this.wsUrl = replaceProtocolToWS(wsUrl) + wsPath;
        this.wsClient = undefined;
        this.reconnectionTimer = undefined;
        this.retryConnectCount = 0;
        this.pingInterval = undefined;

        this.connect(this.wsUrl);
    }

    setRemoteDataInstance(instance) {
        this.realTimeLogComponent = instance;
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

            // Real-time log.
            if (JSON.parse(message.data)["dataType"] === "clientLog") {
                this.realTimeLogComponent.insertLogData(message.data);
            }

            // OTA device response.
            if (JSON.parse(message.data)["dataType"] === "ota") {
                alertUtils.mixinAlert("info", `Device response : ${JSON.parse(message.data)["payload"]["result"]}`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

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

        // Ping message.
        this.send(JSON.stringify({ dataType: "clientMessage", payload: { dashboardHeartbeat: Date.now() } }));

        // Mock
        this.send(JSON.stringify({ dataType: "clientLog", payload: { heartbeat: Date.now() } }));
        setInterval(this.send(JSON.stringify({ dataType: "clientLog", payload: { rnData: Date.now() } }) + "\r\n"), 8000);

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