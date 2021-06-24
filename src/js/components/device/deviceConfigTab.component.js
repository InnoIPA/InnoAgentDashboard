/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device config tab item component.
 * This component is device config tab that controls device config tab display.
 * 
 * 
 */

import { insertDataIntoSpecificDOMElement,setSelectedDOMElementDisplayStatus } from "../../library/utils/DOMElementUtils";

export default class DeviceConfigTabItemComponent {

    constructor() {
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Select all <td> DOM elements with class "value".
        this.deviceConfigTabItemsDOM = document.querySelectorAll("#nav-board-config table td.value");

        // Select all <tr> DOM elements with class name "staticMode".
        this.staticModeDOM = document.querySelectorAll("#nav-board-config table tr.staticMode");
    }

    checkNetworkType(data) {
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

    insertDataIntoDOMElement(data) {
        try {
            // Check the input data is valid.
            if (data === null || data === undefined || typeof (data) !== "object") {
                throw new Error("Input data is not valid object!");
            }

            this.checkNetworkType(data);

            // Insert data to the specific DOM. 
            insertDataIntoSpecificDOMElement({ data, DOMElement: this.deviceConfigTabItemsDOM });
        }
        catch (error) {
            console.log(`Error catch at DeviceConfigTabItemComponent ${this.insertDataIntoDOMElement.name}`, error);
        }
    }

}
