import { getDashboardDefaultConfiguration } from "./applicationConstants";

// Export the selected device serial number (SN).
let selectedDeviceUid;

export const setSelectedDeviceSerialNumber = (deviceUid) => {
    selectedDeviceUid = deviceUid;
};

export const getSelectedDeviceSerialNumber = () => {
    return selectedDeviceUid;
};

// Set dashboard config.
export const setDashboardConfiguration = (config) => {
    if (localStorage.getItem("InnoAgent_dashboard_configuration") !== "undefined") localStorage.removeItem("InnoAgent_dashboard_configuration");
    localStorage.setItem("InnoAgent_dashboard_configuration", JSON.stringify(config));
};

// Get dashboard config.
export const getDashboardConfiguration = (item) => {
    // Get the specified dashboard config item.
    const config = localStorage.getItem("InnoAgent_dashboard_configuration");

    if (config) {
        const parsedConfig = JSON.parse(config);

        return (item)
            ? parsedConfig[item]
            : parsedConfig;
    }

    // eslint-disable-next-line no-constant-condition
    if (config === null || "undefined") {
        const defaultConfig = getDashboardDefaultConfiguration();
        return (item)
            ? defaultConfig[item]
            : defaultConfig;
    }

};

// Set device group selected index.
export const setDeviceGroupSelectedIndex = (idx) => {
    if (idx <= 0) {
        idx = 0;
    }
    localStorage.setItem("InnoAgent_dashboard_device_selected_index", idx);
};

// Get device group selected index.
export const getDeviceGroupSelectedIndex = () => {
    return localStorage.getItem("InnoAgent_dashboard_device_selected_index");
};

// Set dashboard service status.
export const setDashboardServiceStatus = (status) => {
    if (localStorage.getItem("InnoAgent_dashboard_service_status") !== "undefined") localStorage.removeItem("InnoAgent_dashboard_service_status");
    localStorage.setItem("InnoAgent_dashboard_service_status", status);
};

// Get dashboard service status.
export const getDashboardServiceStatus = () => {
    return localStorage.getItem("InnoAgent_dashboard_service_status");
};