// Export the selected device serial number (SN).
let selectedDeviceUid;

export const setSelectedDeviceSerialNumber = (deviceUid) => {
    selectedDeviceUid = deviceUid;
};

export const getSelectedDeviceSerialNumber = () => {
    return selectedDeviceUid;
};