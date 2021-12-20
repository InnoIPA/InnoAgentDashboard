// Config
import { deviceConfig } from "../config/deviceConfig";
import { SERVER_ADDRESS } from "../config/commonConfig";

// Libraries
import { apiHandler } from "../library/APILibrary";



// Import necessary components.
import PageFooterComponent from "../components/pages/pageFooter.component";
import DeviceOnlineStatusComponent from "../components/device/onlineStatus.component";
import DeviceIndexGroupButtonComponent from "../components/pages/deviceIndexGroupButton.component";
import RebootButtonComponent from "../components/device/rebootButton.component";
import PowerButtonComponent from "../components/device/powerButton.component";
import BoardRestartComponent from "../components/device/boardRestartButton.component";
import GpioButtonComponent from "../components/device/gpioButton.component";
import UartPassThruButtonComponent from "../components/device/uartPassThruButton.component";
import BoardConfigButtonComponent from "../components/device/boardConfigButton.component";
import DeviceTabsComponent from "../components/device/deviceTabs.component";


export class Main {
    constructor() {

        // API library initial.
        this.serviceAddress = SERVER_ADDRESS;
        this.apiHandler = apiHandler;
        this.apiHandler.setServerAddress(SERVER_ADDRESS);
        this.pageSerialNumber = document.querySelector("#serial-number");


        // Page components.

        // Page footer component.
        this.pageFooterComponent = new PageFooterComponent();

        // Device index button.
        this.deviceIndexGroupButtonComponent = new DeviceIndexGroupButtonComponent();

        // Start up task.
        this.startUpTask();
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

