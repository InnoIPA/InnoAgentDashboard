// Config
import { deviceConfig } from "../config/deviceConfig";
import { SERVER_ADDRESS } from "../config/commonConfig";

// Libraries
import { apiHandler } from "../library/APILibrary";



// Import necessary components.
import PageFooterComponent from "../components/pages/pageFooter.component";
import DeviceIndexGroupButtonComponent from "../components/pages/deviceIndexGroupButton.component";
import RebootButtonComponent from "../components/device/rebootButton.component";
import PowerButtonComponent from "../components/device/powerButton.component";
import BoardRestartComponent from "../components/device/boardRestartButton.component";
import GpioButtonComponent from "../components/device/gpioButton.component";
import UartPassThruButtonComponent from "../components/device/uartPassThruButton.component";
import BoardConfigButtonComponent from "../components/device/boardConfigButton.component";
import DeviceTabsComponent from "../components/device/deviceTabs.component";
import UploadFWButtonComponent from "../components/device/uploadFWButton.component";
import UpdateFWButtonComponent from "../components/device/uploadFWButton.component";
import DeleteFWButtonComponent from "../components/device/deleteFWButton.component";


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

        // System reboot button component.
        this.rebootButtonComponent = new RebootButtonComponent();

        // Power button component.
        this.powerButtonComponent = new PowerButtonComponent();

        // GPIO button component.
        this.gpioButtonComponent = new GpioButtonComponent();

        // Board restart button component.
        this.boardRestartComponent = new BoardRestartComponent();

        // UART pass thru button component.
        this.uartPassThruButtonComponent = new UartPassThruButtonComponent();

        // Board config button component.
        this.boardConfigButtonComponent = new BoardConfigButtonComponent();

        // Device tabs component.
        this.deviceTabsComponent = new DeviceTabsComponent();

        // Upload FW image button component.
        this.uploadFWButtonComponent = new UploadFWButtonComponent();

        // Update FW image button component.
        this.updateFWButtonComponent = new UpdateFWButtonComponent();

        // Delete FW image button component.
        this.deleteFWButtonComponent = new DeleteFWButtonComponent();


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

