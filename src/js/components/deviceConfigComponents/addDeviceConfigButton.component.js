// API library
import { apiHandler } from "../../library/APILibrary";

// Pop-up alert utils.
import { alertObj, alertUtils } from "../../library/alertUtils";

// Pop-up page.
import addDeviceAlert from "../../../html/pages/addDeviceConfigAlert.html";

import { formToJSON } from "../../library/utils/formUtils";
import { ADD_DEVICE_CONFIGURATION_STATUS } from "../../applicationConstants";
import { deviceIndexGroupButtonComponentInstance } from "../../../index";

export default class AddDeviceConfigButtonComponent {
    constructor() {
        this.getRequireDOMElements();
        this.initialEventListener();

        // File global variable.
        this.file = undefined;
        this.fileContent = undefined;
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.addDeviceButtonDOM = document.querySelector("#addDeviceBtn");
        this.indexAddDeviceButton = document.querySelector("#indexAddDeviceButton");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {
        const fn = () => { this.doOperation(); };
        this.addDeviceButtonDOM.removeEventListener("click", fn);
        this.addDeviceButtonDOM.addEventListener("click", fn, false);

        this.indexAddDeviceButton.removeEventListener("click", fn);
        this.indexAddDeviceButton.addEventListener("click", fn, false);
    }


    /**
     * Sweetalert on-open event.
     */
    alertOnOpen() {
        return () => {
            this.getPopupDOMElements();
            this.popupEventListenerHandler({ mode: "initial" });
        };
    }

    /**
     * 
     * Sweetalert on-close event.
     */
    alertOnClose() {
        return () => {
            this.popupEventListenerHandler({ mode: "remove" });
        };
    }

    /**
     * 
     * Sweetalert pre-confirm event.
     */
    alertPreConfirm() {
        return () => {
            const data = (this.fileContent)
                ? this.fileContent
                : formToJSON(this.popupAddDeviceConfigFormDOM);

            // If data is multiple device.
            if (Array.isArray(data)) {
                data.forEach((element) => {
                    if (!element.deviceUid) alertObj.showValidationMessage("Some required field is null or empty!");
                });

            }

            // If data is single device.
            else {

                if (this.popupAddDeviceConfigFormDOM.checkValidity() !== true) {
                    return this.popupAddDeviceConfigFormDOM.reportValidity();
                }
            }

        };
    }

    /**
     * Get alert pop-up DOM element.
     */
    getPopupDOMElements() {

        // Manual key-in form.
        this.popupAddDeviceConfigFormDOM = alertObj.getPopup().querySelector("#add-device-config");

        // All checkbox in update config form.
        this.popupFormCheckboxes = this.popupAddDeviceConfigFormDOM.querySelectorAll("input[type='checkbox']");

        // Manual key-in tab button, for function test.
        this.popupManualKeyInTabButtonDOM = alertObj.getPopup().querySelector("#pills-manual-keyin-tab");
        this.functionTestBlockDOM = alertObj.getPopup().querySelector("#function-test-block");

        // Drop upload select file upload.
        this.popupDragUploadContainerDOM = alertObj.getPopup().querySelector(".drag-upload-container");
        this.popupDragUploadSelectFileBlockDOM = this.popupDragUploadContainerDOM.querySelector("#select-file-block");
        this.popupDragUploadFileDraggingBlockDOM = this.popupDragUploadContainerDOM.querySelector("#file-dragging-status-block");
        this.popupDragUploadFileUploadedBlockDOM = this.popupDragUploadContainerDOM.querySelector("#file-uploaded-block");
        this.popupDragUploadFileInputDOM = this.popupDragUploadContainerDOM.querySelector("#file-selector");
        this.popupDragUploadSelectFileButtonDOM = this.popupDragUploadContainerDOM.querySelector("#select-file-btn");
        this.popupDragUploadClearFileButtonDOM = this.popupDragUploadContainerDOM.querySelector("#clear-file-btn");

        // Config table for multiple devices.
        this.popupConfigDataTable = alertObj.getPopup().querySelector("#config-data-table");

        this.popupDeviceConfigurationTemplateLink = alertObj.getPopup().querySelector("#template-link");
    }

    /**
     * 
     * Sweetalert pop-up event listener handler.
     */
    popupEventListenerHandler({ mode = "initial" }) {

        // Form checkbox checked.
        const onCheckboxClickedFn = (event) => {

            // When user clicked the checkbox, modify the checkbox value.
            return event.target.value = (event.target.checked)
                ? true
                : false;
        };

        // Enable function test option function.
        let clickCount = 0;
        const enableFunctionTestOptionFn = () => {
            clickCount++;
            if (clickCount < 5) {
                console.log(`%c再按 ${5 - clickCount} 次，即為測試人員!`, "color: orange");
            }

            if (clickCount === 5) {
                console.log("%c%s", "color: white; background: red; font-size: 24px;", "Hello! Innodisk DQE，已顯示功能測試選項!");
                this.functionTestBlockDOM.classList.remove("d-none");

            }

            if (clickCount > 5) {
                console.log("%c不需要!您已為測試人員，已顯示功能測試選項", "color: orange");
            }
        };

        // Browser file function.
        const onBrowserFileButtonClicked = () => {
            this.popupDragUploadFileInputDOM.click();
        };


        // Clear file function.
        const onClearFileSelectedButtonClicked = (event) => {
            // Clear file global variable.
            event.stopPropagation();
            event.preventDefault();
            this.file = undefined;
            this.fileContent = undefined;

            this.popupDragUploadFileInputDOM.value = "";
            this.popupConfigDataTable.innerHTML = "";

            this.popupDragUploadContainerDOM.classList.remove("active");
            this.popupDragUploadSelectFileBlockDOM.classList.remove("d-none");
            this.popupDragUploadFileUploadedBlockDOM.classList.add("d-none");

            // Clear all validation message.
            alertObj.resetValidationMessage();
        };

        // On file selector changed event.
        const onFileSelectorChangedFn = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.file = event.target.files[0];
            this.popupDragUploadContainerDOM.classList.add("active");
            this.popupDragUploadSelectFileBlockDOM.classList.add("d-none");
            this.popupDragUploadFileUploadedBlockDOM.classList.remove("d-none");
            // TODO: Read file.
            this.readUploadFile();
        };

        // On file drop over event.
        const onFileDragOverFn = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.popupDragUploadContainerDOM.classList.add("active");
            this.popupDragUploadSelectFileBlockDOM.classList.add("d-none");
            this.popupDragUploadFileDraggingBlockDOM.classList.remove("d-none");
        };

        // On file drag leave event.
        const onFileDragLeaveFn = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.popupDragUploadContainerDOM.classList.remove("active");
            this.popupDragUploadFileDraggingBlockDOM.classList.add("d-none");
            this.popupDragUploadSelectFileBlockDOM.classList.remove("d-none");
        };

        // On file drop event.
        const onFileDropFn = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.file = event.dataTransfer.files[0];
            this.popupDragUploadContainerDOM.classList.add("active");
            this.popupDragUploadFileDraggingBlockDOM.classList.add("d-none");
            this.popupDragUploadSelectFileBlockDOM.classList.add("d-none");
            this.popupDragUploadFileUploadedBlockDOM.classList.remove("d-none");
            this.readUploadFile();
        };


        /**
         * On configuration file template click event.
         */
        const onDeviceConfigurationTemplateLinkClickFn = () => {
            const fileContent = [
                {
                    "deviceUid": "e0d55e4d9bc8",
                    "name": "InnoAgent #1",
                    "powerOperation": true,
                    "rebootOperation": true,
                    "gpioOperation": true,
                    "setConfigOperation": true,
                    "otaOperation": true,
                    "boardRestartOperation": true,
                    "functionTest": false
                },
                {
                    "deviceUid": "e0d55e4d9bc9",
                    "name": "InnoAgent #2",
                    "powerOperation": true,
                    "rebootOperation": true,
                    "gpioOperation": true,
                    "setConfigOperation": true,
                    "otaOperation": true,
                    "boardRestartOperation": true,
                    "functionTest": false
                },
                {
                    "deviceUid": "e0d55e4d9bd0",
                    "name": "InnoAgent #3",
                    "powerOperation": true,
                    "rebootOperation": true,
                    "gpioOperation": true,
                    "setConfigOperation": true,
                    "otaOperation": true,
                    "boardRestartOperation": true,
                    "functionTest": false
                }
            ];
            const pom = document.createElement("a");
            pom.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," +
                encodeURIComponent(JSON.stringify(fileContent, null, 4))
            );
            let fileName = "innagent-dashboard-config-template.json";
            pom.setAttribute("download", fileName);

            if (document.createEvent) {
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", true, true);
                pom.dispatchEvent(event);
            } else {
                pom.click();
            }
        };

        // Initial event listener.
        if (mode === "initial") {

            // All checkboxes in the form.
            Array.from(this.popupFormCheckboxes).forEach((element) => element.removeEventListener("change", onCheckboxClickedFn));
            Array.from(this.popupFormCheckboxes).forEach((element) => element.addEventListener("change", onCheckboxClickedFn, false));

            // Enable function test configuration.
            this.popupManualKeyInTabButtonDOM.removeEventListener("click", enableFunctionTestOptionFn);
            this.popupManualKeyInTabButtonDOM.addEventListener("click", enableFunctionTestOptionFn, false);

            // Browser file button.
            this.popupDragUploadSelectFileButtonDOM.removeEventListener("click", onBrowserFileButtonClicked);
            this.popupDragUploadSelectFileButtonDOM.addEventListener("click", onBrowserFileButtonClicked, false);

            // Clear file selected button.
            this.popupDragUploadClearFileButtonDOM.removeEventListener("click", onClearFileSelectedButtonClicked);
            this.popupDragUploadClearFileButtonDOM.addEventListener("click", onClearFileSelectedButtonClicked, false);

            // File selector changed.
            this.popupDragUploadFileInputDOM.removeEventListener("change", onFileSelectorChangedFn);
            this.popupDragUploadFileInputDOM.addEventListener("change", onFileSelectorChangedFn, false);

            // Drag file over the drop area.
            this.popupDragUploadContainerDOM.removeEventListener("dragover", onFileDragOverFn);
            this.popupDragUploadContainerDOM.addEventListener("dragover", onFileDragOverFn, false);

            // Leave dragged from drop area.
            this.popupDragUploadContainerDOM.removeEventListener("dragenter", onFileDragLeaveFn);
            this.popupDragUploadContainerDOM.addEventListener("dragenter", onFileDragLeaveFn, false);

            // Drop the file on the drop area.
            this.popupDragUploadContainerDOM.removeEventListener("drop", onFileDropFn);
            this.popupDragUploadContainerDOM.addEventListener("drop", onFileDropFn, false);

            // Download configuration template link.
            this.popupDeviceConfigurationTemplateLink.removeEventListener("click", onDeviceConfigurationTemplateLinkClickFn);
            this.popupDeviceConfigurationTemplateLink.addEventListener("click", onDeviceConfigurationTemplateLinkClickFn, false);

        }

        // Remove event listener.
        if (mode === "remove") {

            // All checkboxes in the form.
            Array.from(this.popupFormCheckboxes).forEach((element) => element.removeEventListener("change", onCheckboxClickedFn));

            // Enable function test configuration.
            this.popupManualKeyInTabButtonDOM.removeEventListener("click", enableFunctionTestOptionFn);

            // Browser file button.
            this.popupDragUploadSelectFileButtonDOM.removeEventListener("click", onBrowserFileButtonClicked);

            // Clear file selected button.
            this.popupDragUploadClearFileButtonDOM.removeEventListener("click", onClearFileSelectedButtonClicked);

            // File selector changed.
            this.popupDragUploadFileInputDOM.removeEventListener("change", onFileSelectorChangedFn);

            // Drag file over the drop area.
            this.popupDragUploadContainerDOM.removeEventListener("dragover", onFileDragOverFn);

            // Leave dragged from drop area.
            this.popupDragUploadContainerDOM.removeEventListener("dragleave", onFileDragLeaveFn);

            // Drop the file on the drop area.
            this.popupDragUploadContainerDOM.removeEventListener("drop", onFileDropFn);

            // Download configuration template link.
            this.popupDeviceConfigurationTemplateLink.removeEventListener("click", onDeviceConfigurationTemplateLinkClickFn);
        }

    }

    /**
     * Read uploaded file.
     */
    readUploadFile() {
        const fileType = this.file.type;
        const validExtensions = ["application/json"];
        if (validExtensions.includes(fileType)) {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                try {
                    this.fileContent = JSON.parse(fileReader.result.toString());
                    console.log(this.fileContent);
                    this.generateConfigurationTable({ targetDOM: this.popupConfigDataTable, data: this.fileContent });
                }
                catch (error) {
                    console.log(`Error catch at ${this.readFile.name()}`, error.message);
                }

            };
            fileReader.readAsText(this.file);
        } else {
            this.file = undefined;
            this.fileContent = undefined;

            alertObj.showValidationMessage("Invalid configuration file!");

            this.popupDragUploadFileInputDOM.value = "";
            this.popupConfigDataTable.innerHTML = "";

            this.popupDragUploadContainerDOM.classList.remove("active");
            this.popupDragUploadSelectFileBlockDOM.classList.remove("d-none");
            this.popupDragUploadFileUploadedBlockDOM.classList.add("d-none");
        }
    }

    /**
     * Generate configuration table from upload data.
     * @param {object} 
     */
    generateConfigurationTable({ targetDOM, data }) {

        // Extract value from table header.
        let col = [];
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // Create table header row using the extracted headers above.
        let tr = targetDOM.insertRow(-1); // table row.

        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th"); // table header.
            th.innerHTML = col[i];
            th.setAttribute("scope", "col");
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (let i = 0; i < data.length; i++) {
            tr = targetDOM.insertRow(-1);

            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
        }
    }

    /**
     * Event listener operation.
     * 
     */
    async doOperation() {
        try {
            const alert = await alertUtils.htmlAlert({ html: addDeviceAlert, onBeforeOpen: this.alertOnOpen(), preConfirm: this.alertPreConfirm(), confirmButtonText: "Add", width: "70%", onClose: this.alertOnClose() });

            if (alert.isConfirmed) {
                const data = (this.fileContent)
                    ? this.fileContent
                    : formToJSON(this.popupAddDeviceConfigFormDOM);

                const response = await apiHandler.createDeviceConfigAPI(data);
                (response)
                    ? alertUtils.mixinAlert(ADD_DEVICE_CONFIGURATION_STATUS.SUCCESS.ICON, ADD_DEVICE_CONFIGURATION_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true })
                    : alertUtils.mixinAlert(ADD_DEVICE_CONFIGURATION_STATUS.FAILED.ICON, ADD_DEVICE_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }

            // Refresh the device index group button.
            await deviceIndexGroupButtonComponentInstance.fetchDeviceDataFromServer();

            if (alert.dismiss) {
                return alertUtils.mixinAlert(ADD_DEVICE_CONFIGURATION_STATUS.CANCEL.ICON, ADD_DEVICE_CONFIGURATION_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            }


        }
        catch (error) {
            console.error(error);
        }

    }

}

