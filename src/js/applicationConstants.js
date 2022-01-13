// Loading device config error error message.
export const loadingDeviceConfigErrorMessage = "Unable to load the the 'config/deviceConfig.js' file, please check the config file and reload this page to try again!";

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

// Copyright.
export const copyrightText = "© 2021 Innodisk Corporation. All Rights Reserved.";


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
    CANCEL: { ICON: "info", MESSAGE: "This operation has been canceled by the user" },
};