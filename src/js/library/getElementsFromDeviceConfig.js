export const getElementFromDeviceConfig = (config, index, keyName) => {

    // Check if the device index is invalid.
    if (index > config.length || index < 0) {
        return undefined;
    }

    if (!keyName) {
        return config[index];
    }

    // Return the specify item device config.
    return config[index][keyName];
};