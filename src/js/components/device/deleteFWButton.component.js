// API library
import { apiHandler } from "../../library/APILibrary";

// Pop-up alert utils.
import { alertUtils } from "../../library/alertUtils";

// Constants.
import { FW_IMAGE_DELETE_ALERT, FW_IMAGE_NOT_FOUND_ALERT, FW_IMAGE_DELETE_STATUS } from "../../applicationConstants";

export default class DeleteFWButtonComponent {
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
        this.deleteFWButtonDOM = document.querySelector("#ota-delete-file-button");
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
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {
            const deviceUid = "global";

            // Check if the specified image is existing on the server.
            const isImageExists = await this.deleteFWImagePreInspection(deviceUid);

            if (!isImageExists) {
                return alertUtils.mixinAlert(FW_IMAGE_NOT_FOUND_ALERT.ICON, FW_IMAGE_NOT_FOUND_ALERT.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

            // User confirmed pop-up
            const alert = await alertUtils.customQuestionAlert(FW_IMAGE_DELETE_ALERT.ICON, FW_IMAGE_DELETE_ALERT.TITLE, FW_IMAGE_DELETE_ALERT.MESSAGE, true);

            // OK button clicked.
            if (alert.isConfirmed) {

                const response = await apiHandler.deleteFWImage(deviceUid);
                return (response)
                    ? alertUtils.mixinAlert(FW_IMAGE_DELETE_STATUS.SUCCESS.ICON, FW_IMAGE_DELETE_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true })
                    : alertUtils.mixinAlert(FW_IMAGE_DELETE_STATUS.FAILED.ICON, FW_IMAGE_DELETE_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

            }

            // Cancel button clicked.
            return alertUtils.mixinAlert(FW_IMAGE_DELETE_STATUS.CANCEL.ICON, FW_IMAGE_DELETE_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * Delete FW image pre-inspection, check if the FW image is existing.
     * @param {string} compatibleDeviceUid The device uid to query compatible FW, default is "global"
     * @returns 
     */
    async deleteFWImagePreInspection(compatibleDeviceUid = "global") {
        const response = await apiHandler.getFWImageMetaData(compatibleDeviceUid);
        return (response)
            ? response
            : undefined;
    }

}