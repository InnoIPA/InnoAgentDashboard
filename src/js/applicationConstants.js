export const WS_PATH = "ws/innoagent";

export const WS_PING_INTERVAL = 3 * 1000;

// Dashboard default configuration.
export const getDashboardDefaultConfiguration = () => {
    // Get current windows URL.
    const getCurrentWindowsURL = `${document.location.protocol}//${document.location.hostname.startsWith("localhost") ? "127.0.0.1" : document.location.hostname}:8162`;
    return {
        serverAddress: getCurrentWindowsURL,
        dashboardWebTitle: "InnoAgent Web Utility",
        dashboardCopyrightText: "© 2021 Innodisk Corporation. All Rights Reserved.",
        checkStatusInterval: 5000
    };
};



// Alert title
export const alertTitle = {
    success: "Success",
    error: "Error",
    dismiss: "Cancel"
};

// Operation message.
export const alertMessage = {
    success: "completed!",
    error: "Please try again later...",
    dismiss: "Operation has been cancelled!"
};

// OTA image is not present message.
export const FW_IMAGE_NOT_PRESENT = "Please select a valid image file.";

// Upload FW image status message.
export const FW_IMAGE_UPLOAD_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "FW image upload successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to upload FW image file, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user, <br> and the image file is not upload!" },
    EXISTS: { ICON: "warning", MESSAGE: "The server already has existing FW image, do you want to overwrite it?" }
};

// Upload FW image pre-inspection alert.
export const FW_IMAGE_UPLOAD_PRE_INSPECTION_ALERT = {
    ICON: "warning",
    TITLE: "Are you sure?",
    MESSAGE: "The server already has an existing FW image, do you want to overwrite it?",
};

// Delete FW image alert.
export const FW_IMAGE_DELETE_ALERT = {
    ICON: "warning",
    TITLE: "Are you sure?",
    MESSAGE: "Will delete an existing FW image on the server, do you want to continue?"
};

// Delete FW image status.
export const FW_IMAGE_DELETE_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "FW image delete successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to delete FW image file, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user, <br> and the image file is not delete!" },
};

// FW image does not found.
export const FW_IMAGE_NOT_FOUND_ALERT = {
    ICON: "error",
    TITLE: "Error",
    MESSAGE: "The specified FW image does not found!"
};

// Update device FW alert.
export const UPDATE_DEVICE_FW_ALERT = {
    ICON: "info",
    TITLE: "Are you sure?",
    MESSAGE: "If you want to update current device FW, press the OK button.",
};

// Update device fw status.
export const UPDATE_DEVICE_FW_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Update request has been sent!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to update the specified device FW, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};

// Dashboard configuration reset status.
export const GET_DASHBOARD_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Fetch dashboard configuration successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Unable to get the dashboard configuration, the dashboard may not work properly!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};

// Reset Dashboard configuration alert.
export const SETUP_DASHBOARD_CONFIGURATION_ALERT = {
    ICON: "info",
    TITLE: "Are you sure?",
    MESSAGE: "If you want to modified the dashboard configuration, press the OK button.",
};

// Dashboard configuration reset status.
export const SETUP_DASHBOARD_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Update dashboard configuration successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to apply dashboard configuration, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};


// Reset Dashboard configuration alert.
export const RESET_DASHBOARD_CONFIGURATION_ALERT = {
    ICON: "info",
    TITLE: "Are you sure?",
    MESSAGE: "If you want to reset dashboard configuration as default, press the OK button.",
};

// Dashboard configuration reset status.
export const RESET_DASHBOARD_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Reset dashboard configuration as default successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to apply dashboard configuration, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};

// Add device config status.
export const ADD_DEVICE_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Device(s) added!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to add device, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};


// Update device config status.
export const UPDATE_DEVICE_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Update device configuration successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to update specified device, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};


// Delete device config alert.
export const DELETE_DEVICE_CONFIGURATION_ALERT = {
    ICON: "warning",
    TITLE: "Are you sure?",
    MESSAGE: "Will delete this device, do you want to continue?"
};


// Delete device config status.
export const DELETE_DEVICE_CONFIGURATION_STATUS = {
    SUCCESS: { ICON: "success", MESSAGE: "Delete device configuration successfully!" },
    FAILED: { ICON: "error", MESSAGE: "Failed to delete specified device, please try again later!" },
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user." },
};