// API library.
import { apiHandler } from "./APILibrary";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../sharedVariable";

export default class GpioPinsHandler {

    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        // GPIO pin selector DOM.
        this.gpioPinSelectorDOM = undefined;
    }

    async getAvailableGPIOPins(mode = "ALL") {
        const response = await this.apiHandler.getAvailableGpioPinsAPI(getSelectedDeviceSerialNumber(), mode);
        this.addGpioPinsSelectOption(response);
    }

    // Add GPIO pin data.
    addGpioPinsSelectOption(data) {
        // GPIO pin selector DOM.
        this.gpioPinSelectorDOM = document.querySelector("#pin-name");

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
            option.text = "--- No available GPIO pins ! ---";
            option.selected;
            option.value = -1;
            this.gpioPinSelectorDOM.add(option);
        }
    }
}
