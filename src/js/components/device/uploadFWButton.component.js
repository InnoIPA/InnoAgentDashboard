import bsCustomFileInput from "bs-custom-file-input";

// API library
import { apiHandler } from "../../library/APILibrary";

// Pop-up alert utils.
import { alertObj, alertUtils } from "../../library/alertUtils";

// Dynamic table utils.
import { DynamicTableHandler } from "../../library/dynamicTable";

// Pop-up page.
import uploadFWAlert from "../../../html/pages/uploadFWAlert.html";

// Constants.
import { FW_IMAGE_NOT_PRESENT, FW_IMAGE_UPLOAD_STATUS, FW_IMAGE_UPLOAD_PRE_INSPECTION_ALERT } from "../../applicationConstants";



export default class UploadFWButtonComponent {

    constructor() {

        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Upload FW to server button.
        this.uploadFWButtonDOM = document.querySelector("#ota-upload-file-button");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        // Upload FW image to server button.
        const fn = () => { this.doOperation(); };
        this.uploadFWButtonDOM.removeEventListener("click", fn);
        this.uploadFWButtonDOM.addEventListener("click", fn, false);
    }

    /**
     * Pop-up onOpen callback.
     * @returns {function}
     */
    alertOnOpen() {
        return async () => {
            // Dynamic table.
            this.dynamicTableHandler = new DynamicTableHandler();
            bsCustomFileInput.init();

            // Get FW image metadata.
            const response = await apiHandler.getFWImageMetaData("global");
            if (response) {
                alertObj.getPopup().querySelector("#imageInfoContainer").classList.remove("d-none");
                alertObj.getPopup().querySelector("#imageInfo").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(response));
            }
        };
    }

    /**
     * Pop-up pre-confirm callback.
     * @returns {function}
     */
    alertPreConfirm() {
        return () => {
            const otaFileUploadForm = alertObj.getPopup().querySelector("#ota-file-upload-form");
            const formData = new FormData(otaFileUploadForm);

            // File length validator.
            if (formData.get("OTAImageFile").size <= 0) {
                return alertObj.showValidationMessage(FW_IMAGE_NOT_PRESENT);
            }

            return formData;
        };
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {
            const alert = await alertUtils.htmlAlert({ html: uploadFWAlert, onBeforeOpen: this.alertOnOpen(), preConfirm: this.alertPreConfirm(), confirmButtonText: "Upload" });


            // Pop-up submit button clicked.
            if (alert.isConfirmed === true) {

                // Check if the FW image is existing, if the FW image is already exists, pop-up an alert for user confirmed.  
                const isAllowOverwrite = await this.uploadPreInspection(String(alert.value.get("uid")));

                if (!isAllowOverwrite) return alertUtils.mixinAlert(FW_IMAGE_UPLOAD_STATUS.CANCEL.ICON, FW_IMAGE_UPLOAD_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

                // Upload the FW image to server.
                const response = await apiHandler.uploadFWImageAPI(alert.value);

                return (response)
                    ? alertUtils.mixinAlert(FW_IMAGE_UPLOAD_STATUS.SUCCESS.ICON, FW_IMAGE_UPLOAD_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true })
                    : alertUtils.mixinAlert(FW_IMAGE_UPLOAD_STATUS.FAILED.ICON, FW_IMAGE_UPLOAD_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

            // Otherwise.
            return alertUtils.mixinAlert(FW_IMAGE_UPLOAD_STATUS.CANCEL.ICON, FW_IMAGE_UPLOAD_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });


        }
        catch (error) {
            console.error(error);
        }
    }


    /**
     * Upload FW image pre-inspection, check if the FW image is existing.
     * @param {string} compatibleDeviceUid The device uid to query compatible FW, default is "global"
     * @returns {boolean} true will continue process, false will cancel the process.
     */
    async uploadPreInspection(compatibleDeviceUid = "global") {
        const response = await apiHandler.getFWImageMetaData(compatibleDeviceUid);
        if (response) {
            const overwriteConfirmedAlert = await alertUtils.customQuestionAlert(FW_IMAGE_UPLOAD_PRE_INSPECTION_ALERT.ICON, FW_IMAGE_UPLOAD_PRE_INSPECTION_ALERT.TITLE, FW_IMAGE_UPLOAD_PRE_INSPECTION_ALERT.MESSAGE, true);
            return (overwriteConfirmedAlert.isConfirmed) ? true : false;
        }
        // Default overwrite.
        return true;
    }


}