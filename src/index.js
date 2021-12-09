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

// Page components
import header from "./html/pages/header.html";
import deviceInfoTabs from "./html/pages/deviceInfoTabs.html";

;

import { initial } from "./js/pages/main";
import { sideBarInit } from "./js/pages/sideBar";



import { demoWebTitle } from "./js/config/commonConfig";



document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("header").innerHTML = header;
    document.querySelector("#device-info-tabs-section").innerHTML = deviceInfoTabs;

    // Initial the sidebar.
    sideBarInit();

    // Initial the main page.
    initial();

    // Set web title.
    document.title = demoWebTitle;


});

