/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Device tabs component.
 * This component is an device tabs component that controls Device tabs component function.
 * 
 * 
 */
// API library.
import { apiHandler } from "../../library/APILibrary";

// Page loading animate.
import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";

// Tabs items.
import DeviceInfoTabItemComponent from "./deviceInfoTab.component";
import DeviceNetworkingComponent from "./deviceNetworkingTab.component";
import DeviceConfigTabItemComponent from "./deviceConfigTab.component";


// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

export default class DeviceTabsComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;
        this.getRequireDOMElements();
        this.initialEventListener();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.deviceTabsItemsDOM = document.querySelectorAll("#device-info-tabs a");
        this.deviceInfoTabItemComponent = new DeviceInfoTabItemComponent();
        this.deviceNetworkingComponent = new DeviceNetworkingComponent();
        this.deviceConfigTabItemComponent = new DeviceConfigTabItemComponent();
    }

    initialEventListener() {
        const fn = (event) => {
            event.preventDefault();
            // Show page loading animate.
            pageLoadingAnimate({ DOMElement: "#navTabContent", type: "loading" });
            this.doOperation(event.target.getAttribute("data-api-target"));
        };

        for (const item of this.deviceTabsItemsDOM) {
            item.addEventListener("click", fn.bind(this));
            item.removeEventListener("click", fn.bind(this), false);
        }

        // Default click the first tab.
        this.doOperation("deviceInfoAPI");
    }

    async doOperation(apiTarget) {
        const responseData = await this.apiHandler[apiTarget](getSelectedDeviceSerialNumber());

        // If operation was success.
        if (responseData) {
            this.tabComponentSelector({ apiTarget, responseData });
        }

        // Mock data.
        // this.tabComponentSelector({ apiTarget });

        pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
    }

    tabComponentSelector({ apiTarget, responseData }) {

        switch (apiTarget) {
            case ("deviceInfoAPI"): {
                // Mock data.
                // responseData = {
                //     "AppVersion": "6.0.7.20210506", "ConnectedIPAddress": "172.16.93.106", "Port": "1883", "CONNECT": "Ethernet", "NT": "1", "WP": "0", "IDEL": "1", "UART_Pins": ["ttyS4"], "GPIO_Pins": ["PA0", "PA1"]
                // };

                this.deviceInfoTabItemComponent.insertDataIntoDOMElement(responseData);
                break;
            }
            case ("deviceNetworkAPI"): {
                // Mock data.
                // responseData = {
                //     "NAME": "eth0", "IP": "192.168.1.100", "MAC": "99:9A:8D:75:9B:2D", "MASK": "255.255.255.0", "GATEWAY": "192.168.1.1"
                // };

                this.deviceNetworkingComponent.insertDataIntoDOMElement(responseData);
                break;
            }
            case ("getOOBDeviceConfigAPI"): {
                // Mock data.
                // responseData = {
                //     "NETWORK_TYPE": "0",
                //     "NETWORK_STATIC_IP": "192.168.3.102",
                //     "NETWORK_STATIC_DEFAULT_GATEWAY": "192.168.3.1",
                //     "NETWORK_STATIC_NETMASK": "255.255.255.0",
                //     "NETWORK_STATIC_METRIC": "0",
                //     "SERVER_USERNAME": "innoage",
                //     "SERVER_PASSWORD": "B673AEBC6D65E7F42CFABFC7E01C02D0",
                //     "SERVER_IP": "172.16.93.106",
                //     "SERVER_PORT": "1883",
                //     "SYSTIME_ZONE": "GMT+8"
                // };
                this.deviceConfigTabItemComponent.insertDataIntoDOMElement(responseData);
                break;
            }

        }

    }

}