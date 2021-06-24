// Config
import { deviceConfig, checkOnlineStatusFreq } from "../config/deviceConfig";
import { serviceAddress } from "../config/commonConfig";

// Libraries
import { apiHandler } from "../library/APILibrary";


// Import necessary components.
import PageFooterComponent from "../components/pages/pageFooter.component";
import DeviceOnlineStatusComponent from "../components/device/onlineStatus.component";
import DeviceIndexGroupButtonComponent from "../components/pages/deviceIndexGroupButton.component";
import SystemRebootButtonComponent from "../components/device/systemRebootButton.component";
import PowerButtonComponent from "../components/device/powerButton.component";
import GpioButtonComponent from "../components/device/gpioButton.component";
import UartPassThruButtonComponent from "../components/device/uartPassThruButton.component";
import BoardConfigButtonComponent from "../components/device/boardConfigButton.component";
import DeviceTabsComponent from "../components/device/deviceTabs.component";


export class Main {
    constructor() {

        // API library initial.
        this.serviceAddress = serviceAddress;
        this.apiHandler = apiHandler;
        this.apiHandler.setServerAddress(serviceAddress);
        this.pageSerialNumber = document.querySelector("#serial-number");


        // Page components.

        // Page footer component.
        this.pageFooterComponent = new PageFooterComponent();

        // Device index button.
        this.deviceIndexGroupButtonComponent = new DeviceIndexGroupButtonComponent();

        // Start up task.
        this.startUpTask();


        // Device online status component.
        this.deviceOnlineStatusComponent = new DeviceOnlineStatusComponent();

        // System reboot button component.
        this.systemRebootButtonComponent = new SystemRebootButtonComponent();

        // Power button component.
        this.powerButtonComponent = new PowerButtonComponent();

        // GPIO button component.
        this.gpioButtonComponent = new GpioButtonComponent();

        // UART pass thru button component.
        this.uartPassThruButtonComponent = new UartPassThruButtonComponent();

        // Board config button component.
        this.boardConfigButtonComponent = new BoardConfigButtonComponent();

        // Device tabs component.
        this.deviceTabsComponent = new DeviceTabsComponent();

    }

    startUpTask() {
        // Set web footer text.
        this.pageFooterComponent.setCopyrightText("");

        // Get web service version.
        this.pageFooterComponent.getWebServiceVersion();

        // Generate the device index button from the config file.
        this.deviceIndexGroupButtonComponent.fetchDeviceDataFromConfigFile(deviceConfig);

    }
}

export function initial() {
    new Main();
}

