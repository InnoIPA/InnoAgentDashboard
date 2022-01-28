import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "material-icons/iconfont/material-icons.css";

import "jquery";
import "bootstrap";
import "moment/moment";

// Main stylesheet.
import "./style/css/style.css";
import "./style/css/style2.css";

// Stylesheet for device config page.
import "./style/css/device-config-style.css";

// Remote log stylesheet.
import "./style/css/realTimeLog.css";

// Stylesheet for custom toggle button.
import "./style/css/customToggle.css";

// Page layout.
import header from "./html/pages/header.html";
import deviceInfoTabs from "./html/pages/deviceInfoTabs.html";
import dashboardSetting from "./html/pages/dashboardSetting.html";

// Shard variable.
import { getDashboardConfiguration } from "./js/sharedVariable";

// API library.
import { apiHandler } from "./js/library/APILibrary";

// Websocket.
import { WS_PATH } from "./js/applicationConstants";
import WebSocketHandler from "./js/library/webSocketHandler";

// Page components.
import { sidebarInit } from "./js/components/pages/sidebar.component";
import { dashboardSettingInitial } from "./js/components/pages/dashboardSetting.component";
import DeviceIndexGroupButtonComponent from "./js/components/pages/deviceIndexGroupButton.component";
import RebootButtonComponent from "./js/components/device/rebootButton.component";
import PowerButtonComponent from "./js/components/device/powerButton.component";
import BoardRestartComponent from "./js/components/device/boardRestartButton.component";
import GpioButtonComponent from "./js/components/device/gpioButton.component";
import DeviceTabsComponent from "./js/components/device/deviceTabs.component";
import RemoteLogComponent from "./js/components/device/remoteLog.component";
import UploadFWButtonComponent from "./js/components/device/uploadFWButton.component";
import UpdateFWButtonComponent from "./js/components/device/updateFWButton.component";
import DeleteFWButtonComponent from "./js/components/device/deleteFWButton.component";
import PageFooterComponent from "./js/components/pages/pageFooter.component";

// Dynamic added device components.
import AddDeviceConfigButtonComponent from "./js/components/deviceConfigComponents/addDeviceConfigButton.component";
import UpdateDeviceConfigButtonComponent from "./js/components/deviceConfigComponents/updateDeviceConfigButton.component";
import DeleteDeviceConfigButtonComponent from "./js/components/deviceConfigComponents/deleteDeviceConfigButton.component";

// Export device index group button component instance.
export let deviceIndexGroupButtonComponentInstance = undefined;

// Export remote log component instance.
export let remoteLogComponentInstance = undefined;

// Export device tabs component instance.
export let deviceTabComponentInstance = undefined;

// On page loaded.
document.addEventListener("DOMContentLoaded", async () => {
    await reloadAll();
});

// Initial
const initial = async () => {

    // API target address.
    apiHandler.setServerAddress(getDashboardConfiguration("serverAddress"));

    // Footer
    const pageFooterComponent = new PageFooterComponent();
    pageFooterComponent.getWebServiceVersion();
    pageFooterComponent.setCopyrightText(getDashboardConfiguration("dashboardCopyrightText"));

    // Copyright text.
    document.title = getDashboardConfiguration("dashboardWebTitle");

};

// Initial device page.
const initialDevicePage = async () => {

    document.getElementById("header").innerHTML = header;
    document.querySelector("#device-info-tabs-section").innerHTML = deviceInfoTabs;

    // Real-time log component.
    remoteLogComponentInstance = new RemoteLogComponent();
    remoteLogComponentInstance.initialEventListener();

    // Device tabs component.
    deviceTabComponentInstance = new DeviceTabsComponent();

    // Device index button.
    deviceIndexGroupButtonComponentInstance = new DeviceIndexGroupButtonComponent({ mode: "initial" });
    await deviceIndexGroupButtonComponentInstance.fetchDeviceDataFromServer();


    // System reboot button component.
    new RebootButtonComponent();

    // Power button component.
    new PowerButtonComponent();

    // GPIO button component.
    new GpioButtonComponent();

    // Board restart button component.
    new BoardRestartComponent();

    // Upload FW image button component.
    new UploadFWButtonComponent();

    // Update FW image button component.
    new UpdateFWButtonComponent();

    // Delete FW image button component.
    new DeleteFWButtonComponent();


    // Device config component.
    new AddDeviceConfigButtonComponent();
    new UpdateDeviceConfigButtonComponent();
    new DeleteDeviceConfigButtonComponent();

    // Web socket.
    const websocketHandler = new WebSocketHandler(getDashboardConfiguration("serverAddress"), WS_PATH);
    websocketHandler.setRemoteDataInstance(remoteLogComponentInstance);
};

// Initail dashboard config page.
const initialDashboardConfigPage = async () => {
    // Setting tab content.
    document.querySelector("#dashboardSettingContainer").innerHTML = dashboardSetting;
    await dashboardSettingInitial();
};

// Reload all.
export const reloadAll = async () => {
    document.querySelector("#header").innerHTML = "";
    document.querySelector("#device-info-tabs-section").innerHTML = "";
    document.querySelector("#dashboardSettingContainer").innerHTML = "";
    
    // Initial the sidebar.
    sidebarInit();
    await initial();
    await initialDevicePage();
    await initialDashboardConfigPage();

};



