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

import { DynamicTableHandler } from "../../library/dynamicTable";


// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

import EditDeviceConfigButtonComponent from "./editDeviceConfigButton.component";


export default class DeviceTabsComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;
        this.getRequireDOMElements();
        this.initialEventListener();
        this.dynamicTableHandler = new DynamicTableHandler();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.deviceTabsItemsDOM = document.querySelectorAll("#device-info-tabs a");
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
        this.doOperation("agentStatusAPI");
    }

    async doOperation(apiTarget) {
        const responseData = await this.apiHandler[apiTarget](getSelectedDeviceSerialNumber());

        // If operation was success.
        if (responseData) {
            this.tabComponentSelector({ apiTarget, responseData });
        }

        pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
    }

    tabComponentSelector({ apiTarget, responseData }) {

        switch (apiTarget) {

            case ("agentStatusAPI"): {
                document.querySelector("#agentStatus").innerHTML = "";
                document.querySelector("#agentStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                break;
            }

            case ("networkStatusAPI"): {
                document.querySelector("#networkStatus").innerHTML = "";
                document.querySelector("#networkStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                break;
            }

            case ("getAgentConfigAPI"): {

                document.querySelector("#agentConfig").innerHTML = "";
                document.querySelector("#agentConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent("getAgentConfigAPI", "setAgentConfigAPI");
                break;
            }

            case ("getNetworkConfigAPI"): {
                document.querySelector("#networkConfig").innerHTML = "";
                document.querySelector("#networkConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent("getNetworkConfigAPI", "setNetworkConfigAPI");
                break;
            }

            case ("getServerConfigAPI"): {
                document.querySelector("#serverConfig").innerHTML = "";
                document.querySelector("#serverConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent("getServerConfigAPI", "setServerConfigAPI");
                break;
            }

            case ("getGpioConfigAPI"): {
                document.querySelector("#gpioConfig").innerHTML = "";
                document.querySelector("#gpioConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent("getGpioConfigAPI", "setGpioConfigAPI");
                break;
            }
            case ("getSerialConfigAPI"): {
                document.querySelector("#serialConfig").innerHTML = "";
                document.querySelector("#serialConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent("getSerialConfigAPI", "setSerialConfigAPI");
                break;
            }
            case ("getOOBDeviceConfigAPI"): {

                break;
            }

        }

    }

}