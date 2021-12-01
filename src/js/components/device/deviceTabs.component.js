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

import { generateDynamicTableFromJSONData } from "../../library/dynamicTable";


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
                document.querySelector("#agentStatus").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }
            case ("getAgentConfigAPI"): {
                document.querySelector("#agentConfig").innerHTML = "";
                document.querySelector("#agentConfig").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }
            case ("getNetworkConfigAPI"): {
                document.querySelector("#networkConfig").innerHTML = "";
                document.querySelector("#networkConfig").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }

            case ("getServerConfigAPI"): {
                document.querySelector("#serverConfig").innerHTML = "";
                document.querySelector("#serverConfig").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }

            case ("getGpioConfigAPI"): {
                document.querySelector("#gpioConfig").innerHTML = "";
                document.querySelector("#gpioConfig").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }
            case ("getSerialConfigAPI"): {
                document.querySelector("#serialConfig").innerHTML = "";
                document.querySelector("#serialConfig").appendChild(generateDynamicTableFromJSONData(responseData));
                break;
            }
            case ("getOOBDeviceConfigAPI"): {

                break;
            }

        }

    }

}