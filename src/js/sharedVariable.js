// Export the selected device serial number (SN).
let selectedDeviceUid;

export const setSelectedDeviceSerialNumber = (deviceUid) => {
    selectedDeviceUid = deviceUid;
};

export const getSelectedDeviceSerialNumber = () => {
    return selectedDeviceUid;
};

export const setDashboardConfiguration = (config) => {
    if (localStorage.getItem("InnoAgent_dashboard_configuration") !== "undefined") localStorage.removeItem("InnoAgent_dashboard_configuration");
    localStorage.setItem("InnoAgent_dashboard_configuration", JSON.stringify(config));
};

export const getDashboardConfiguration = (item) => {
    // Get the specified dashboard config item.
    const config = localStorage.getItem("InnoAgent_dashboard_configuration");

    if (config !== "undefined") {
        const parsedConfig = JSON.parse(config);

        return (item)
            ? parsedConfig[item]
            : parsedConfig;
    }

};