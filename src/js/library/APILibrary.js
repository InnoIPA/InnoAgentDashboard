/* eslint-disable no-undef */
import axios from "axios";

export class APIHandler {

    constructor() {
        this.doc = document;
        this.protocol = this.doc.location.protocol.startsWith("https") ? "wss://" : "ws://";
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

    async onlineStatusAPI(serialNumber) {

        // The request URL.
        const url = `/devices/status/${serialNumber}`;
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

            return +({ Status } = response.data.Payload.Data);
        }

        catch (error) {

            if (typeof document.axiosSuccess === "function") {
                document.axiosSuccess({ url, response: 0 });
            }

            return 0;
        }
    }

    async deviceInfoAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/device-info/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return null;
        }
    }

    async webServiceVersionAPI() {
        try {
            const response = await this.devicesAPI.get("/api/show-config");
            return response.data.Payload.Data.VersionNumber;
        }
        catch (error) {
            return "x.x.x.x";
        }
    }

    async deviceNetworkAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/network-info/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return null;
        }

    }

    async deviceTimeAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/system-time/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return null;
        }
    }

    async deviceEnableGPIOPinsAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/gpio-list/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return [];
        }
    }

    async deviceEnableSerialPortsAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/tty-list/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return [];
        }
    }

    async deviceSystemRebootAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.post("/devices/system-reboot", { serialNumber });
            return +({ Status } = response.data.Payload.Data);
        }
        catch (error) {
            return 0;
        }
    }

    async devicePowerSwitchAPI(serialNumber, params) {
        // Add the device serialNumber into params.
        params["serialNumber"] = serialNumber;
        try {
            const response = await this.devicesAPI.post("/devices/power-switch", params);
            return +({ Status } = response.data.Payload.Data.reported);
        }
        catch (error) {
            return 0;
        }
    }

    async deviceGPIOAPI(serialNumber, params) {
        // Add the device serialNumber into params.
        params["serialNumber"] = serialNumber;
        try {
            const response = await this.devicesAPI.post("/devices/gpio", params);
            return +({ Status } = response.data.Payload.Data.reported);
        }
        catch (error) {
            return 0;
        }
    }

    async deviceSerialPortAPI(serialNumber, params) {
        // Add the device serialNumber into params.
        params["serialNumber"] = serialNumber;
        try {
            const response = await this.devicesAPI.post("/devices/tty", params);
            return +({ Status } = response.data.Payload.Data.reported);
        }
        catch (error) {
            return 0;
        }
    }

    async getOOBDeviceConfigAPI(serialNumber) {
        try {
            const response = await this.devicesAPI.get(`/devices/info/board-config/${serialNumber}`);
            return response.data.Payload.Data;
        }
        catch (error) {
            return null;
        }
    }

    async setOOBDeviceConfigAPI(serialNumber, config) {
        try {
            const response = await this.devicesAPI.post("/devices/config/board-config", { serialNumber, config });
            return response.data.Payload.Data.reported;
        }
        catch (error) {
            return null;
        }
    }
}

export const apiHandler = new APIHandler();