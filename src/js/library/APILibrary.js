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
            return undefined;
        }
    }

    async networkStatusAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/network-status`);
            return response.data.payload.params.response;
        }
        catch (error) {
            return undefined;
        }
    }

    async webServiceVersionAPI() {
        try {
            const response = await this.devicesAPI.get("/api/service/show-config");
            return response.data.payload.serviceVersion;
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
            return undefined;
        }

    }

    async getNetworkConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/config/${deviceUid}/lan`);
            return response.data.payload.params.response.data;
        }
        catch (error) {
            // return undefined;
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
            // return undefined;
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

            return undefined;

        }
    }

    // Remote log.
    async remoteLogAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/${deviceUid}/remote-log`, params);
            return response.data.payload.reported.params.response;
        }
        catch (error) {
            return undefined;
        }
    }

    // I2C detect.
    async i2cDetectAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.get(`/api/devices/${deviceUid}/i2c-detect`);
            return response.data.payload.params.response;
        }
        catch (error) {
            return undefined;
        }
    }

    // I2C read.
    async i2cReadAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/${deviceUid}/i2c-read`, params);
            return response.data.payload.params.response;
        }
        catch (error) {
            return undefined;
        }
    }

    // I2C write.
    async i2cWriteAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.post(`/api/devices/${deviceUid}/i2c-write`, params);
            return response.data.payload.params.response;
        }
        catch (error) {
            return undefined;
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

    // Start OTA process.
    async startOTAProcessAPI(deviceUid, params) {

        if (params.useGlobal === "undefined") params.useGlobal = true;
        try {
            const response = await this.devicesAPI.post(`api/devices/${deviceUid}/start-ota-process`, params);
            return { status: response.status, message: response.data.payload.params.response };
        }
        catch (error) {
            return { status: error.response.status, message: error.response.data.message };
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
        try {
            const findingResult = await this.getDashboardConfigAPI();
            return (findingResult)
                ? await this.updateDashboardConfigAPI(findingResult.configId, params)
                : await this.createDashboardConfigAPI(params);
        }
        catch (error) {
            return undefined;
        }

    }

    // Device config API.

    // Get device config API.
    async getDeviceConfigAPI(deviceUid = undefined) {
        try {
            // Get all devices config.
            if (!deviceUid) {
                const response = await this.devicesAPI.get("api/dashboard/devices/config");
                return response.data;
            }

            // Get the single device config.
            const response = await this.devicesAPI.get(`api/dashboard/devices/config/${deviceUid}`);
            return response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    // Create device config API.
    async createDeviceConfigAPI(params) {
        try {
            const response = await this.devicesAPI.post("api/dashboard/devices/config/", params);
            return response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    // Update device config API.
    async updateDeviceConfigAPI(deviceUid, params) {
        try {
            const response = await this.devicesAPI.patch(`api/dashboard/devices/config/${deviceUid}`, params);
            return response.data;
        }
        catch (error) {
            return undefined;
        }

    }

    // Delete device config API.
    async deleteDeviceConfigAPI(deviceUid) {
        try {
            const response = await this.devicesAPI.delete(`api/dashboard/devices/config/${deviceUid}`);
            return response.data;
        }
        catch (error) {
            return undefined;
        }

    }

}

export const apiHandler = new APIHandler();