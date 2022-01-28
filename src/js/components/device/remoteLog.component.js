// API library.
import { apiHandler } from "../../library/APILibrary";

// Alert utils.
import { alertUtils } from "../../library/alertUtils";

// Form utils.
import { formToJSON } from "../../library/utils/formUtils";

// Constants.
import { REMOTE_LOG_STATUS } from "../../applicationConstants";

// Global variable.
import { getSelectedDeviceSerialNumber, getNewLineOptionValue, setNewLineOptionValue } from "../../sharedVariable";

let logData = "";
let newLineOptionValue = getNewLineOptionValue();
export default class RemoteLogComponent {
    constructor() {
        this.getRequireDOMElements();

        this.newLineReplaceOption = {
            "CR+LF": /\r\n/g,
            "CR": /\r/g,
            "LF": /\n/g
        };
    }

    /**
    * Get requirement DOMs.
    * 
    */
    getRequireDOMElements() {

        // Log filter DOM.
        this.logFilterDOM = document.querySelector("#logFilter");

        // log Toolbar DOM.
        this.logToolbarDOM = document.querySelector("#logToolbar");

        // Log start button DOM.
        this.logStartButtonDOM = document.querySelector("#logStart");

        // Log stop button DOM.
        this.logStopButtonDOM = document.querySelector("#logStop");

        // Log download button DOM.
        this.logDownloadButtonDOM = document.querySelector("#logDownload");

        // Log box DOM.
        this.logBoxDOM = document.querySelector("#logBox");

        // Remote log form.
        this.remoteLogFormDOM = document.querySelector("#remoteLogForm");

        // New line option.
        this.newLineOptionDOM = document.querySelector("#newLineOption");

    }

    /**
     * 
     * Set log start UI status.
     * 
     */
    setOnLogStartUIStatus() {
        this.logFilterDOM.classList.add("d-none");
        this.logBoxDOM.innerHTML = "";

        this.logToolbarDOM.classList.remove("d-none");
    }

    /**
     * 
     * On log start button clicked event.
     * 
     */
    async onLogStartButtonClick() {
        // New line option.
        setNewLineOptionValue(this.newLineOptionDOM.value);
        newLineOptionValue = getNewLineOptionValue();

        const portParams = formToJSON(this.remoteLogFormDOM);
        const response = await apiHandler.remoteLogAPI(getSelectedDeviceSerialNumber(), portParams);

        if (!response) {
            return alertUtils.mixinAlert(REMOTE_LOG_STATUS.FAILED.ICON, REMOTE_LOG_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }
        this.setOnLogStartUIStatus();
    }

    /**
     * 
     * Set log stop UI status.
     * 
     */
    setOnLogStopUIStatus() {
        this.logFilterDOM.classList.remove("d-none");
        this.logBoxDOM.innerHTML = "";

        this.logToolbarDOM.classList.add("d-none");

        logData = "";
    }

    /**
     * 
     * On log stop button clicked event.
     * 
     */
    async onLogStopButtonClick() {
        const portParams = { port: "disable" };
        const response = await apiHandler.remoteLogAPI(getSelectedDeviceSerialNumber(), portParams);
        if (!response) {
            return alertUtils.mixinAlert(REMOTE_LOG_STATUS.FAILED.ICON, REMOTE_LOG_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }
        this.setOnLogStopUIStatus();
    }

    /**
     * 
     * Initial event listener.
     * 
     */
    initialEventListener() {

        // Start button.
        const startFn = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.onLogStartButtonClick();
        };
        this.logStartButtonDOM.removeEventListener("click", startFn);
        this.logStartButtonDOM.addEventListener("click", startFn, false);

        // Stop button.
        const stopFn = () => { this.onLogStopButtonClick(); };
        this.logStopButtonDOM.removeEventListener("click", stopFn);
        this.logStopButtonDOM.addEventListener("click", stopFn, false);

        // Download button.
        const downloadFn = () => { this.onDownloadButtonClick(); };
        this.logDownloadButtonDOM.removeEventListener("click", downloadFn);
        this.logDownloadButtonDOM.addEventListener("click", downloadFn, false);

    }


    /**
     * 
     * On download button clicked event.
     * 
     */
    onDownloadButtonClick() {

        const pom = document.createElement("a");
        pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(logData));
        const date = new Date();
        const deviceUid = getSelectedDeviceSerialNumber();

        let fileName = `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${deviceUid}`;
        pom.setAttribute("download", fileName);

        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

    /**
     * Insert log text into log box.
     * @param {string} data Log string.
     */
    insertLogData(data = "") {

        try {
            if (this.logFilterDOM.classList.contains("d-none") === true) {

                const p = document.createElement("p");
                logData += data;

                // Break line
                if (data.search(this.newLineReplaceOption[newLineOptionValue]) !== -1) {


                    p.classList.add("log-text");
                    p.innerHTML = data;

                    p.innerHTML = data.replace(this.newLineReplaceOption[newLineOptionValue], "");
                    this.logBoxDOM.appendChild(p);
                }

                // No break line.
                else {

                    // If existing log in log box.
                    const logLength = document.querySelectorAll("#logBox > p").length;
                    if (logLength > 0) {
                        document.querySelectorAll("#logBox > p")[logLength - 1].innerHTML += data;
                    }
                    else {
                        this.logBoxDOM.appendChild(p);

                    }
                }


                // Make the scroll bar key keep the bottom of the window.
                this.logBoxDOM.scrollTop = this.logBoxDOM.scrollHeight;
            }
        }
        catch (error) {
            console.log(error);
        }
    }


}