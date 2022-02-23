/**
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
import { remoteLogComponentInstance } from "../../../index";

// Reboot required handler.
import { rebootRequiredHandler } from "../../library/boardRestartRequiredHandler";


export default class DeviceTabsComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;
        this.getRequireDOMElements();
        this.initialEventListener();

        // Dynamic table.
        this.dynamicTableHandler = new DynamicTableHandler();
        this.gpioDynamicTableHandler = new GPIOTableHandler();

        // Editable components.
        this.editDeviceConfigButtonInstance = new EditDeviceConfigButtonComponent();

        // Editable button status.
        this.editableButtonStatus = false;
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.deviceTabsItemsDOM = document.querySelectorAll("#device-info-tabs a");
        this.firstDeviceTabItemDOM = document.querySelector("#device-info-tabs li:first-child a");
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

    }

    /**
     * Set default status.
     */
    async setDefaultStatus() {
        // Reset remote log instance.
        remoteLogComponentInstance.setOnLogStopUIStatus();
        Array.from(this.deviceTabsItemsDOM).forEach((element) => element.classList.remove("active"));

        // Default click the first tab.
        $("#device-info-tabs li:first-child a").tab("show");
        await this.tabComponentSelector("agentStatusTab");
        this.firstDeviceTabItemDOM.classList.add("active");
    }

    /**
     * Remove all child DOMs.
     * @param {string} parentDOM DOM query string.
     */
    removeAllChildDOMs(parentDOM) {
        const parent = document.querySelector(parentDOM);
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }


    setEditButtonStatus(flag) {
        this.editableButtonStatus = flag;
    }

    getEditButtonStatus() {
        return this.editableButtonStatus;
    }


    /**
     * Tab component selector.
     * @param {string} tab The tab name.
     */
    async tabComponentSelector(tab) {

        switch (tab) {

            case ("agentStatusTab"): {

                const responseData = await this.apiHandler.agentStatusAPI(getSelectedDeviceSerialNumber());
                rebootRequiredHandler(responseData);

                this.removeAllChildDOMs("#agentStatus");

                document.querySelector("#agentStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("networkStatusTab"): {
                const responseData = await this.apiHandler.networkStatusAPI(getSelectedDeviceSerialNumber());

                this.removeAllChildDOMs("#networkStatus");

                document.querySelector("#networkStatus").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("agentConfigTab"): {
                const responseData = await this.apiHandler.getAgentConfigAPI(getSelectedDeviceSerialNumber());

                this.removeAllChildDOMs("#agentConfig");

                document.querySelector("#agentConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                this.editDeviceConfigButtonInstance.removeAllExistingButton({ fetchAPITarget: tab });
                if (this.getEditButtonStatus() === true) this.editDeviceConfigButtonInstance.initial({ fetchAPITarget: tab, postAPITarget: "setAgentConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });

                break;
            }

            case ("networkConfigTab"): {
                const responseData = await this.apiHandler.getNetworkConfigAPI(getSelectedDeviceSerialNumber());

                this.removeAllChildDOMs("#networkConfig");

                document.querySelector("#networkConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                this.editDeviceConfigButtonInstance.removeAllExistingButton({ fetchAPITarget: tab });
                if (this.getEditButtonStatus() === true) this.editDeviceConfigButtonInstance.initial({ fetchAPITarget: tab, postAPITarget: "setNetworkConfigAPI", autoRestart: false });
                

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("serverConfigTab"): {
                const responseData = await this.apiHandler.getServerConfigAPI(getSelectedDeviceSerialNumber());

                this.removeAllChildDOMs("#serverConfig");

                document.querySelector("#serverConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                this.editDeviceConfigButtonInstance.removeAllExistingButton({ fetchAPITarget: tab });
                if (this.getEditButtonStatus() === true) this.editDeviceConfigButtonInstance.initial({ fetchAPITarget: tab, postAPITarget: "setServerConfigAPI", autoRestart: false });
                
                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

            case ("gpioStatusTab"): {
                const responseData = await this.apiHandler.getCurrentGPIOStatusAPI(getSelectedDeviceSerialNumber(), { filtered: "OUTPUT" });

                this.removeAllChildDOMs("#gpioConfig");

                document.querySelector("#gpioConfig").appendChild(this.gpioDynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                this.editDeviceConfigButtonInstance.removeAllExistingButton({ fetchAPITarget: tab });
                if (this.getEditButtonStatus() === true) this.editDeviceConfigButtonInstance.initial({ fetchAPITarget: tab, postAPITarget: "setGpioConfigAPI", autoRestart: false });
                

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }
            case ("serialConfigTab"): {
                const responseData = await this.apiHandler.getSerialConfigAPI(getSelectedDeviceSerialNumber());

                this.removeAllChildDOMs("#serialConfig");

                document.querySelector("#serialConfig").appendChild(this.dynamicTableHandler.generateDynamicTableFromJSONData(responseData));
                this.editDeviceConfigButtonInstance.removeAllExistingButton({ fetchAPITarget: tab });
                if (this.getEditButtonStatus() === true) this.editDeviceConfigButtonInstance.initial({ fetchAPITarget: tab, postAPITarget: "setSerialConfigAPI", autoRestart: false });

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }
            case ("remoteLogTab"): {

                const responseData = await this.apiHandler.agentStatusAPI(getSelectedDeviceSerialNumber());
                if ((!responseData) || (+responseData["remote_type"]) === 0) {
                    remoteLogComponentInstance.setOnLogStopUIStatus();
                }
                else {
                    remoteLogComponentInstance.setOnLogStartUIStatus();
                }

                pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });
                break;
            }

        }

    }

}