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

        if (addr === "") {
            this.serverAddr = addr;
            this.setAxiosBaseUrl(this.serverAddr);
            return this.serverAddr;
        }

        // Open the dashboard page from remote.
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

    createAxiosInstance(baseUrl = "", timeout = 120 * 1000) {
        return axios.create({
            baseUrl,
            timeout: timeout,
            headers: { "Content-Type": "application/json" },
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
            return undefined;
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
            return undefined;
        }

    }

    async getNetworkConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/lan`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    async getServerConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/server`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    async getSerialConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/serial`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    async getGpioConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/gpio`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            return undefined;
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


    // Old APIs.

    async deviceEnableGPIOPinsAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/gpio-list/${deviceUid}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return [];
        }
    }

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