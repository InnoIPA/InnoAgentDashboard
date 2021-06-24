import { deepCopy } from "./utils/deepCopy";

export let ButtonHandler = class ButtonHandler {

    constructor() {

        // Select the document.
        this.doc = document;
        this.deviceOperationButtonMap = new Map();

        // OS Heartbeat
        this.osHeartbeatLed = this.doc.querySelector("#osHeartbeatLed");
        this.osStatusText = this.doc.querySelector("#osStatusText");

        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Get all device operation buttons.
        this.remoteBtnGroup = document.querySelectorAll("#remoteBtnGroup button");

        // Put all device operation buttons into the device operation button map.
        for (const element of this.remoteBtnGroup) {
            this.deviceOperationButtonMap.set(element.id, element);
        }
    }

    getDeviceFunctionStatus(deviceItems) {
        // Deep copy the input data.
        const deviceItemsCopy = deepCopy(deviceItems);

        // Remove unnecessary items.
        const ignoreList = ["id", "serialNumber", "name", "createdAt", "updateAt"];
        ignoreList.map((value) => {
            if (deviceItemsCopy[value] !== "undefined") {
                delete deviceItemsCopy[value];
            }

        });

        // Set all device operation buttons visible status.
        for (const item in deviceItemsCopy) {
            this.setDeviceOperationButtonVisibleStatus(item, deviceItemsCopy[item]);
        }

    }

    // Display button.
    setDeviceOperationButtonVisibleStatus(item, value) {

        if (value === true) {
            this.deviceOperationButtonMap.get(item).classList.remove("d-none");
            return;
        }
        this.deviceOperationButtonMap.get(item).classList.remove("d-none");
        this.deviceOperationButtonMap.get(item).classList.add("d-none");
    }

};