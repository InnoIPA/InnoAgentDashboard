import Swal from "sweetalert2";

// Pages.
import gpioOutputAlertPage from "../../html/pages/gpioOutputAlert.html";

import GpioPinsHandler from "../library/gpioPinsHandler";

// import BoardConfigButtonComponent from "../components/device/boardConfigButton.component";


export class AlertUtils {

    /**
     * questionAlert
     * This function will generator question alert message.
     * @param  operation operation is operation.
     */
    async questionAlert(operation = "recovery") {
        const alert = await Swal.fire({
            icon: "question",
            title: "Are you sure?",
            text: `If you want to ${operation}, press the OK button.`,
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off"
            }
        });
        return alert;
    }

    /**
      * customQuestion
      * This function will generator custom question alert message.
      * @param  operation operation is operation.
      */
    async customQuestionAlert(icon, title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon,
            title,
            text,
            showCancelButton,
            confirmButtonColor: "#20CCAC",
            inputPlaceholder: "Enter your password",
            inputValue: "password",
            inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off"
            }
        });
        return alert;
    }

    /**
     * infoAlert
     * This function will generator info alert message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async infoAlert(title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon: "info",
            title: title,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#20CCAC",
            timer: 5000,
            timerProgressBar: true,
        });
        return alert;
    }

    /**
     * successAlert
     * This function will generator success alert message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async successAlert(title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon: "success",
            title: title,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#20CCAC",
        });
        return alert;
    }

    /**
     * progressCompleteAlert
     * This function will generator success alert message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async progressCompleteAlert(title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon: "success",
            title: title,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#20CCAC",
            timer: 5000,
            timerProgressBar: true,
        })
            // Reserve
            .then(() => {

            });
        return alert;
    }

    /**
     * warningAlert
     * This function will generator warning error message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async warningAlert(title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon: "warning",
            title: title,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#20CCAC",
        });
        return alert;
    }

    /**
     * errorAlert
     * This function will generator success error message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async errorAlert(title, text, showCancelButton = false) {
        const alert = await Swal.fire({
            icon: "error",
            title: title,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#20CCAC",
        });
        return alert;
    }
    /**
     * dangersAlert
     * This function will generator dangers question message.
     * @param  title title is alert title.
     * @param  text text is alert text.
     * @param  showCancelButton set show cancel button, default value is "false".
     */
    async dangersAlert(operation = "quick erase") {
        const alert = await Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: `${operation} operation may void all your data on the selected disk, if you want to continue, please enter your password.`,
            input: "password",
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            inputPlaceholder: "Enter your password",
            inputValue: "password",
            inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off"
            }
        });
        return alert;
    }

    async functionTestAlert() {
        const alert = await Swal.fire({
            icon: "question",
            title: "停止測試?",
            text: "若要停止測試，請按下'是'按鈕，測試記錄將會自動保存",
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            confirmButtonText: "是",
            cancelButtonText: "否"

        });
        return alert;
    }

    mixinAlert(icon, title, { showConfirmButton, timer, timerProgressBar }) {
        // If optional option is null, set the default value.
        if (!showConfirmButton) showConfirmButton = false;
        if (!timer) timer = 3 * 1000;
        if (!timerProgressBar) timerProgressBar = true;


        const toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton,
            timer,
            timerProgressBar,
            onOpen: (toast) => {
                toast.addEventListener("mouseenter", alertObj.stopTimer);
                toast.addEventListener("mouseleave", alertObj.resumeTimer);
            }
        });

        toast.fire({
            icon,
            title
        });
        return toast;
    }

    async gpioOutputAlert(title = "Power switch") {
        const gpioPinsHandler = new GpioPinsHandler();
        const alert = await Swal.fire({
            icon: "info",
            title,
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            html: gpioOutputAlertPage,
            onBeforeOpen: async () => {
                // Get available gpio pins.
                await gpioPinsHandler.getAvailableGPIOPins("OUTPUT");

                // Set default selected option.
                (title === "Power switch")
                    ? document.querySelector("#pin-name").value = "INNO_GPIO_OUTPUT1"
                    : document.querySelector("#pin-name").value = "INNO_GPIO_OUTPUT2";
            },
            preConfirm: () => {
                const inputPayload = {
                    name: String(document.querySelector("#pin-name").value),
                    value: String(document.querySelector("#level").value),
                    interval: Number(document.querySelector("#interval").value)
                };
                return inputPayload;
            }
        });
        return alert;
    }


    async gpioButtonAlert() {
        const gpioPinsHandler = new GpioPinsHandler();
        const alert = await Swal.fire({
            icon: "info",
            title: "GPIO",
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            html: gpioOutputAlertPage,
            allowOutsideClick: () => !Swal.isLoading(),
            onBeforeOpen: async () => {
                await gpioPinsHandler.getAvailableGPIOPins("OTHER");
            },
            preConfirm: () => {
                const selectValue = document.querySelector("#pin-name").value;
                if ((selectValue === null) || (selectValue === "-1")) {
                    alertObj.showValidationMessage("Please select a GPIO pins!");
                }

                const inputPayload = {
                    name: String(document.querySelector("#pin-name").value),
                    value: String(document.querySelector("#level").value),
                    interval: Number(document.querySelector("#interval").value)
                };
                return inputPayload;
            }
        });
        return alert;
    }


    // async setBoardConfigAlert() {
    //     const boardConfigButtonComponent = new BoardConfigButtonComponent();
    //     const alert = await Swal.fire({
    //         showCancelButton: true,
    //         confirmButtonColor: "#20CCAC",
    //         customClass: { popup: "backup-alert-lg-width", content: "text-left mt-2 mb-5 container-fluid" },
    //         confirmButtonText: "Submit",
    //         showCloseButton: true,
    //         html: updateDeviceConfigAlert,
    //         width: "70%",
    //         allowOutsideClick: () => !Swal.isLoading(),
    //         onOpen: async () => {
    //             await boardConfigButtonComponent.alertOnOpen();
    //         },
    //         preConfirm: () => {
    //             const result = boardConfigButtonComponent.alertOnClickSubmitButtonEvent();
    //             // TODO: validate.


    //             if (!result["NETWORK_TYPE"] || !result["SERVER_USERNAME"] || !result["SERVER_PASSWORD"] || !result["SERVER_IP"] || !result["SERVER_PORT"]) {
    //                 alertObj.showValidationMessage("Some required felid is empty!");
    //                 return null;
    //             }
    //             return result;
    //         },
    //         onClose: () => {
    //             boardConfigButtonComponent.DHCPModeButtonOnClickEventListener();
    //         }
    //     });
    //     return alert;
    // }

    async htmlAlert({ html, onBeforeOpen = undefined, onOpen = undefined, preConfirm = undefined, onClose = undefined, onAfterClose = undefined, width = "50%", confirmButtonText = "OK" }) {
        return await Swal.fire({
            showCancelButton: true,
            confirmButtonColor: "#20CCAC",
            width,
            customClass: { popup: "", content: "text-left mt-2 mb-5 container-fluid" },
            confirmButtonText,
            showCloseButton: true,
            html,
            allowOutsideClick: () => !Swal.isLoading(),
            onOpen,
            onBeforeOpen,
            preConfirm,
            onClose,
            onAfterClose
        });
    }
}

export const alertUtils = new AlertUtils();
export const alertObj = Swal;

