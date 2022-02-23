/**
 * Device name component.
 * This component is an device name component that controls device name display.
 * 
 * 
 */

// Libraries.
import { setSelectedDOMElementDisplayStatus } from "../../library/utils/DOMElementUtils";

export default class DeviceNameComponent {

    constructor() {
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Device name DOM element.
        this.deviceNameDOM = document.querySelector("#PCName");
    }

    /**
     * Set the device name.
     * @param  {string} data The string to be set as device name text.
     * 
     */
    setDeviceName(data) {
        if (data && typeof (data) === "string") {
            this.deviceNameDOM.innerHTML = data;
        }
    }

    /**
     * 
     * Clear the device name to null.
     */
    clearDeviceName() {
        this.deviceNameDOM.innerHTML = null;
    }

    /**
     * 
     * Show the device name DOM element.
     */
    showDeviceNameDOMElement() {
        setSelectedDOMElementDisplayStatus({ DOMElement: this.deviceNameDOM, display: true });
    }

    /**
     * 
     * Hidden the device DOM element.
     */
    hiddenDeviceNameDOMElement() {
        setSelectedDOMElementDisplayStatus({ DOMElement: this.deviceNameDOM, display: false });
    }

}