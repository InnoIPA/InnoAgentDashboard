import { apiHandler } from "../../library/APILibrary";

// Shared variable
import { setSelectedDeviceSerialNumber, setDeviceGroupSelectedIndex, getDeviceGroupSelectedIndex, getSelectedDeviceSerialNumber, setDashboardServiceStatus, getDashboardConfiguration } from "../../sharedVariable";

// Libraries.
import { FunctionTestHandler } from "../../library/functionTestHandler";
import { getElementFromDeviceConfig } from "../../library/getElementsFromDeviceConfig";
import { ButtonHandler } from "../../library/buttonHandler";

// Page loading animate.
import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";

// Components
import DeviceNameComponent from "./deviceName.component";
import DeviceOnlineStatusComponent from "../device/onlineStatus.component";
import { deviceTabComponentInstance } from "../../../index";

let checkDeviceConfigTimer = undefined;
export default class DeviceIndexGroupButtonComponent {

    constructor({ mode }) {
        // Initial mode.
        this.initialMode = mode;

        // Initial libraries.
        this.initialLibraries();

        // Initial DOM elements.
        this.getRequireDOMElements();

        // Initial related components.
        this.initialRelatedComponents();

        this.deviceConfig = undefined;

        // Selected device index.
        this.devIndex = (+getDeviceGroupSelectedIndex()) || 0;

        // Check device status interval.
        this.checkStatusInterval = +(getDashboardConfiguration("checkStatusInterval")) || 5000;
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

        // Device header.
        this.deviceHeaderDOM = document.querySelector("#header");

        // Device tabs.
        this.deviceTabsDOM = document.querySelector("#device-info-tabs-section");

        // Add device button.
        this.addDeviceButtonDOM = document.querySelector("#addDeviceBtn");

        // No device container.
        this.noDeviceContainerDOM = document.querySelector("#noDeviceContainer");

        // Connection error container.
        this.connectionErrorContainerDOM = document.querySelector("#connectionErrorContainer");

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
        return (+getDeviceGroupSelectedIndex());
    }

    /**
     * Set selected device index.
     * @param {number} value Device index.
     */
    setSelectedDeviceIndex(value) {
        setDeviceGroupSelectedIndex(value);
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
        this.deviceIndexGroupButtonDOM.innerHTML = "";

        for (let i = 1; i <= data.length; i++) {
            // Generate the device index button and add into deviceIndexGroupButtonDOM.
            this.deviceIndexGroupButtonDOM.appendChild(this.generateDeviceIndexButtonElement(i));
        }

        // Prevent page crash.
        if (!this.devIndexGroupLists[this.getSelectedDeviceIndex()]){
            this.setSelectedDeviceIndex(0);
        }

        // Set current selected tab style.
        this.devIndexGroupLists[this.getSelectedDeviceIndex()].classList.add("hover");

        

        // If device index button is greater than 0.
        this.addDeviceButtonDOM.classList.remove("d-none");

        // Check if the first time initial.
        if (this.initialMode === "initial") {
            // Set default click.
            this.deviceButtonClickFunction(this.getSelectedDeviceIndex());
        }
        this.initialMode = undefined;

        // Set device name.
        const deviceName = `${getElementFromDeviceConfig(this.deviceConfig, this.getSelectedDeviceIndex(), "name")} (${getSelectedDeviceSerialNumber()})`;
        this.deviceNameComponent.setDeviceName(deviceName);

        // Get device enable or disable function.
        this.buttonHandler.getDeviceFunctionStatus(getElementFromDeviceConfig(this.deviceConfig, this.getSelectedDeviceIndex()));

        // Set tab component editable button status.
        deviceTabComponentInstance.setEditButtonStatus(getElementFromDeviceConfig(this.deviceConfig, this.getSelectedDeviceIndex(), "setConfigOperation"));

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
    async deviceButtonClickFunction(idx) {

        // Set button hover effect.
        this.deviceIndexGroupButtonAddHoverEffect(idx);

        // Set selected device index.
        this.setSelectedDeviceIndex(idx);

        // Set selected device serial number.
        setSelectedDeviceSerialNumber(getElementFromDeviceConfig(this.deviceConfig, idx, "deviceUid"));
        console.log(`Tab: ${+idx + 1}, DeviceId is: ${getElementFromDeviceConfig(this.deviceConfig, idx, "deviceUid")}`);

        // Show loading animation.
        pageLoadingAnimate({ type: "loading" });

        // Stop the existing function test instance.
        if (this.functionTest.isStart === true) {
            this.functionTest.stop();
            this.functionTest.download();
        }

        // Get device online status.
        this.deviceOnlineStatusComponent.getDeviceOnlineStatus();
        this.deviceOnlineStatusComponent.stopDeviceOnlineStatusInterval();

        // Check device status interval.
        this.deviceOnlineStatusComponent.startDeviceOnlineStatusInterval((+this.checkStatusInterval));

        // Set device name.
        const deviceName = `${getElementFromDeviceConfig(this.deviceConfig, idx, "name")} (${getSelectedDeviceSerialNumber()})`;
        this.deviceNameComponent.setDeviceName(deviceName);

        // Get device enable or disable function.
        this.buttonHandler.getDeviceFunctionStatus(getElementFromDeviceConfig(this.deviceConfig, this.getSelectedDeviceIndex()));


        // Set tab component default status.
        deviceTabComponentInstance.setDefaultStatus();

        // Set tab component editable button status.
        deviceTabComponentInstance.setEditButtonStatus(getElementFromDeviceConfig(this.deviceConfig, idx, "setConfigOperation"));

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
     * Show connection error status.
     */
    showConnectionErrorStatus() {
        // Show connection error container.
        this.connectionErrorContainerDOM.classList.remove("d-none");

        this.noDeviceContainerDOM.classList.add("d-none");
        this.deviceHeaderDOM.classList.add("d-none");
        this.deviceTabsDOM.classList.add("d-none");
    }

    /**
     * Show no device status.
     */
    showNoDeviceStatus() {
        // Show no device container.
        this.noDeviceContainerDOM.classList.remove("d-none");

        // Hide all other DOM elements.
        this.connectionErrorContainerDOM.classList.add("d-none");
        this.deviceHeaderDOM.classList.add("d-none");
        this.deviceTabsDOM.classList.add("d-none");
    }

    /**
     * Show regular device page status.
     */
    showRegularDeviceStatus() {
        // Show all other DOM elements.
        this.connectionErrorContainerDOM.classList.remove("d-none");
        this.deviceHeaderDOM.classList.remove("d-none");
        this.deviceTabsDOM.classList.remove("d-none");

        // Show connection error container.
        this.connectionErrorContainerDOM.classList.add("d-none");

        // Show no device container.
        this.noDeviceContainerDOM.classList.add("d-none");
    }

    setIntervalCheckDeviceConfigTimer(timer) {
        clearInterval(checkDeviceConfigTimer);
        checkDeviceConfigTimer = undefined;
        checkDeviceConfigTimer = setInterval(this.fetchDeviceDataFromServer.bind(this), Math.floor(timer * 2.5));
    }

    /**
     * Fetch device config data from server.
     * @returns 
     */
    async fetchDeviceDataFromServer() {

        // Check if interval check device config timer is existing.
        if (!checkDeviceConfigTimer) {
            this.setIntervalCheckDeviceConfigTimer(this.checkStatusInterval);
        }

        try {
            const response = await apiHandler.getDeviceConfigAPI();

            // Connection error.
            if (!response) {
                setDashboardServiceStatus(-1);
                this.showConnectionErrorStatus();
                return;

            }

            // No device.
            if (Array.isArray(response) && response.length <= 0) {
                setDashboardServiceStatus(0);
                this.showNoDeviceStatus();
                return;
            }

            // Generate the device index group button.
            this.deviceConfig = response;
            this.generateDevIndexGroupButton(response);
            setDashboardServiceStatus(1);
            this.showRegularDeviceStatus();
        }
        catch (error) {
            console.error(error);
            setDashboardServiceStatus(-1);
            this.showConnectionErrorStatus();
        }
    }

}