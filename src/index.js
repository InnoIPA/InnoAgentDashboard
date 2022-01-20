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

import "./style/css/realTimeLog.css";

// Stylesheet for custom toggle button.
import "./style/css/customToggle.css";

// Page layout.
import header from "./html/pages/header.html";
import deviceInfoTabs from "./html/pages/deviceInfoTabs.html";
import dashboardSetting from "./html/pages/dashboardSetting.html";

import { apiHandler } from "./js/library/APILibrary";

import { sidebarInit } from "./js/components/pages/sidebar.component";
import { dashboardSettingInitial } from "./js/components/pages/dashboardSetting.component";



import { WS_PATH } from "./js/config/commonConfig";

import { deviceConfig } from "./js/config/deviceConfig";
import WebSocketHandler from "./js/library/webSocketHandler";

import DeviceIndexGroupButtonComponent from "./js/components/pages/deviceIndexGroupButton.component";
import RebootButtonComponent from "./js/components/device/rebootButton.component";
import PowerButtonComponent from "./js/components/device/powerButton.component";
import BoardRestartComponent from "./js/components/device/boardRestartButton.component";
import GpioButtonComponent from "./js/components/device/gpioButton.component";
import UartPassThruButtonComponent from "./js/components/device/uartPassThruButton.component";
import BoardConfigButtonComponent from "./js/components/device/boardConfigButton.component";
import DeviceTabsComponent from "./js/components/device/deviceTabs.component";
import RealTimeLogComponent from "./js/components/device/realTimeLog.component";
import UploadFWButtonComponent from "./js/components/device/uploadFWButton.component";
import UpdateFWButtonComponent from "./js/components/device/updateFWButton.component";
import DeleteFWButtonComponent from "./js/components/device/deleteFWButton.component";
import PageFooterComponent from "./js/components/pages/pageFooter.component";


import { getDashboardConfiguration } from "./js/sharedVariable";


document.addEventListener("DOMContentLoaded", async () => {
    await reloadAll();
});


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

const initialDevicePage = async () => {

    document.getElementById("header").innerHTML = header;
    document.querySelector("#device-info-tabs-section").innerHTML = deviceInfoTabs;

    // Device index button.
    const r = new DeviceIndexGroupButtonComponent();
    // Generate the device index button from the config file.
    r.fetchDeviceDataFromConfigFile(deviceConfig);

    // System reboot button component.
    new RebootButtonComponent();

    // Power button component.
    new PowerButtonComponent();

    // GPIO button component.
    new GpioButtonComponent();

    // Board restart button component.
    new BoardRestartComponent();

    // UART pass thru button component.
    new UartPassThruButtonComponent();

    // Board config button component.
    new BoardConfigButtonComponent();

    // Device tabs component.
    new DeviceTabsComponent();

    // Upload FW image button component.
    new UploadFWButtonComponent();

    // Update FW image button component.
    new UpdateFWButtonComponent();

    // Delete FW image button component.
    new DeleteFWButtonComponent();

    // Real-time log component.
    const remoteDataComponent = new RealTimeLogComponent();

    // Web socket.
    const websocketHandler = new WebSocketHandler(getDashboardConfiguration("serverAddress"), WS_PATH);
    websocketHandler.setRemoteDataInstance(remoteDataComponent);
};

const initialDashboardConfigPage = async () => {
    // Setting tab content.
    document.querySelector("#dashboardSettingContainer").innerHTML = dashboardSetting;
    await dashboardSettingInitial();
};


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

