import { deviceConfig } from "../config/deviceConfig";

export const getElementFromDeviceConfig = (index, keyName) => {

    // Check if the device index is invalid.
    if (index > deviceConfig.length || index < 0) {
        return undefined;
    }

    if (!keyName) {
        return deviceConfig[index];
    }

    // Return the specify item device config.
    return deviceConfig[index][keyName];
};