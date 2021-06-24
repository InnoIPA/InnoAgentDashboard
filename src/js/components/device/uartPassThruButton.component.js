/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * UART pass thru button component
 * This component is a device UART pass thru button component that controls device UART pass thru function.
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

export default class UartPassThruButtonComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "UART PassThru";

        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // UART pass thru button DOM.
        this.deviceGpioButtonDOM = document.querySelector("#tty-button");
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
            const uartPassThruButtonAlert = await alertUtils.uartPassThruButtonAlert();

            // Click the OK button.
            if (uartPassThruButtonAlert.isConfirmed === true) {

                // Show page loading animate.
                pageLoadingAnimate({ type: "loading" });

                // Send the API request.
                // Params is: selectedDeviceSerialNumber, { object });
                const response = await this.apiHandler.deviceSerialPortAPI(getSelectedDeviceSerialNumber(), uartPassThruButtonAlert.value);

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
            if (uartPassThruButtonAlert.isDismissed === true) {
                alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
            }
        }

        // Click the cancel button.
        if (result.isDismissed === true) {
            alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
        }
    }

    // Get available serial port API for alert pop-up.
    async getAvailableSerialPort() {
        const response = await this.apiHandler.deviceEnableSerialPortsAPI(getSelectedDeviceSerialNumber());
        this.addGpioPinsSelectOption(response);
    }

    // Add serial port data.
    addGpioPinsSelectOption(data) {
        // Serial port selector DOM.
        this.gpioPinSelectorDOM = document.querySelector("#tty-port-number");

        // Add the option items.
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const option = document.createElement("option");
                option.text = data[i];
                option.value = data[i];
                this.gpioPinSelectorDOM.add(option);
            }
        }

        // If the data is null.
        else {
            const option = document.createElement("option");
            option.text = "--- No available serial port ! ---";
            option.value = -1;
            this.gpioPinSelectorDOM.add(option);
        }
    }
}