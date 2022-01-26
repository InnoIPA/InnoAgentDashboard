// API library
import { apiHandler } from "../../library/APILibrary";

import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

// Pop-up alert utils.
import { alertObj, alertUtils } from "../../library/alertUtils";

// Pop-up page.
import updateDeviceConfigAlert from "../../../html/pages/updateDeviceConfigAlert.html";

import { formToJSON, JSONToForm } from "../../library/utils/formUtils";
import { UPDATE_DEVICE_CONFIGURATION_STATUS } from "../../applicationConstants";
import { deviceIndexGroupButtonComponentInstance } from "../../../index";
export default class UpdateDeviceConfigButtonComponent {
    constructor() {
        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.updateDeviceConfigButtonDOM = document.querySelector("#modify-device-config-btn");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        const fn = () => { this.doOperation(); };
        this.updateDeviceConfigButtonDOM.removeEventListener("click", fn);
        this.updateDeviceConfigButtonDOM.addEventListener("click", fn, false);
    }

    /**
     * Get alert pop-up DOM element.
     */
    getPopupDOMElements() {
        // Update device config form.
        this.popupUpdateDeviceConfigFormDOM = alertObj.getPopup().querySelector("#update-device-config");

        // All checkbox in update config form.
        this.popupFormCheckboxes = this.popupUpdateDeviceConfigFormDOM.querySelectorAll("input[type='checkbox']");
    }

     /**
     * 
     * Alert pop-up event listener handler.
     */
    popupEventListenerHandler({ mode = "initial" }) {
        // When user clicked the checkbox, modify the checkbox value.
        const onCheckboxClickedFn = (event) => {
            return event.target.value = (event.target.checked)
                ? true
                : false;
        };

        // Initial event listener.
        if (mode === "initial") {
            // All checkboxes in the form.
            Array.from(this.popupFormCheckboxes).forEach((element) => element.removeEventListener("change", onCheckboxClickedFn));
            Array.from(this.popupFormCheckboxes).forEach((element) => element.addEventListener("change", onCheckboxClickedFn, false));
        }
        
        // Remove event listener.
        if (mode === "remove") {
            /// All checkboxes in the form.
            Array.from(this.popupFormCheckboxes).forEach((element) => element.removeEventListener("change", onCheckboxClickedFn));
        }

    }

    /**
     * Sweetalert on-open event.
     * 
     */
    alertOnOpen() {
        return async () => {
            this.getPopupDOMElements();
            this.popupEventListenerHandler({ mode: "initial" });

            const response = await apiHandler.getDeviceConfigAPI(getSelectedDeviceSerialNumber());
            if (!response) return alertUtils.mixinAlert(UPDATE_DEVICE_CONFIGURATION_STATUS.FAILED.ICON, UPDATE_DEVICE_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            JSONToForm(this.popupUpdateDeviceConfigFormDOM, response, ["id", "createdAt", "updateAt"]);
        };
    }

    /**
     * Sweetalert on-close event.
     */
    alertOnClose() {
        return () => {
            this.popupEventListenerHandler({ mode: "remove" });
        };
    }

    /**
     * Sweetalert pre-confirm event.
     * 
     */
    alertPreConfirm() {
        return () => {
            if (this.popupUpdateDeviceConfigFormDOM.checkValidity() !== true) {
                return this.popupUpdateDeviceConfigFormDOM.reportValidity();
            }
        };
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {
            const alert = await alertUtils.htmlAlert({ html: updateDeviceConfigAlert, onBeforeOpen: this.alertOnOpen(), preConfirm: this.alertPreConfirm(), confirmButtonText: "Update", width: "70%", onClose: this.alertOnClose() });

            if (alert.isConfirmed) {
                const data = formToJSON(this.popupUpdateDeviceConfigFormDOM);
                const response = await apiHandler.updateDeviceConfigAPI(getSelectedDeviceSerialNumber(), data);
                (response)
                    ? alertUtils.mixinAlert(UPDATE_DEVICE_CONFIGURATION_STATUS.SUCCESS.ICON, UPDATE_DEVICE_CONFIGURATION_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true })
                    : alertUtils.mixinAlert(UPDATE_DEVICE_CONFIGURATION_STATUS.FAILED.ICON, UPDATE_DEVICE_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

            // Refresh the device index group button.
            await deviceIndexGroupButtonComponentInstance.fetchDeviceDataFromServer();

            if (alert.dismiss) {
                return alertUtils.mixinAlert(UPDATE_DEVICE_CONFIGURATION_STATUS.CANCEL.ICON, UPDATE_DEVICE_CONFIGURATION_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }


        }
        catch (error) {
            console.error(error);
        }

    }
}