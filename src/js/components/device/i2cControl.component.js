// API library.
import { apiHandler } from "../../library/APILibrary";

// Alert utils.
import { alertUtils } from "../../library/alertUtils";

// Constants.
import { I2C_CONTROL_C, I2C_CONTROL_STATUS } from "../../applicationConstants";

// Global variable.
import { getSelectedDeviceSerialNumber } from "../../sharedVariable";

export default class i2cControlComponent {
    constructor() {
        this.registerTableDom = new Array();

        this.getRequireDOMElements();
    }

    /**
    * Get requirement DOMs.
    * 
    */
    getRequireDOMElements() {
        this.i2cDetectButtonDOM         = document.querySelector("#i2cControlSettingDetect");
        this.i2cReadButtonDOM           = document.querySelector("#i2cControlSettingRead");
        this.i2cWriteButtonDOM          = document.querySelector("#i2cControlSettingWirte");
        this.i2cSlaveAddrSelectDOM      = document.querySelector("#i2cControlSlaveAddress");
        this.i2cRegisterHeadSelectDOM   = document.querySelector("#i2cControlRegisterHead");
        this.i2cRegisterLengthSelectDOM = document.querySelector("#i2cControlRegisterLength");
        this.i2cWriteIntervalSelectDOM  = document.querySelector("#i2cControlWriteInterval");
        this.i2cPecSelectDOM            = document.querySelector("#i2cControlPEC");

        this.guiInit();

        for(let i=0x00; i<=I2C_CONTROL_C.REG_MAX; i++) {
            let tdId = I2C_CONTROL_C.TD_HEAD + this.toHexStr(i, true);
            this.registerTableDom.push(document.getElementById(tdId));
            this.registerTableDom[i].style.backgroundColor = I2C_CONTROL_C.FOCUS_TABLE_BG_COLOR;
        }
    }

    /**
    * GUI init.
    * 
    */
    guiInit() {
        /* Register table */
        for(let i=0x00; i<=I2C_CONTROL_C.REG_MAX; i+=0x10) {
            let trId  = I2C_CONTROL_C.TR_HEAD + this.toHexStr(i, true);
            let trDom = document.getElementById(trId);

            for(let j=0x00; j<0x10; j++) {
                let tdId = I2C_CONTROL_C.TD_HEAD + this.toHexStr((i + j), true);
                let html = "<td id='" + tdId + "'></td>";

                trDom.innerHTML += html;
            }
        }

        /* Register head */
        for(let i=0x00; i<=I2C_CONTROL_C.REG_MAX; i++) {
            let opt = document.createElement('option');

            opt.innerHTML = I2C_CONTROL_C.HEX_HEAD + this.toHexStr(i, true);

            this.i2cRegisterHeadSelectDOM.appendChild(opt);
        }

        this.updateLength(true);
    }

    /**
    * Convert a decimal number to hex string.
    * 
    */
    toHexStr(value, fill_zero) {
        let hex = value.toString(16).toUpperCase();

        if ((fill_zero) && ((hex.length % 2) > 0)) {
            hex = "0" + hex;
        }

        return hex;
    }

    /**
    * Update register length option.
    * 
    */
    updateLength(isInit) {
        let currentIndex = (this.i2cRegisterLengthSelectDOM.selectedIndex);

        this.i2cRegisterLengthSelectDOM.options.length = 0;

        let currentHead = Number(this.i2cRegisterHeadSelectDOM.options[this.i2cRegisterHeadSelectDOM.selectedIndex].text);

        for(let i=1; i<=((I2C_CONTROL_C.REG_MAX+1)-currentHead); i++) {
            let opt = document.createElement('option');

            opt.innerHTML = i;

            this.i2cRegisterLengthSelectDOM.appendChild(opt);
        }

        if(isInit) {
            this.i2cRegisterLengthSelectDOM.selectedIndex = this.i2cRegisterLengthSelectDOM.options.length - 1;
        }

        if((currentIndex >= 0) && (currentIndex < this.i2cRegisterLengthSelectDOM.options.length)) {
            this.i2cRegisterLengthSelectDOM.selectedIndex = currentIndex;
        }

        this.updateInterval();
    }

    /**
    * Update write interval option.
    * 
    */
    updateInterval() {
        let currentIndex = (this.i2cWriteIntervalSelectDOM.selectedIndex);

        this.i2cWriteIntervalSelectDOM.options.length = 0;

        let currentLength = Number(this.i2cRegisterLengthSelectDOM.options[this.i2cRegisterLengthSelectDOM.selectedIndex].text);

        for(let i=1; i<=(I2C_CONTROL_C.DEVICE_TIMEOUT/currentLength); i++) {
            let opt = document.createElement('option');

            opt.innerHTML = i;

            this.i2cWriteIntervalSelectDOM.appendChild(opt);
        }
        
        if((currentIndex >= 0) && (currentIndex < this.i2cWriteIntervalSelectDOM.options.length)) {
            this.i2cWriteIntervalSelectDOM.selectedIndex = currentIndex;
        }
    }

    /**
    * Update register table.
    * 
    */
    updateTable() {
        let currentHead   = Number(this.i2cRegisterHeadSelectDOM.options[this.i2cRegisterHeadSelectDOM.selectedIndex].text);
        let currentLength = Number(this.i2cRegisterLengthSelectDOM.options[this.i2cRegisterLengthSelectDOM.selectedIndex].text);

        for(let i=0x00; i<=I2C_CONTROL_C.REG_MAX; i++) {
            this.registerTableDom[i].innerHTML = "";

            if((i >= currentHead) && (i < (currentHead + currentLength))) {
                this.registerTableDom[i].style.backgroundColor = I2C_CONTROL_C.FOCUS_TABLE_BG_COLOR;
            }
            else {
                this.registerTableDom[i].style.backgroundColor = "";
            }
        }
    }

    /**
     * 
     * I2C Detect button clicked event.
     * 
     */
    async i2cDetectButtonClick() {
        this.i2cSlaveAddrSelectDOM.options.length = 0;

        const response = await apiHandler.i2cDetectAPI(getSelectedDeviceSerialNumber());

        if (!response) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.FAILED.ICON, I2C_CONTROL_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }
        
        let result = response.result.split(I2C_CONTROL_C.DETECT_RET_SPLIT);

        for(let i=0; i<response.number; i++) {
            if(result[i].includes(I2C_CONTROL_C.DETECT_RET_ECHO))
            {
                let opt = document.createElement('option');

                opt.innerHTML = result[i].replace(I2C_CONTROL_C.DETECT_RET_ECHO, "");

                this.i2cSlaveAddrSelectDOM.appendChild(opt);
            }
        }
    }

    /**
     * 
     * I2C Read button clicked event.
     * 
     */
    async i2cReadButtonClick() {
        if((this.i2cSlaveAddrSelectDOM.selectedIndex      < 0) || (this.i2cRegisterHeadSelectDOM.selectedIndex < 0) ||
           (this.i2cRegisterLengthSelectDOM.selectedIndex < 0) || (this.i2cPecSelectDOM.selectedIndex          < 0)) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.EMPTY.ICON, I2C_CONTROL_STATUS.EMPTY.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        let currentSlave    = Number(this.i2cSlaveAddrSelectDOM.options[this.i2cSlaveAddrSelectDOM.selectedIndex].text);
        let currentHead     = Number(this.i2cRegisterHeadSelectDOM.options[this.i2cRegisterHeadSelectDOM.selectedIndex].text);
        let currentLength   = Number(this.i2cRegisterLengthSelectDOM.options[this.i2cRegisterLengthSelectDOM.selectedIndex].text);
        let currentPec      = (this.i2cPecSelectDOM.options[this.i2cPecSelectDOM.selectedIndex].text == "True") ? 1 : 0;

        const params = {
            slaveAddr: currentSlave,
            regHead  : currentHead,
            length   : currentLength,
            PEC      : currentPec
        };
        const response = await apiHandler.i2cReadAPI(getSelectedDeviceSerialNumber(), params);

        if (!response) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.FAILED.ICON, I2C_CONTROL_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        let ret    = response.ret;
        let buffer = response.buffer.replace(I2C_CONTROL_C.HEX_HEAD, "");

        if(ret) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.DEVICE.ICON, I2C_CONTROL_STATUS.DEVICE.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        for(let i=0; i<(buffer.length/2); i++) {
            this.registerTableDom[currentHead + i].innerHTML = buffer.substr(2 * i, 2);
        }
    }

    /**
     * 
     * I2C Write button clicked event.
     * 
     */
     async i2cWriteButtonClick() {
        if((this.i2cSlaveAddrSelectDOM.selectedIndex      < 0) || (this.i2cRegisterHeadSelectDOM.selectedIndex < 0) || (this.i2cRegisterLengthSelectDOM.selectedIndex < 0) ||
           (this.i2cWriteIntervalSelectDOM.selectedIndex  < 0) || (this.i2cPecSelectDOM.selectedIndex          < 0)) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.EMPTY.ICON, I2C_CONTROL_STATUS.EMPTY.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        let currentSlave    = Number(this.i2cSlaveAddrSelectDOM.options[this.i2cSlaveAddrSelectDOM.selectedIndex].text);
        let currentHead     = Number(this.i2cRegisterHeadSelectDOM.options[this.i2cRegisterHeadSelectDOM.selectedIndex].text);
        let currentLength   = Number(this.i2cRegisterLengthSelectDOM.options[this.i2cRegisterLengthSelectDOM.selectedIndex].text);
        let currentInterval = Number(this.i2cWriteIntervalSelectDOM.options[this.i2cWriteIntervalSelectDOM.selectedIndex].text);
        let currentPec      = (this.i2cPecSelectDOM.options[this.i2cPecSelectDOM.selectedIndex].text == "True") ? 1 : 0;
        let currentBuffer   = I2C_CONTROL_C.HEX_HEAD;

        const regex = /[A-F0-9]/gi;

        for(let i=currentHead; i<(currentHead+currentLength); i++) {
            let origin = this.registerTableDom[i].innerHTML.replace(/\&nbsp;| /g, "");
            let target = ['0', '0'];

            if(origin.length) {
                origin = origin.substr(0, 2);
                origin = origin.match(regex);

                if(origin != null) {
                    if(origin.length == 1) {
                        target[1] = origin[0].toUpperCase();
                    }
                    else if(origin.length == 2) {
                        target[0] = origin[0].toUpperCase();
                        target[1] = origin[1].toUpperCase();
                    }
                }
            }

            currentBuffer += target[0] + target[1];

            this.registerTableDom[i].innerHTML = target[0] + target[1];
        }

        const params = {
            slaveAddr: currentSlave,
            regHead  : currentHead,
            length   : currentLength,
            PEC      : currentPec,
            interval : currentInterval,
            buffer   : currentBuffer
        };

        const response = await apiHandler.i2cWriteAPI(getSelectedDeviceSerialNumber(), params);

        if (!response) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.FAILED.ICON, I2C_CONTROL_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        let ret = response.ret;

        if(ret) {
            return alertUtils.mixinAlert(I2C_CONTROL_STATUS.DEVICE.ICON, I2C_CONTROL_STATUS.DEVICE.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }
    }

    /**
     * 
     * Initial event listener.
     * 
     */
    initialEventListener() {

        /* Detect button */
        const i2cDetectCb = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.i2cDetectButtonClick();
        };

        this.i2cDetectButtonDOM.removeEventListener("click", i2cDetectCb);
        this.i2cDetectButtonDOM.addEventListener("click", i2cDetectCb, false);

        /* Read button */
        const i2cReadCb = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.i2cReadButtonClick();
        };

        this.i2cReadButtonDOM.removeEventListener("click", i2cReadCb);
        this.i2cReadButtonDOM.addEventListener("click", i2cReadCb, false);

        /* Write button */
        const i2cWriteCb = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.i2cWriteButtonClick();
        };

        this.i2cWriteButtonDOM.removeEventListener("click", i2cWriteCb);
        this.i2cWriteButtonDOM.addEventListener("click", i2cWriteCb, false);

        /* Register head select */
        const i2cHeadSelectCb = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.updateLength(false);
            this.updateTable();
        };

        this.i2cRegisterHeadSelectDOM.removeEventListener("change", i2cHeadSelectCb);
        this.i2cRegisterHeadSelectDOM.addEventListener("change", i2cHeadSelectCb, false);

        /* Register head select */
        const i2cLengthSelectCb = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.updateInterval();
            this.updateTable();
        };

        this.i2cRegisterLengthSelectDOM.removeEventListener("change", i2cLengthSelectCb);
        this.i2cRegisterLengthSelectDOM.addEventListener("change", i2cLengthSelectCb, false);
    }
}