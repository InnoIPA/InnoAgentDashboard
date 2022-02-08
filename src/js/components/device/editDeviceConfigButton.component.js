// API library.
import { apiHandler } from "../../library/APILibrary";

// Object compare library.
import { compareObjects } from "../../library/utils/compareObject";

// Pop-up alert utils.
import { alertUtils } from "../../library/alertUtils";

// Pop-up title and message.
import { alertTitle, alertMessage } from "../../applicationConstants";

// Page loading animate.
import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";

// Shared variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

// Dynamic table handler.
import { DynamicTableHandler } from "../../library/dynamicTable";
import { GPIOTableHandler } from "../../library/gpioDynamicTable";

// Parse value to specified type library.
import { parseValueToType } from "../../library/utils/parseValueToType";

// Reboot required handler.
import { rebootRequiredHandler } from "../../library/boardRestartRequiredHandler";

export default class EditDeviceConfigButtonComponent {
    constructor({ fetchAPITarget = "", postAPITarget = "", autoRestart = false }) {

        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "modify configure";

        // API target.
        this.fetchAPITarget = fetchAPITarget;
        this.postAPITarget = postAPITarget;

        // Automatic restart.
        this.autoRestart = autoRestart;

        // Dynamic table handler.
        this.dynamicTableHandler = new DynamicTableHandler();
        this.gpioDynamicTableHandler = new GPIOTableHandler();

        // The trigger tabs.
        this.triggerTabs = document.querySelector(`[data-tab-target='${fetchAPITarget}']`).getAttribute("href");
        this.triggerTabsName = document.querySelector(`[data-tab-target='${fetchAPITarget}']`).getAttribute("data-tab-target");


        // The edit device config button position.
        this.editDeviceConfigButtonTargetPosition = document.querySelector(`${this.triggerTabs} .editButtonWrapper`);

        // Current entire table.
        this.currentTableDOM = undefined;

        // Config table value.
        this.configTableValues = document.querySelectorAll(`${this.triggerTabs} .config-table table tr td.value`);

        // Current table temp value.
        this.currentTableTempValues = undefined;

        // Clear existing edit button.
        this.clearExistingEditButton(this.editDeviceConfigButtonTargetPosition);

        // Initial edit buttons.
        this.initialButtons(this.editDeviceConfigButtonTargetPosition);
    }

    /**
     * On gpio tab edit button click event.
     */
    gpioTabOnEditHandler() {

        this.currentTableTempValues = {};
        const gpioDirectionSwitches = Array.from(document.querySelectorAll(`${this.triggerTabs} .config-table table td input[type="radio"]:checked`));
        const gpioValueSelectors = Array.from(document.querySelectorAll(`${this.triggerTabs} .config-table table td select`));

        const gpioDirectionSwitchesAll = Array.from(document.querySelectorAll(`${this.triggerTabs} .config-table table td input[type="radio"]`));

        if (gpioDirectionSwitchesAll.length > 0) {
            gpioDirectionSwitchesAll.forEach((item) => {
                item.removeAttribute("disabled");
            });
        }

        if (gpioDirectionSwitches.length > 0 && gpioValueSelectors.length > 0) {

            for (let i = 0; i < gpioDirectionSwitches.length; i++) {

                // GPIO toggle switches.
                const css = ".switch-field label:hover{ cursor: pointer; }";
                const style = document.createElement("style");

                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                // GPIO direction switch style.

                gpioDirectionSwitches[i].appendChild(style);
                gpioDirectionSwitches[i].removeAttribute("disabled");

                // GPIO value selector style.
                gpioValueSelectors[i].removeAttribute("disabled");


                // Cache the current value
                // E.g.:
                // {
                //   "INNO_GPIO_1": { },
                //   "INNO_GPIO_2": { },
                //   "INNO_GPIO_3": { },
                //   "INNO_GPIO_4": { },
                //   "INNO_GPIO_5": { },
                //   "INNO_GPIO_6": { }
                // }
                Object.assign(this.currentTableTempValues, { [gpioDirectionSwitches[i].getAttribute("name")]: {} });


                // E.g.:
                // {
                //   "INNO_GPIO_1": { "DIRECTION":"in","VALUE":"1" },
                //   "INNO_GPIO_2": { "DIRECTION":"in","VALUE":"1" },
                //   "INNO_GPIO_3": { "DIRECTION":"in","VALUE":"1" },
                //   "INNO_GPIO_4": { "DIRECTION":"in","VALUE":"1" },
                //   "INNO_GPIO_5": { "DIRECTION":"in","VALUE":"1" },
                //   "INNO_GPIO_6": { "DIRECTION":"in","VALUE":"1" }
                // }
                Object.assign(this.currentTableTempValues[gpioDirectionSwitches[i].getAttribute("name")], { [gpioDirectionSwitches[i].getAttribute("data-json-key")]: parseValueToType(gpioDirectionSwitches[i].value, gpioDirectionSwitches[i].getAttribute("type")) });
                Object.assign(this.currentTableTempValues[gpioDirectionSwitches[i].getAttribute("name")], { [gpioValueSelectors[i].getAttribute("data-json-key")]: parseValueToType(gpioValueSelectors[i].value, gpioValueSelectors[i].getAttribute("type")) });

            }

        }
    }

    /**
     * On gpio tab cancel click event.
     */
    gpioTabOnCancelHandler() {
        const gpioDirectionSwitches = Array.from(document.querySelectorAll(`${this.triggerTabs} .config-table table td input[type="radio"]`));
        const gpioValueSelectors = Array.from(document.querySelectorAll(`${this.triggerTabs} .config-table table td select`));


        if (gpioDirectionSwitches.length > 0 && gpioValueSelectors.length > 0) {


            for (let i = 0; i < gpioDirectionSwitches.length; i++) {

                // GPIO toggle switches style.
                const css = ".switch-field label:hover{ cursor: default; }";
                const style = document.createElement("style");

                (style.styleSheet) ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
                gpioDirectionSwitches[i].appendChild(style);

                gpioDirectionSwitches[i].setAttribute("disabled", "");

                // Check if the temp value is equal to the GPIO direction switch DOM element value, if the result is equal set its check status to "checked".
                if (this.currentTableTempValues[gpioDirectionSwitches[i].getAttribute("name")][gpioDirectionSwitches[i].getAttribute("data-json-key")] === gpioDirectionSwitches[i].value) {
                    gpioDirectionSwitches[i].checked = true;
                }
            }

            for (let j = 0; j < gpioValueSelectors.length; j++) {
                gpioValueSelectors[j].setAttribute("disabled", "");
                gpioValueSelectors[j].value = this.currentTableTempValues[gpioValueSelectors[j].getAttribute("name")][gpioValueSelectors[j].getAttribute("data-json-key")];
            }

        }
    }

    /**
     * On edit button click event (For regular page.)
     */
    onEditButtonClick() {
        this.editDeviceConfigButtonTargetPosition.querySelector(".edit-device-config").classList.add("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".apply-device-config").classList.remove("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".cancel-device-config").classList.remove("d-none");

        // If current tab is GPIO status.
        if (this.triggerTabsName === "gpioStatusTab") {
            // Check if the tab is the gpio.
            this.gpioTabOnEditHandler();
        }

        // Otherwise.
        else {
            this.currentTableTempValues = [];
            this.configTableValues.forEach((item) => {
                // Make table content editable.
                item.setAttribute("contenteditable", "true");

                // Temp save the current value.
                this.currentTableTempValues.push(item.innerHTML);
            });
        }

    }

    /**
     * On apply button click 
     */
    async onApplyButtonClick() {

        const result = await alertUtils.questionAlert(this.operationName);

        // Click the OK button.
        if (result.isConfirmed === true) {
            // Reserve, if you need the password validator, you implement this function by yourself.
            // alertObj.fire(`Entered password: ${result.value}`);

            // Show page loading animate.
            pageLoadingAnimate({ type: "loading" });

            this.editDeviceConfigButtonTargetPosition.querySelector(".edit-device-config").classList.remove("d-none");
            this.editDeviceConfigButtonTargetPosition.querySelector(".apply-device-config").classList.add("d-none");
            this.editDeviceConfigButtonTargetPosition.querySelector(".cancel-device-config").classList.add("d-none");


            this.configTableValues.forEach((item) => {
                item.setAttribute("contenteditable", "false");
            });

            const table = document.querySelector(`${this.triggerTabs} .config-table`);

            let payload;

            // Selector the dynamic table handler.
            if (this.postAPITarget === "setGpioConfigAPI") {
                payload = this.gpioDynamicTableHandler.parseTableToJSONObject(table);
            }
            else {
                payload = this.dynamicTableHandler.parseTableToJSONObject(table);
            }

            const response = await this.apiHandler[this.postAPITarget](getSelectedDeviceSerialNumber(), JSON.stringify(payload));

            pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });

            // Check if allowed automatic reboot.
            if (this.autoRestart === true) {
                setTimeout(await this.apiHandler.boardRestartAPI(getSelectedDeviceSerialNumber()), 3000);
            }

            // If operation was success.
            if (compareObjects(response, payload)) {
                const message = (this.autoRestart === true)
                    // No reboot requirement.
                    ? `${this.operationName[0].toUpperCase() + this.operationName.slice(1)} ${alertMessage.success}`

                    // Reboot requirement.
                    : `${this.operationName[0].toUpperCase() + this.operationName.slice(1)} ${alertMessage.success} <br> To take the configuration effect, you must restart your InnoAgent device.`;
                alertUtils.mixinAlert("success", message, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

                // Update device reboot required alert.
                const responseData = await this.apiHandler.agentStatusAPI(getSelectedDeviceSerialNumber());
                rebootRequiredHandler(responseData);

            }
            // Otherwise.
            else {
                alertUtils.mixinAlert("error", `Failed to do ${this.operationName} , please try again later!`, { showConfirmButton: false, timer: 5 * 1000, timerProgressBar: true });
            }

            // Stop page loading animate.
            pageLoadingAnimate({ type: "stop" });
        }

        // Click the cancel button.
        if (result.isDismissed === true) {
            alertUtils.infoAlert(alertTitle.dismiss, alertMessage.dismiss);
        }
    }

    onCancelButtonClick() {
        this.editDeviceConfigButtonTargetPosition.querySelector(".edit-device-config").classList.remove("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".apply-device-config").classList.add("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".cancel-device-config").classList.add("d-none");

        // If current tab is GPIO status.
        if (this.triggerTabsName === "gpioStatusTab") {
            this.gpioTabOnCancelHandler();
        }

        // Otherwise.
        else {
            for (let i = 0; i < this.configTableValues.length; i++) {
                this.configTableValues[i].setAttribute("contenteditable", "false");
                this.configTableValues[i].innerHTML = this.currentTableTempValues[i];
            }
        }

        this.currentTableTempValues = undefined;
    }

    initialButtons(DOMElement) {
        if (!DOMElement) return;
        const editButtonWrapper = DOMElement;

        editButtonWrapper.appendChild(this.generateEditButton());
        editButtonWrapper.appendChild(this.generateConfigCancelButton());
        editButtonWrapper.appendChild(this.generateConfigApplyButton());
    }

    /**
     * Clear existing edit button on DOM.
     * @param {*} DOMElement The dom element target.
     * @returns 
     */
    clearExistingEditButton(DOMElement) {

        if (!DOMElement) return;

        const btn = DOMElement.querySelector("button");

        if (!btn) return;

        const fn = () => {
            this.onEditButtonClick();
            this.onApplyButtonClick();
            this.onCancelButtonClick();
        };
        btn.removeEventListener("click", fn.bind(this));
        DOMElement.innerHTML = "";
    }

    /**
     * Generate edit button.
     * @returns Edit button DOM.
     */
    generateEditButton() {
        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-secondary", "btn-sm", "edit-device-config");
        editButton.style = "flex:1;margin-right:5px;";

        // Edit button inner.
        const buttonInner = document.createElement("span");
        buttonInner.classList.add("material-icons", "font18");
        buttonInner.innerHTML = "edit";



        // Edit button on click event.
        const fn = () => { this.onEditButtonClick(); };
        editButton.removeEventListener("click", fn.bind(this));
        editButton.addEventListener("click", fn.bind(this), false);


        editButton.appendChild(buttonInner);

        return editButton;
    }

    /**
     * Generate config apply button.
     * @returns Apply button DOM.
     */
    generateConfigApplyButton() {
        // Edit button apply & cancel.
        const applyButton = document.createElement("button");
        applyButton.classList.add("btn", "btn-success", "btn-sm", "apply-device-config", "d-none");
        applyButton.style = "flex:1;";
        applyButton.setAttribute("title", "Apply");

        const buttonInner = document.createElement("span");
        buttonInner.classList.add("material-icons", "font18");
        buttonInner.innerHTML = "done";

        const fn = () => { this.onApplyButtonClick(); };
        applyButton.removeEventListener("click", fn.bind(this));
        applyButton.addEventListener("click", fn.bind(this), false);

        applyButton.appendChild(buttonInner);

        return applyButton;
    }

    /**
     * Generate config cancel button.
     * @returns Cancel button DOM.
     */
    generateConfigCancelButton() {
        // Edit button apply & cancel.
        const cancelButton = document.createElement("button");
        cancelButton.classList.add("btn", "btn-danger", "btn-sm", "cancel-device-config", "d-none");
        cancelButton.style = "flex:1;margin-right:5px;";
        cancelButton.setAttribute("title", "Cancel");

        const buttonInner = document.createElement("span");
        buttonInner.classList.add("material-icons", "font18");
        buttonInner.innerHTML = "close";

        const fn = () => { this.onCancelButtonClick(); };
        cancelButton.removeEventListener("click", fn.bind(this));
        cancelButton.addEventListener("click", fn.bind(this), false);

        cancelButton.appendChild(buttonInner);

        return cancelButton;
    }

}