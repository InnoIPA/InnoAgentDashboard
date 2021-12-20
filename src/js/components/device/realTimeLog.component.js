import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

let logData = "";
export default class RealTimeLogComponent {
    constructor() {
        this.getRequireDOMElements();
        // this.initialEventListener();
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

        // Log options.
        this.uartOptionDOM = document.querySelector("#logUARTOption");
        this.rs232OptionDOM = document.querySelector("#logRS232Option");
    }

    initialEventListener() {

        // Start button.
        const startFn = () => { this.onLogStartButtonClick(); };
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

    onLogStartButtonClick() {
        this.logFilterDOM.classList.add("d-none");
        this.logBoxDOM.innerHTML = "";

        this.logToolbarDOM.classList.remove("d-none");
    }

    onLogStopButtonClick() {
        this.logFilterDOM.classList.remove("d-none");
        this.logBoxDOM.innerHTML = "";

        this.logToolbarDOM.classList.add("d-none");

        logData = "";
    }

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


    insertLogData(data = "") {
        // Mock
        if (this.logFilterDOM.classList.contains("d-none") === true) {



            const p = document.createElement("p");
            p.classList.add("log-text");
            p.innerHTML = data;
            logData += data;

            if (((data.search(/\r\n/g) !== -1)) && ((data.search(/\r\n/g) !== -1))) {

                const p = document.createElement("p");
                p.classList.add("log-text");
                p.innerHTML = data;

                // Reserved.
                // const br = document.createElement("br");
                // p.innerHTML = data.replace(/\r\n/g, "<br/>").replace(/[\r\n]/g, "<br/>");

                p.innerHTML = data.replace(/\r\n/g, "").replace(/[\r\n]/g, "");
                document.querySelector("#logBox").appendChild(p);

                // Reserved.
                // document.querySelector("#logBox").appendChild(br);
            }
            else {
                const logLength = document.querySelectorAll("#logBox > p").length;
                if (logLength > 0) {
                    document.querySelectorAll("#logBox > p")[logLength - 1].innerHTML += data;
                }
                else {
                    document.querySelector("#logBox").appendChild(p);

                }
            }

        }
    }


}