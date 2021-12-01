/**
 * Reboot button component
 * This component is a device system reboot button component that controls device system reboot function.
 * 
 */

// API library.
import { apiHandler } from "../../library/APILibrary";

// Pop-up alert utils.
import { alertUtils } from "../../library/alertUtils";

// Page loading animate.
import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";

// Pop-up title and message.
import { alertTitle, alertMessage } from "../../applicationConstants";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

export default class RebootButtonComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "Reboot";

        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Device system reboot DOM.
        this.deviceRebootButtonDOM = document.querySelector("#reboot-button");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        // Reboot button event listener.
        const fn = () => { this.doOperation(); };
        this.deviceRebootButtonDOM.removeEventListener("click", fn);
        this.deviceRebootButtonDOM.addEventListener("click", fn, false);
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        const result = await alertUtils.questionAlert(this.operationName);

        // Click the OK button.
        if (result.isConfirmed === true) {
            // Reserve, if you need the password validator, you implement this function by yourself.
            // alertObj.fire(`Entered password: ${result.value}`);

            // Device power switch alert.
            const gpioOutputAlert = await alertUtils.gpioOutputAlert(this.operationName);

            // Click the OK button.
            if (gpioOutputAlert.isConfirmed === true) {

                // Show page loading animate.
                pageLoadingAnimate({ type: "loading" });

                // Send the API request.
                // Params is: selectedDeviceSerialNumber,"reboot",{ object });
                const response = await this.apiHandler.sendGPIOOutputAPI(getSelectedDeviceSerialNumber(), "reboot", gpioOutputAlert.value);

                // If operation was success.
                if (response === "successfully") {
                    alertUtils.mixinAlert("success", `${this.operationName} ${alertMessage.success}`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }
                // Otherwise.
                else {
                    alertUtils.mixinAlert("error", `Failed to do ${this.operationName} , please try again later!`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }
                // Stop page loading animate.
                pageLoadingAnimate({ type: "stop" });
            }

            // Click the cancel button.
            if (gpioOutputAlert.isDismissed === true) {
                alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
            }
        }

        // Click the cancel button.
        if (result.isDismissed === true) {
            alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
        }
    }
}