// import moment from "moment";
import { AlertUtils } from "../library/alertUtils";
import moment from "moment";

export class FunctionTestHandler {
    constructor() {
        // Document selector.
        this.doc = document;

        // Device index group button.
        this.devIndexGroup = this.doc.querySelector("#devIndexGroup");

        // Function test selection.
        this.functionTestSection = this.doc.querySelector("#function-test-section");

        // Success count label.
        this.connectionSuccess = this.doc.querySelector("#connection-success");

        // Failed count label.
        this.connectionFailed = this.doc.querySelector("#connection-failed");

        // Fail rates.
        this.failRate = this.doc.querySelector("#fail-rates");

        // Start time.
        this.functionTestStartTime = this.doc.querySelector("#function-test-start-time");

        // Start connection test button.
        this.connectionTestStartButton = this.doc.querySelector("#connection-test");

        // Stop connection test button
        this.stopFunctionTestButton = this.doc.querySelector("#stop-function-test");

        // Connection test log button.
        this.connectionTestLogButton = this.doc.querySelector("#connection-test-log");

        // Recovery log.
        this.recoveryLogButton = this.doc.querySelector("#recovery-log");

        // Sweetalert2 alert.
        this.alertUtils = new AlertUtils();

        // Log
        this.logContent = {};

        // Local storage
        this.logStorage = window.localStorage;

        this.initialFunctionTestButtons();

        // Download log interval.
        this.downloadTimer = null;

        // Download time
        this.downloadTimerInterval = 86400 * 1000;

    }

    /**
     * Initial the connection test counter.
     */
    initialCounter() {
        // Reset counter.
        this.isSuccessfulCount = 0;
        this.isFailCount = 0;

        // Clear html element.
        this.connectionSuccess.innerHTML = "成功: 0次";
        this.connectionFailed.innerHTML = "失敗: 0次";
        this.failRate.innerHTML = "掉線率: 0%";
    }

    download() {
        this.logContent = {
            DeviceId: this.doc.querySelector("#serial-number").innerHTML,
            StartTime: this.functionTestStartTime.innerHTML,
            EndTime: moment().format("L LTS"),
            SuccessfulCount: this.isSuccessfulCount,
            FailCount: this.isFailCount,
            DeadTime: this.connectionFailLogData
        };

        const pom = document.createElement("a");
        pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logContent)));
        const date = new Date();
        let fileName = `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${this.doc.querySelector("#serial-number").innerHTML}`;
        pom.setAttribute("download", fileName);

        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

    initialFunctionTestButtons() {
        // Start connection test
        const startFunction = () => {
            this.start();
        };

        this.connectionTestStartButton.removeEventListener("click", startFunction);
        this.connectionTestStartButton.addEventListener("click", startFunction, false);

        // Stop connection test.
        const stopFunction = async () => {
            const result = await this.alertUtils.functionTestAlert();
            if (result.value) {
                this.stop();
                this.download();
            }
        };
        this.stopFunctionTestButton.removeEventListener("click", stopFunction);
        this.stopFunctionTestButton.addEventListener("click", stopFunction, false);

    }


    /**
     * Start connection test.
     */
    start() {
        // Reset the counter.
        this.initialCounter();

        // Start the counter.
        this.isStart = true;

        // Hidden device select button group.
        this.devIndexGroup.style.display = "none";

        // Show the function test section.
        this.functionTestSection.style = "display:block";
        this.functionTestStartTime.innerHTML = moment().format("L LTS");

        // Connection fail log data.
        this.connectionFailLogData = [];

        // Interval download
        this.downloadLogInterval();

        // Get connection status result.
        document.axiosSuccess = ({ url, response }) => {

            if (+response === 1) {
                this.isSuccessfulCount++;
                this.connectionSuccess.innerHTML = `成功: ${this.isSuccessfulCount}次`;
            }
            else {
                this.isFailCount++;
                this.connectionFailLogData.push(moment().format("L LTS"));
                this.connectionFailed.innerHTML = `失敗: ${this.isFailCount}次`;
            }

            // Calculate fail rates, calculated by this formula: failed/(success+failed)*100)
            this.failRate.innerHTML = `掉線率: ${(this.isFailCount / (this.isSuccessfulCount + this.isFailCount) * 100).toFixed(2)}%`;
            console.log(`DateTime: ${moment().format("L LTS")}, isSuccessfulCount: ${this.isSuccessfulCount}`);
            console.log(`DateTime: ${moment().format("L LTS")}, isFailedCount: ${this.isFailCount}`);

            console.log(url, response);
        };
    }



    /**
     * Stop connection test.
     */
    stop() {

        // Stop the counter.
        this.isStart = false;

        // Show device select button group.
        this.devIndexGroup.style.display = "block";
        this.functionTestSection.style.display = "none";
    }


    saveLog(log) {
        this.logStorage.setItem(log.DeviceId, JSON.stringify(log));
        console.log(JSON.parse(this.logStorage.getItem(log.DeviceId)));

    }

    downloadLogInterval(time = this.downloadTimerInterval) {
        clearInterval(this.downloadTimer);
        return this.downloadTimer = setInterval(() => {
            this.download();
        }, time);
    }
}