/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Gpio button component.
 * This component is a device system gpio button component that controls device system gpio function.
 * 
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

export default class GpioButtonComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "gpio operation";

        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Device gpio button DOM.
        this.deviceGpioButtonDOM = document.querySelector("#gpio-button");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        // Gpio button event listener.
        const fn = () => { this.doOperation(); };
        this.deviceGpioButtonDOM.removeEventListener("click", fn);
        this.deviceGpioButtonDOM.addEventListener("click", fn, false);
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

            // Device gpio button alert.
            const gpioButtonAlert = await alertUtils.gpioButtonAlert();

            // Click the OK button.
            if (gpioButtonAlert.isConfirmed === true) {

                // Show page loading animate.
                pageLoadingAnimate({ type: "loading" });

                // Send the API request.
                // Params is: selectedDeviceSerialNumber, { object });
                console.log(gpioButtonAlert.value);
                const response = await this.apiHandler.devicePowerSwitchAPI(getSelectedDeviceSerialNumber(), gpioButtonAlert.value);

                // If operation was success.
                if (+response === 1) {
                    alertUtils.mixinAlert("success", this.operationName + alertMessage.success, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }
                // Otherwise.
                else {
                    alertUtils.mixinAlert("error", `Failed to do ${this.operationName} , please try again later!`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }

                // Stop page loading animate.
                pageLoadingAnimate({ type: "stop" });
            }

            // Click the cancel button.
            if (gpioButtonAlert.isDismissed === true) {
                alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
            }
        }

        // Click the cancel button.
        if (result.isDismissed === true) {
            alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
        }
    }

}