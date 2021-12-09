

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

export default class EditDeviceConfigButtonComponent {
    constructor(fetchAPITarget, postAPITarget) {

        // API library.
        this.apiHandler = apiHandler;

        // Operation name.
        this.operationName = "modify configure";

        // API target.
        this.fetchAPITarget = fetchAPITarget;
        this.postAPITarget = postAPITarget;

        // Dynamic table handler.
        this.dynamicTableHandler = new DynamicTableHandler();

        // The trigger tabs.
        this.triggerTabs = document.querySelector(`[data-api-target='${fetchAPITarget}']`).getAttribute("href");

        // The edit device config button position.
        this.editDeviceConfigButtonTargetPosition = document.querySelector(`${this.triggerTabs} .editButtonWrapper`);

        // Current entire table.
        this.currentTableDOM = undefined;

        // Config table value.
        this.configTableValues = document.querySelectorAll(`${this.triggerTabs} .config-table table tr td.value`);

        // Current table temp value.
        this.currentTableTempValues = undefined;

        this.clearExistingEditButton(this.editDeviceConfigButtonTargetPosition);
        this.initialButtons(this.editDeviceConfigButtonTargetPosition);


    }

    onEditButtonClick() {
        this.currentTableTempValues = [];
        this.editDeviceConfigButtonTargetPosition.querySelector(".edit-device-config").classList.add("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".apply-device-config").classList.remove("d-none");
        this.editDeviceConfigButtonTargetPosition.querySelector(".cancel-device-config").classList.remove("d-none");


        this.configTableValues.forEach((item) => {
            // Make table content editable.
            item.setAttribute("contenteditable", "true");

            // Temp save the current value.
            this.currentTableTempValues.push(item.innerHTML);
        });
    }

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
            const payload = this.dynamicTableHandler.parseTableToJSONObject(table);

            // TODO
            const response = await this.apiHandler[this.postAPITarget](getSelectedDeviceSerialNumber(), JSON.stringify(payload));


            pageLoadingAnimate({ DOMElement: "#navTabContent", type: "stop" });


            // If operation was success.
            if (compareObjects(response, payload)) {
                alertUtils.mixinAlert("success", `${this.operationName[0].toUpperCase() + this.operationName.slice(1)} ${alertMessage.success} <br> To take the configuration effect, you must restart your InnoAGE device.`, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
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

        for (let i = 0; i < this.configTableValues.length; i++) {
            this.configTableValues[i].setAttribute("contenteditable", "false");
            this.configTableValues[i].innerHTML = this.currentTableTempValues[i];
        }
        this.currentTableTempValues = [];
    }

    initialButtons(DOMElement) {
        if (!DOMElement) return;
        const editButtonWrapper = DOMElement;

        editButtonWrapper.appendChild(this.generateEditButton());
        editButtonWrapper.appendChild(this.generateConfigCancelButton());
        editButtonWrapper.appendChild(this.generateConfigApplyButton());
    }

    clearExistingEditButton(DOMElement) {

        if (!DOMElement) return;

        const btn = DOMElement.querySelector("button");

        if (!btn) return;

        // Reboot button event listener.
        const fn = () => {
            this.onEditButtonClick();
            this.onApplyButtonClick();
            this.onCancelButtonClick();
        };
        btn.removeEventListener("click", fn.bind(this));
        DOMElement.innerHTML = "";
    }

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
     * @returns 
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