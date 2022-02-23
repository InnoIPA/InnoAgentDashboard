/**
 * Device board config component.
 * This component is a device board config button component that controls device board config function.
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

// DOM utils.
import { setSelectedDOMElementDisplayStatus } from "../../library/utils/DOMElementUtils";

// Form utils.
import { formToJSON, JSONToForm } from "../../library/utils/formUtils";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

export default class BoardConfigButtonComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "modify board config";

        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Board config button DOM.
        this.boardConfigButtonDOM = document.querySelector("#board-config");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        // Board config button event listener.
        const fn = () => { this.doOperation(); };
        this.boardConfigButtonDOM.removeEventListener("click", fn);
        this.boardConfigButtonDOM.addEventListener("click", fn, false);
    }

    /**
     * 
     * Event listener operation.
     * 
     */
    async doOperation() {
        const result = await alertUtils.questionAlert(this.operationName);

        // Click the OK button.
        if (result.isConfirmed === true) {
            // Reserve, if you need the password validator, you implement this function by yourself.
            // alertObj.fire(`Entered password: ${result.value}`);

            // Board config button alert.
            const boardConfigAlert = await alertUtils.setBoardConfigAlert();

            // Click the OK button.
            if (boardConfigAlert.isConfirmed === true) {

                // Show page loading animate.
                pageLoadingAnimate({ type: "loading" });

                // Send the API request.
                // Params is: selectedDeviceSerialNumber, { object });
                console.log(boardConfigAlert.value);
                const response = await this.apiHandler.setOOBDeviceConfigAPI(getSelectedDeviceSerialNumber(), boardConfigAlert.value);

                // If operation was success.
                if (response) {
                    alertUtils.mixinAlert("success", "Update device config successfully!", { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }

                // Otherwise.
                else {
                    alertUtils.mixinAlert("error", "Failed to update board config, please try again later!", { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
                }
                // Stop page loading animate.
                pageLoadingAnimate({ type: "stop" });
            }

            // Click the cancel button.
            if (boardConfigAlert.isDismissed === true) {
                alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
            }
        }

        // Click the cancel button.
        if (result.isDismissed === true) {
            alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
        }
    }

    /**
     * Check the network type 
     * @param {object} data The board config object.
     * @returns null.
     */
    checkNetworkType(data) {

        if (!data) {
            return;
        }


        // DHCP mode.
        if (+data["NETWORK_TYPE"] === 0) {

            // Change the NETWORK_TYPE key display to true.
            data["NETWORK_TYPE"] = true;

            // Set the DOM display status.
            setSelectedDOMElementDisplayStatus({ DOMElement: this.staticModeDOM, display: false });
            return;
        }

        // Static IP
        // Change the NETWORK_TYPE key display to false.
        data["NETWORK_TYPE"] = false;

        // Set the DOM display status.
        setSelectedDOMElementDisplayStatus({ DOMElement: this.staticModeDOM, display: true });
    }

    DHCPModeButtonOnClickEventListener(mode = "remove") {

        const fn = () => {

            // Parse the select status from form data.
            const data = new FormData(this.modifyBoardConfigDOM);
            const value = Object.fromEntries(data.entries());

            // Check the network type and change the DOM display status.
            this.checkNetworkType(value);
        };
        if (mode === "add") {
            this.DHCPModeTogglerDOM.addEventListener("click", fn, false);
            return;
        }
        this.DHCPModeTogglerDOM.removeEventListener("click", fn);
    }


    /**
     * 
     * Alert on open event handler.
     */
    async alertOnOpen() {

        // Entire form data.
        this.modifyBoardConfigDOM = document.querySelector("#modify-board-config");

        // DHCP mode toggler.
        this.DHCPModeTogglerDOM = document.querySelector("#DHCPModeToggler");
        this.DHCPModeButtonOnClickEventListener("add");

        // Static mode DOM elements.
        this.staticModeDOM = document.querySelector("div.staticMode");

        await this.getCurrentBoardConfig();
    }

    /**
     * 
     * Alert onClick the submit button.
     * @returns {object} Form data to board config object.
     */
    alertOnClickSubmitButtonEvent() {
        return formToJSON(this.modifyBoardConfigDOM);
    }



    /**
     * 
     * Get current board config setting.
     */
    async getCurrentBoardConfig() {

        const responseData = await this.apiHandler.getOOBDeviceConfigAPI(getSelectedDeviceSerialNumber());

        // Mock data
        // const responseData = {
        //     "NETWORK_TYPE": "0",
        //     "NETWORK_STATIC_IP": "192.168.3.102",
        //     "NETWORK_STATIC_DEFAULT_GATEWAY": "192.168.3.1",
        //     "NETWORK_STATIC_NETMASK": "255.255.255.0",
        //     "NETWORK_STATIC_METRIC": "0",
        //     "SERVER_USERNAME": "innoage",
        //     "SERVER_PASSWORD": "B673AEBC6D65E7F42CFABFC7E01C02D0",
        //     "SERVER_IP": "172.16.93.106",
        //     "SERVER_PORT": "1883",
        //     "SYSTIME_ZONE": "GMT+8"
        // };

        this.checkNetworkType(responseData);
        // If operation was success.
        if (responseData) {
            // Insert data into form.
            JSONToForm(this.modifyBoardConfigDOM, responseData);
        }
        else {
            console.log(`Error catch at BoardConfigButtonComponent ${this.getCurrentBoardConfig.name}:${responseData}`);
        }
    }
}