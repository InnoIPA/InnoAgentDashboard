/* eslint-disable no-undef */
import axios from "axios";

export class APIHandler {

    constructor() {
        this.doc = document;
        this.serverAddr = "";
        // Create device API global axios instance.
        this.devicesAPI = this.createAxiosInstance("");
    }

    /**
     * Set the service URL.
     * @param {string} addr The service URL.
     * @returns 
     */
    setServerAddress(addr = "") {

        this.serverAddr = addr;
        this.setAxiosBaseUrl(this.serverAddr);
        return this.serverAddr;

    }

    /**
     *  Modify the default axios baseUrl.
     * @param {string} addr The service URL.
     */
    setAxiosBaseUrl(addr = "") {
        this.devicesAPI.defaults.baseURL = addr;
    }

    createAxiosInstance(baseUrl = "", timeout = 120 * 1000, headers = { "Content-Type": "application/json" }) {
        return axios.create({
            baseUrl,
            timeout,
            headers,
            cache: false,
        });
    }

    async onlineStatusAPI(deviceUid) {

        // The request URL.
        const url = `/api/devices/status/${deviceUid}`;
        try {
            const response = await this.devicesAPI.get(url);

            // Device connection testing.
            const axiosSuccessEvent = new CustomEvent("deviceConnectionTesting", {
                detail: { url, response }
            });
            document.dispatchEvent(axiosSuccessEvent);


            if (typeof document.axiosSuccess === "function") {
                document.axiosSuccess({ url, response: 1 });
            }

            console.log("Online status:", response.data.payload[deviceUid]);

            // Check if the status API is null, returns the default status.
            return (response.data.payload[deviceUid]) ? response.data.payload[deviceUid] : { innoAgent: 0, host: 0 };
        }

        catch (error) {

            if (typeof document.axiosSuccess === "function") {
                document.axiosSuccess({ url, response: 0 });
            }

            return { innoAgent: 0, host: 0 };
        }
    }

    async agentStatusAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/info`);
            return response.data.payload.params.response;
        }
        catch (error) {
            return {
                "hostHB": 0,
                "mode": 0,
                "gpio_model": 1,
                "net_type": 0,
                "LAN_MAC": "e0d55e4d9bc6",
                "WIFI_MAC": ""
            };
        }
    }

    async networkStatusAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/network-status`);
            return response.data.payload.params.response;
        }
        catch (error) {
            return {
                "name": "eth0",
                "ip": "172.16.92.133",
                "gateway": "172.16.92.254",
                "netmask": "255.255.255.0",
                "DNS1": "192.168.168.45",
                "DNS2": "192.168.168.11"
            };
        }
    }

    async webServiceVersionAPI() {
        try {
            const response = await this.devicesAPI.get("/api/service/show-config");
            return response.data.payload.VersionNumber;
        }
        catch (error) {
            return "x.x.x.x";
        }
    }

    async getAgentConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/agent`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            // return undefined;
            return {
                "IO_INTERVAL": 1000,
                "HB_INTERVAL": 30
            };
        }

    }

    async getNetworkConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/lan`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            // return undefined;
            return { "LAN_STATIC_USE": 0, "LAN_STATIC_IP": "192.168.3.102", "LAN_STATIC_DEFAULT_GATEWAY": "192.168.3.1", "LAN_STATIC_NETMASK": "255.255.255.0", "LAN_STATIC_DNS1": "192.168.168.45", "LAN_STATIC_DNS2": "192.168.168.11" };
        }

    }

    async getServerConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/server`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return {
                "USERNAME": "innoage",
                "PASSWORD": "B673AEBC6D65E7F42CFABFC7E01C02D0",
                "IP": "172.16.92.127",
                "PORT": "1883"
            };
        }

    }

    async getSerialConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/serial`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return {
                "INNO_UART": {
                    "BAUDRATE": 115200,
                    "DATABITS": 8,
                    "PARITY": "N",
                    "STOPBITS": 1
                },
                "INNO_RS232": {
                    "BAUDRATE": 115200,
                    "DATABITS": 8,
                    "PARITY": "N",
                    "STOPBITS": 1
                }
            };
        }

    }

    async getGpioConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/gpio`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            // return undefined;
            return {
                "INNO_GPIO_1": { "DIRECTION": "in", "VALUE": "1" }, "INNO_GPIO_2": { "DIRECTION": "in", "VALUE": "1" }, "INNO_GPIO_3": { "DIRECTION": "in", "VALUE": "1" }, "INNO_GPIO_4": { "DIRECTION": "in", "VALUE": "1" }, "INNO_GPIO_5": { "DIRECTION": "in", "VALUE": "1" }, "INNO_GPIO_6": { "DIRECTION": "in", "VALUE": "1" }
            };

        }
    }

    async sendGPIOOutputAPI(deviceUid, method, params = { name: "INNO_GPIO_OUTPUT1", value: "high", interval: 500 }) {
        try {
            const result = await this.devicesAPI.post(`/api/devices/${deviceUid}/${method}`, params);
            return result.data.payload.reported.params.response;
        }
        catch (error) {
            return "failed";
        }
    }

    async boardRestartAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/${deviceUid}/board-restart`);
            return response.data.payload.params.response;
        }
        catch (error) {
            return undefined;
        }
    }

    async setAgentConfigAPI(deviceUid, params) {

        try {
            const response = await this.devicesAPI.post(`/api/devices/config/${deviceUid}/agent`, params);
            return response.data.payload.reported.params.response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async setNetworkConfigAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/config/${deviceUid}/lan`, params);
            return response.data.payload.reported.params.response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async setServerConfigAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/config/${deviceUid}/server`, params);
            return response.data.payload.reported.params.response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async setGpioConfigAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/config/${deviceUid}/gpio`, params);
            return response.data.payload.reported.params.response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async setSerialConfigAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/config/${deviceUid}/serial`, params);
            return response.data.payload.reported.params.response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async getAvailableGpioPinsAPI(deviceUid, mode = "OUTPUT") {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/gpio-status`);
            const availableGPIOPinLists = Object.keys(response.data.payload.params.response);

            return availableGPIOPinLists.filter(element => {

                switch (mode.toUpperCase()) {

                    // Output
                    case ("OUTPUT"):
                        return (element.includes("OUTPUT"))
                            ? true
                            : false;

                    // All GPIO pins, expert the default output;
                    case ("OTHER"):
                        return (element.includes("OUTPUT"))
                            ? false
                            : true;

                    // All GPIO pins.
                    case ("ALL"):
                        return true;

                    // Not above.
                    default:
                        return true;
                }
            });
        }
        catch (error) {
            return [];
        }
    }

    async getCurrentGPIOStatusAPI(deviceUid, { filtered: mode = null }) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/gpio-status`);
            const responseData = response.data.payload.params.response;


            const filtered = Object.keys(responseData)
                .filter(key => !key.includes(mode))
                .reduce((obj, key) => {
                    obj[key] = responseData[key];
                    return obj;
                }, {});


            return filtered;
        }
        catch (error) {

            return {
                "INNO_GPIO_1": { "DIRECTION": "in", "VALUE": "1" },
                "INNO_GPIO_2": { "DIRECTION": "in", "VALUE": "1" },
                "INNO_GPIO_3": { "DIRECTION": "in", "VALUE": "1" },
                "INNO_GPIO_4": { "DIRECTION": "in", "VALUE": "1" },
                "INNO_GPIO_5": { "DIRECTION": "in", "VALUE": "1" },
                "INNO_GPIO_6": { "DIRECTION": "out", "VALUE": "0" },
                "INNO_GPIO_OUTPUT1": { "DIRECTION": "out", "VALUE": "0" },
                "INNO_GPIO_OUTPUT2": { "DIRECTION": "out", "VALUE": "0" }
            };

        }
    }

    // OTA 
    async uploadFWImageAPI(formData) {
        try {
            const response = await this.devicesAPI.post("api/ota/file", formData, { headers: { "Content-Type": "multipart/form-data" } });
            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }


    async getFWImageMetaData(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`api/ota/file/${deviceUid}/info`);
            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async deleteFWImage(deviceUid) {
        try {
            const response = await this.devicesAPI.delete(`api/ota/file/${deviceUid}`);
            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }


    // Dashboard config API.
    async getDashboardConfigAPI() {
        try {
            const response = await this.devicesAPI.get("api/dashboard/config");
            if (Array.isArray(response.data)) return response.data[0];

            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async createDashboardConfigAPI(params) {
        try {
            const response = await this.devicesAPI.post("api/dashboard/config", params);
            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async updateDashboardConfigAPI(configId, params) {
        try {
            const response = await this.devicesAPI.patch(`api/dashboard/config/${configId}`, params);
            return response.data;
        }
        catch (error) {
            return undefined;
        }
    }

    async upsertDashboardConfigAPI(params) {
        const findingResult = await this.getDashboardConfigAPI();
        return (findingResult)
            ? await this.updateDashboardConfigAPI(findingResult.configId, params)
            : await this.createDashboardConfigAPI(params);
    }

    // Device config API.

    // Get device config API.
    async getDeviceConfigAPI(deviceUid = undefined) {
        // Get all devices config.
        if (!deviceUid) {
            const response = await this.devicesAPI.get("api/dashboard/devices/config");
            return response.data;
        }

        // Get the single device config.
        const response = await this.devicesAPI.get(`api/dashboard/devices/config/${deviceUid}`);
        return response.data;
    }

    // Create device config API.
    async createDeviceConfigAPI(params) {
        const response = await this.devicesAPI.post("api/dashboard/devices/config/", params);
        return response.data;
    }

    // Update device config API.
    async updateDeviceConfigAPI(deviceUid, params) {
        const response = await this.devicesAPI.patch(`api/dashboard/devices/config/${deviceUid}`, params);
        return response.data;
    }

    // Delete device config API.
    async deleteDeviceConfigAPI(deviceUid) {
        const response = await this.devicesAPI.delete(`api/dashboard/devices/config/${deviceUid}`);
        return response.data;
    }

    // Device status API.
    async getDeviceStatusAPI(deviceUid) {
        // Get all devices status.
        if (!deviceUid) {
            const response = await this.devicesAPI.get("api/dashboard/devices/status");
            return response.data;
        }

        // Get the single device status.
        const response = await this.devicesAPI.get(`api/dashboard/devices/status/${deviceUid}`);
        return response.data;
    }

    async upsertDeviceStatusAPI() {
        const response = await this.devicesAPI.patch(`api/dashboard/devices/status/${deviceUid}`, params);
        return response.data;
    }


    // Old APIs.

    async deviceEnableSerialPortsAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/tty-list/${deviceUid}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return [];
        }
    }

    async deviceGPIOAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post("/devices/gpio", params);
            return +({ Status } = response.data.Payload.Data.reported);
        }
        catch (error) {
            return 0;
        }
    }

    async deviceSerialPortAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post("/devices/tty", params);
            return +({ Status } = response.data.Payload.Data.reported);
        }
        catch (error) {
            return 0;
        }
    }

    async getOOBDeviceConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/board-config/${deviceUid}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return null;
        }
    }

    async setOOBDeviceConfigAPI(deviceUid, config) {
        try {
            const response = await this.devicesAPI.post("/devices/config/board-config", { deviceUid, config });
            return response.data.Payload.Data.reported;
        }
        catch (error) {
            return null;
        }
    }
}

export const apiHandler = new APIHandler();