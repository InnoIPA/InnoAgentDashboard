// Export the selected device serial number (SN).
let selectedDeviceSerialNumber;

export const setSelectedDeviceSerialNumber = (serialNumber) => {
    selectedDeviceSerialNumber = serialNumber;
};

export const getSelectedDeviceSerialNumber = () => {
    return selectedDeviceSerialNumber;
};