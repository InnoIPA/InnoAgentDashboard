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
import RealTimeLogComponent from "./realTimeLog.component";


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


    async tabComponentSelector(tab) {

        switch (tab) {

            case ("agentStatusTab"): {
                const responseData = await this.apiHandler.agentStatusAPI(getSelectedDeviceSerialNumber());

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                document.querySelector("#agentStatus").innerHTML = "";
                document.querySelector("#agentStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                break;
            }

            case ("networkStatusTab"): {


                const responseData = await this.apiHandler.networkStatusAPI(getSelectedDeviceSerialNumber());
                document.querySelector("#networkStatus").innerHTML = "";
                document.querySelector("#networkStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("agentConfigTab"): {

                const responseData = await this.apiHandler.getAgentConfigAPI(getSelectedDeviceSerialNumber());
                document.querySelector("#agentConfig").innerHTML = "";
                document.querySelector("#agentConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent(tab, "setAgentConfigAPI", false);

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });

                break;
            }

            case ("networkConfigTab"): {

                const responseData = await this.apiHandler.getNetworkConfigAPI(getSelectedDeviceSerialNumber());
                document.querySelector("#networkConfig").innerHTML = "";
                document.querySelector("#networkConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent(tab, "setNetworkConfigAPI", false);

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("serverConfigTab"): {

                const responseData = await this.apiHandler.getServerConfigAPI(getSelectedDeviceSerialNumber());
                document.querySelector("#serverConfig").innerHTML = "";
                document.querySelector("#serverConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent(tab, "setServerConfigAPI", false);

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("gpioStatusTab"): {

                const responseData = await this.apiHandler.getCurrentGPIOStatusAPI(getSelectedDeviceSerialNumber(), "OUTPUT");
                document.querySelector("#gpioConfig").innerHTML = "";
                document.querySelector("#gpioConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent(tab, "setGpioConfigAPI", true);

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }
            case ("serialConfigTab"): {

                const responseData = await this.apiHandler.getSerialConfigAPI(getSelectedDeviceSerialNumber());
                document.querySelector("#serialConfig").innerHTML = "";
                document.querySelector("#serialConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                new EditDeviceConfigButtonComponent(tab, "setSerialConfigAPI", false);

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