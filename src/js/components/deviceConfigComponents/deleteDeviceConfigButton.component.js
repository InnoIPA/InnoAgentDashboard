// API library
import { apiHandler } from "../../library/APILibrary";
import { getSelectedDeviceSerialNumber, getDeviceGroupSelectedIndex, setDeviceGroupSelectedIndex } from "../../sharedVariable";

// Pop-up alert utils.
import { alertUtils } from "../../library/alertUtils";

import { DELETE_DEVICE_CONFIGURATION_ALERT, DELETE_DEVICE_CONFIGURATION_STATUS } from "../../applicationConstants";
import { deviceIndexGroupButtonComponentInstance } from "../../../index";

export default class DeleteDeviceConfigButtonComponent {
    constructor() {
        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.deleteDeviceConfigButtonDOM = document.querySelector("#delete-device-config-btn");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        const fn = () => { this.doOperation(); };
        this.deleteDeviceConfigButtonDOM.removeEventListener("click", fn);
        this.deleteDeviceConfigButtonDOM.addEventListener("click", fn, false);
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {

            // User confirmed pop-up
            const alert = await alertUtils.customQuestionAlert(DELETE_DEVICE_CONFIGURATION_ALERT.ICON, DELETE_DEVICE_CONFIGURATION_ALERT.TITLE, DELETE_DEVICE_CONFIGURATION_ALERT.MESSAGE, true);

            // OK button clicked.
            if (alert.isConfirmed) {

                const response = await apiHandler.deleteDeviceConfigAPI(getSelectedDeviceSerialNumber());

                if (!response) {
                    return alertUtils.mixinAlert(DELETE_DEVICE_CONFIGURATION_STATUS.FAILED.ICON, DELETE_DEVICE_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }

                // Modify the selected index.
                let idx = getDeviceGroupSelectedIndex();
                setDeviceGroupSelectedIndex(idx - 1);

                // Refresh the device index group button.
                await deviceIndexGroupButtonComponentInstance.fetchDeviceDataFromServer();
                deviceIndexGroupButtonComponentInstance.deviceButtonClickFunction(idx - 1);

                alertUtils.mixinAlert(DELETE_DEVICE_CONFIGURATION_STATUS.SUCCESS.ICON, DELETE_DEVICE_CONFIGURATION_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

            }


            // Cancel button clicked.
            if (alert.dismiss) {
                return alertUtils.mixinAlert(DELETE_DEVICE_CONFIGURATION_STATUS.CANCEL.ICON, DELETE_DEVICE_CONFIGURATION_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

        }
        catch (error) {
            console.error(error);
        }
    }
}