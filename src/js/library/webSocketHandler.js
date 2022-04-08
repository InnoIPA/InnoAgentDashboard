import { replaceProtocolToWS } from "../library/utils/webSocketUtils";
import { WS_PING_INTERVAL } from "../applicationConstants";

// Pop-up alert utils.
import { alertUtils } from "../library/alertUtils";
import { tryParseJSONString } from "./utils/objectUtils";
import { getSelectedDeviceSerialNumber } from "../sharedVariable";

// Reboot required handler.
import { rebootRequiredHandler } from "../library/boardRestartRequiredHandler";

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

        console.log("Reconnecting to web socket, retry times:", ++this.retryConnectCount);

    }

    setEventListener() {
        this.wsClient.onopen = (evt) => {
            console.log(`Web socket connection open: ${evt.target.url}`);

            // Web socket ping pong.
            this.pingInterval = setInterval(this.ping.bind(this), WS_PING_INTERVAL);
        };

        this.wsClient.onmessage = (message) => {

            const { dataType, payload } = tryParseJSONString(message.data);

            if (payload["MAC"] === getSelectedDeviceSerialNumber()) {
                // OTA telemetry message.
                if (dataType === "ota_result") {
                    if (payload["result"] === "successfully") rebootRequiredHandler({ need_restart: 1 });
                    return alertUtils.mixinAlert("info", `Device OTA ${getSelectedDeviceSerialNumber()} response : ${payload["result"]}`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }

                // Remote log.
                if (dataType === "remote_log") {
                    return this.realTimeLogComponent.insertLogData(payload["log"]);
                }
            }

        };

        this.wsClient.onerror = () => {
            console.error("Error catch at server web socket, will be retry in 10 seconds.");

            this.reconnectionTimer = setTimeout(this.reconnect.bind(this), 10000);
        };
    }

    ping() {

        // Ping message.
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