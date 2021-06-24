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
import LEDIndicatorComponent from "../pages/ledIndicator.component";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

export default class DeviceOnlineStatusComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // Initial related components.
        this.initialRelatedComponents();

        // Check device online status interval timer.
        this.checkDeviceOnlineStatusTimer = null;

    }

    /**
     * 
     * Initial related components.
     */
    initialRelatedComponents() {
        // Initial the LED indicator components.
        this.ledIndicatorComponent = new LEDIndicatorComponent();
    }

    /**
     * Get the selected device online status. 
     */
    async getDeviceOnlineStatus() {
        const response = await this.apiHandler.onlineStatusAPI(getSelectedDeviceSerialNumber());

        // If device status is online.
        if (+response === 1) {
            this.ledIndicatorComponent.setLedGreen();
        }

        // Otherwise.
        else {
            this.ledIndicatorComponent.setLedRed();
        }
    }

    /**
     * 
     * Start device online status interval check timer.
     * @param {number} time The time of the interval timer.
     */
    startDeviceOnlineStatusInterval(time = 6 * 1000) {
        // Clear the existing timer.
        this.stopDeviceOnlineStatusInterval();

        // Create new timer.
        const checkSphereStatusFunction = () => {
            this.getDeviceOnlineStatus();
        };
        this.checkDeviceOnlineStatusTimer = setInterval(checkSphereStatusFunction, time);
    }

    /**
     * Stop the device online status interval check timer.
     */
    stopDeviceOnlineStatusInterval() {
        // Clear the timer.
        clearInterval(this.checkDeviceOnlineStatusTimer);

        // Reset the timer to default value.
        this.checkDeviceOnlineStatusTimer = null;
    }
}