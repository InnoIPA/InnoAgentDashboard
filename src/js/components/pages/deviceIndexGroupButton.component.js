/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device index group button component.
 * This component is an device index group button that controls device index group button display.
 * 
 * 
 */

// Config
import { CHECK_ONLINE_STATUS_INTERVAL } from "../../config/commonConfig";

// Application constants.
import { loadingDeviceConfigErrorMessage } from "../../applicationConstants";

// Shared variable
import { setSelectedDeviceSerialNumber, getSelectedDeviceSerialNumber } from "../../sharedVariable";

// Libraries.
import { FunctionTestHandler } from "../../library/functionTestHandler";
import { getElementFromDeviceConfig } from "../../library/getElementsFromDeviceConfig";
import { cookieHandler } from "../../library/cookieHandler";
import { ButtonHandler } from "../../library/buttonHandler";

// Page loading animate.
import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";

// Components
import DeviceNameComponent from "./deviceName.component";
import DeviceOnlineStatusComponent from "../device/onlineStatus.component";



// import 
export default class DeviceIndexGroupButtonComponent {

    constructor() {
        // Initial libraries.
        this.initialLibraries();

        // Initial DOM elements.
        this.getRequireDOMElements();

        // Initial related components.
        this.initialRelatedComponents();

        // Selected device index.
        this.devIndex = cookieHandler.getCookie("sphereIndex") || 0;
    }

    initialLibraries() {
        // Device button library.
        this.buttonHandler = new ButtonHandler();

        // Initial function test library.
        this.functionTest = new FunctionTestHandler();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Device index button group DOM.
        this.deviceIndexGroupButtonDOM = document.querySelector("#devIndexGroup");
        this.devIndexGroupLists = document.querySelectorAll("#devIndexGroup")[0].getElementsByTagName("button");

        //  No device button DOM.
        this.addDeviceButtonDOM = document.querySelector("#addDeviceBtn");
    }

    /**
     * 
     * Initial related components.
     */
    initialRelatedComponents() {
        // Initial the device name components.
        this.deviceNameComponent = new DeviceNameComponent();
        this.deviceOnlineStatusComponent = new DeviceOnlineStatusComponent();
    }

    /**
     * Get the current device index.
     * @returns {number} Device index.
     */
    getSelectedDeviceIndex() {
        return this.devIndex;
    }

    /**
     * Set selected device index.
     * @param {number} value Device index.
     */
    setSelectedDeviceIndex(value) {
        if ((this.getSelectedDeviceIndex() < 0) || (value < 0)) {
            this.devIndex = 0;
            cookieHandler.setCookie("sphereIndex", 0);
        }
        else {
            this.devIndex = (+value);
            cookieHandler.setCookie("sphereIndex", (+value));
        }
    }

    /**
     * 
     * Show connection error message.
     */
    showConnectionErrorMessage() {
        // Hidden the info tab.
        document.querySelector("#device-info-tabs-section").classList.remove("d-block");
        document.querySelector("#device-info-tabs-section").classList.add("d-none");

        // Hidden the device operation section.
        document.querySelector("#deviceConfigDropdown").classList.add("d-none");
        document.querySelector("#addDeviceBtn").classList.add("d-none");
        document.querySelector("#connectErrorAlert").innerHTML = `<i class="fas fa-exclamation pr-2"></i>
<span class="text-danger">${loadingDeviceConfigErrorMessage}</span>`;
        document.querySelector("#connectErrorAlert").classList.remove("d-none");
        document.querySelector("#status-led-row").classList.add("d-none");

        // Hidden the device device name component.
        this.deviceNameComponent.hiddenDeviceNameDOMElement();
    }



    generateDeviceIndexButtonElement(index) {
        const deviceIndexButton = document.createElement("button");
        deviceIndexButton.classList = "btn mr-1";
        deviceIndexButton.setAttribute("id", "devIndexBtn" + [index]);
        deviceIndexButton.innerText = index;
        return deviceIndexButton;
    }

    // Dynamic generates the device button.
    generateDevIndexGroupButton(data) {

        if (!Array.isArray(data) || data.length <= 0) {
            // Set add device button style.
            this.addDeviceButtonDOM.classList.add("no-device");
            return;
        }

        for (let i = 1; i <= data.length; i++) {
            // Generate the device index button and add into deviceIndexGroupButtonDOM.
            this.deviceIndexGroupButtonDOM.appendChild(this.generateDeviceIndexButtonElement(i));
        }
        // First button add class name="hover".
        this.devIndexGroupLists[0].classList.add("hover");


        // If device index button is greater than 0.
        this.addDeviceButtonDOM.classList.remove("no-device");

        // Set default click.
        this.deviceButtonClickFunction(this.getSelectedDeviceIndex());

        // Set click event.
        this.setDevIndexGroupEvent();
        return;
    }

    /**
     * Add "hover" class for device index group button.
     * @param {number} idx clicked button index.
     */
    deviceIndexGroupButtonAddHoverEffect(idx) {
        // Remove all device index button hover class.
        for (let i = 0; i < this.devIndexGroupLists.length; i++) {
            this.devIndexGroupLists[i].classList.remove("hover");
        }
        // Add hover class for clicked button.
        this.devIndexGroupLists[idx].classList.add("hover");
    }

    /**
     * 
     * @param {number} idx The index of user selected.
     */
    deviceButtonClickFunction(idx) {

        // Stop the existing function test instance.
        if (this.functionTest.isStart === true) {
            this.functionTest.stop();
            this.functionTest.download();
        }

        // Show loading animation.
        pageLoadingAnimate({ type: "loading" });

        // Set selected device index.
        this.setSelectedDeviceIndex(idx);

        // Set selected device serial number.
        setSelectedDeviceSerialNumber(getElementFromDeviceConfig(idx, "serialNumber"));

        console.log(`Tab: ${+idx + 1}, DeviceId is: ${getElementFromDeviceConfig(idx, "serialNumber")}`);

        // Get device online status.
        this.deviceOnlineStatusComponent.getDeviceOnlineStatus();
        this.deviceOnlineStatusComponent.stopDeviceOnlineStatusInterval();
        this.deviceOnlineStatusComponent.startDeviceOnlineStatusInterval(CHECK_ONLINE_STATUS_INTERVAL);

        // Set button hover effect.
        this.deviceIndexGroupButtonAddHoverEffect(idx);

        // Set device name.
        const deviceName = `${getElementFromDeviceConfig(idx, "name")} (${getSelectedDeviceSerialNumber()})`;
        this.deviceNameComponent.setDeviceName(deviceName);

        // Get device enable or disable function.
        this.buttonHandler.getDeviceFunctionStatus(getElementFromDeviceConfig(this.getSelectedDeviceIndex()));

        // Hide loading animation.
        pageLoadingAnimate({ type: "stop" });
    }

    /**
     * Set device index button event listener.
     * 
     */
    setDevIndexGroupEvent() {
        const clickFunction = (e) => {

            console.clear();
            this.deviceButtonClickFunction(+e.target.textContent - 1);
        };
        for (let i = 0; i < this.devIndexGroupLists.length; i++) {
            this.devIndexGroupLists[i].removeEventListener("click", clickFunction);
            this.devIndexGroupLists[i].addEventListener("click", clickFunction, false);
        }
    }
    /**
     * 
     * @param {object} deviceConfig The device config object.
     */
    fetchDeviceDataFromConfigFile(deviceConfig) {
        try {
            if ((!Array.isArray(deviceConfig) || (deviceConfig.length < 0))) {
                throw new Error(loadingDeviceConfigErrorMessage);
            }
            
            // Generate the device index group button.
            this.generateDevIndexGroupButton(deviceConfig);
        }
        catch (error) {
            console.log(`Error catch at ${this.fetchDeviceDataFromConfigFile.name}`, error);
            this.showConnectionErrorMessage();
        }
    }

}