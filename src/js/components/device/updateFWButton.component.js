// API library
import { apiHandler } from "../../library/APILibrary";

// Pop-up alert utils.
import { alertUtils } from "../../library/alertUtils";

// Constants.
import { UPDATE_DEVICE_FW_ALERT, FW_IMAGE_NOT_FOUND_ALERT, UPDATE_DEVICE_FW_STATUS } from "../../applicationConstants";

export default class UpdateFWButtonComponent {
    constructor() {
        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Delete FW to server button.
        this.deleteFWButtonDOM = document.querySelector("#ota-update-device-button");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        const fn = () => { this.doOperation(); };
        this.deleteFWButtonDOM.removeEventListener("click", fn);
        this.deleteFWButtonDOM.addEventListener("click", fn, false);
    }

    /**
    * Pop-up onOpen callback.
    * @returns {function}
    */
    alertOnOpen() {
        return async () => {
            return await this.updateFWImagePreInspection();
        };
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {
            const deviceUid = "global";

            // Check if the specified image is existing on the server.
            const isImageExists = await this.updateFWImagePreInspection(deviceUid);

            if (!isImageExists) {
                return alertUtils.mixinAlert(FW_IMAGE_NOT_FOUND_ALERT.ICON, FW_IMAGE_NOT_FOUND_ALERT.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

            // User confirmed pop-up
            const alert = await alertUtils.customQuestionAlert(UPDATE_DEVICE_FW_ALERT.ICON, UPDATE_DEVICE_FW_ALERT.TITLE, UPDATE_DEVICE_FW_ALERT.MESSAGE, true);

            // OK button clicked.
            if (alert.isConfirmed) {

                // TODO: API need to change.
                const response = await apiHandler.getFWImageMetaData(deviceUid);
                return (response)
                    ? alertUtils.mixinAlert(UPDATE_DEVICE_FW_STATUS.SUCCESS.ICON, UPDATE_DEVICE_FW_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true })
                    : alertUtils.mixinAlert(UPDATE_DEVICE_FW_STATUS.FAILED.ICON, UPDATE_DEVICE_FW_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

            }

            // Cancel button clicked.
            return alertUtils.mixinAlert(UPDATE_DEVICE_FW_STATUS.CANCEL.ICON, UPDATE_DEVICE_FW_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * Update FW image pre-inspection, check if the FW image is existing.
     * @param {string} compatibleDeviceUid The device uid to query compatible FW, default is "global"
     * @returns 
     */
    async updateFWImagePreInspection(compatibleDeviceUid = "global") {
        const response = await apiHandler.getFWImageMetaData(compatibleDeviceUid);
        return (response)
            ? response
            : undefined;
    }

}