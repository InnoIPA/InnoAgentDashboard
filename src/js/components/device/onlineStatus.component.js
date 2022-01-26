/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device online status component.
 * This component is a device system online status component that handlers device online status function.
 * 
 * 
 */

// API library.
import { apiHandler } from "../../library/APILibrary";

// LED indicator component.
import LEDIndicatorHandler from "../pages/ledIndicator.component";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

// Check device online status interval timer.
let checkDeviceStatusTimer = undefined;
export default class DeviceOnlineStatusComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        this.ledIndicatorHandler = new LEDIndicatorHandler();

        // Initial requirement DOMs.
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Online status.
        this.onlineStatusLedIndicator = document.querySelector("#deviceOnlineStatus");
        this.onlineStatusIndicatorTextLabel = document.querySelector("#deviceOnlineLabel");

        // Host agent status.
        this.hostLedIndicator = document.querySelector("#hostStatus");
        this.hostIndicatorTextLabel = document.querySelector("#hostStatusLabel");
    }


    /**
     * Get the selected device online status. 
     */
    async getDeviceOnlineStatus() {
        const { innoAgent, host } = await this.apiHandler.onlineStatusAPI(getSelectedDeviceSerialNumber());

        // If device status is online.
        (+innoAgent === 1)
            ? this.ledIndicatorHandler.setLedGreen(this.onlineStatusLedIndicator, this.onlineStatusIndicatorTextLabel)
            : this.ledIndicatorHandler.setLedRed(this.onlineStatusLedIndicator, this.onlineStatusIndicatorTextLabel);


        // If host status is online.
        (+host === 1)
            ? this.ledIndicatorHandler.setLedGreen(this.hostLedIndicator, this.hostIndicatorTextLabel)
            : this.ledIndicatorHandler.setLedRed(this.hostLedIndicator, this.hostIndicatorTextLabel);
    }

    /**
     * 
     * Start device online status interval check timer.
     * @param {number} time The time of the interval timer.
     */
    startDeviceOnlineStatusInterval(time = 6 * 1000) {

        // Check if interval check device status timer is existing.
        if (!checkDeviceStatusTimer) {
            // Create new timer.
            const checkSphereStatusFunction = () => {
                this.getDeviceOnlineStatus();
            };
            checkDeviceStatusTimer = setInterval(checkSphereStatusFunction, time);
        }
    }

    /**
     * Stop the device online status interval check timer.
     */
    stopDeviceOnlineStatusInterval() {
        // Clear the timer.
        clearInterval(checkDeviceStatusTimer);

        // Reset the timer to default value.
        checkDeviceStatusTimer = undefined;
    }
}