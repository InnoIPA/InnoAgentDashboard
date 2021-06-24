/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device information tab item component.
 * This component is device information tab that controls device information tab display.
 * 
 * 
 */

import { insertDataIntoSpecificDOMElement } from "../../library/utils/DOMElementUtils";

export default class DeviceInfoTabItemComponent {

    constructor() {
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Select all <td> DOM elements with class "value".
        this.deviceInfoTabItemsDOM = document.querySelectorAll("#nav-device table td.value");
    }

    insertDataIntoDOMElement(data) {
        try {
            // Check the input data is valid.
            if (data === null || data === undefined || typeof (data) !== "object") {
                throw new Error("Input data is not valid object!");
            }

            // Insert data to the specific DOM. 
            insertDataIntoSpecificDOMElement({ data, DOMElement: this.deviceInfoTabItemsDOM });
        }
        catch (error) {
            console.log(`Error catch at DeviceInfoTabItemComponent ${this.insertDataIntoDOMElement.name}`, error);
        }
    }

}
