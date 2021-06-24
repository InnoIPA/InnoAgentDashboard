/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device networking information tab item component.
 * This component is device networking information tab that controls device networking information display.
 * 
 * 
 */

import { insertDataIntoSpecificDOMElement } from "../../library/utils/DOMElementUtils";

export default class DeviceNetworkingComponent {

    constructor() {
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Select all <td> DOM elements with class "value".
        this.deviceNetworkingTabItemsDOM = document.querySelectorAll("#nav-networking table td.value");
    }

    insertDataIntoDOMElement(data) {
        try {
            // Check the input data is valid.
            if (data === null || data === undefined || typeof (data) !== "object") {
                throw new Error("Input data is not valid object!");
            }

            // Insert data to the specific DOM. 
            insertDataIntoSpecificDOMElement({ data, DOMElement: this.deviceNetworkingTabItemsDOM });
        }
        catch (error) {
            console.log(`Error catch at DeviceNetworkingComponent ${this.insertDataIntoDOMElement.name}`, error);
        }
    }

}
