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

import { GPIOTableHandler } from "../../library/gpioDynamicTable";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

import EditDeviceConfigButtonComponent from "./editDeviceConfigButton.component";
import RealTimeLogComponent from "./realTimeLog.component";


export default class DeviceTabsComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;
        this.getRequireDOMElements();
        this.initialEventListener();

        // Dynamic table.
        this.dynamicTableHandler = new DynamicTableHandler();
        this.gpioDynamicTableHandler = new GPIOTableHandler();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.deviceTabsItemsDOM = document.querySelectorAll("#device-info-tabs a");
    }

    async initialEventListener() {
        const fn = (event) => {
            event.preventDefault();
            // Show page loading animate.
            pageLoadingAnimate({ DOMElement: "#navTabContent", type: "loading" });
            this.tabComponentSelector(event.target.getAttribute("data-tab-target"));
        };

        for (const item of this.deviceTabsItemsDOM) {
            item.removeEventListener("click", fn.bind(this), false);
            item.addEventListener("click", fn.bind(this));
        }

        // Default click the first tab.
        await this.tabComponentSelector("agentStatusTab");
        $("#device-info-tabs li:first-child a").tab("show");

    }


    /**
     * Tab component selector.
     * @param {string} tab The tab name.
     */
    async tabComponentSelector(tab) {

        switch (tab) {

            case ("agentStatusTab"): {
                document.querySelector("#agentStatus").innerHTML = "";
                const responseData = await this.apiHandler.agentStatusAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#agentStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("networkStatusTab"): {
                document.querySelector("#networkStatus").innerHTML = "";
                const responseData = await this.apiHandler.networkStatusAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#networkStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("agentConfigTab"): {
                document.querySelector("#agentConfig").innerHTML = "";
                const responseData = await this.apiHandler.getAgentConfigAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#agentConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent({ fetchAPITarget: tab, postAPITarget: "setAgentConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });

                break;
            }

            case ("networkConfigTab"): {
                document.querySelector("#networkConfig").innerHTML = "";
                const responseData = await this.apiHandler.getNetworkConfigAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#networkConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent({ fetchAPITarget: tab, postAPITarget: "setNetworkConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("serverConfigTab"): {
                document.querySelector("#serverConfig").innerHTML = "";
                const responseData = await this.apiHandler.getServerConfigAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#serverConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent({ fetchAPITarget: tab, postAPITarget: "setServerConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("gpioStatusTab"): {
                document.querySelector("#gpioConfig").innerHTML = "";
                const responseData = await this.apiHandler.getCurrentGPIOStatusAPI(getSelectedDeviceSerialNumber(), "OUTPUT");

                document.querySelector("#gpioConfig").appendChild(this.gpioDynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent({ fetchAPITarget: tab, postAPITarget: "setGpioConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }
            case ("serialConfigTab"): {
                document.querySelector("#serialConfig").innerHTML = "";
                const responseData = await this.apiHandler.getSerialConfigAPI(getSelectedDeviceSerialNumber());

                document.querySelector("#serialConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent({ fetchAPITarget: tab, postAPITarget: "setSerialConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }
            case ("realTimeLogTab"): {

                const realTimeLogComponent = new RealTimeLogComponent();
                realTimeLogComponent.initialEventListener();
                realTimeLogComponent.onLogStopButtonClick();
                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

        }

    }

}