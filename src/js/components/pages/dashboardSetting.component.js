import { apiHandler } from "../../library/APILibrary";
import { alertUtils } from "../../library/alertUtils";
import { formToJSON, JSONToForm } from "../../library/utils/formUtils";
// import { getDashboardDefaultConfiguration, GET_DASHBOARD_CONFIGURATION_STATUS, SETUP_DASHBOARD_CONFIGURATION_ALERT, SETUP_DASHBOARD_CONFIGURATION_STATUS, RESET_DASHBOARD_CONFIGURATION_ALERT, RESET_DASHBOARD_CONFIGURATION_STATUS, getDefaultWebServiceUrl } from "../../applicationConstants";
import { getDashboardDefaultConfiguration, SETUP_DASHBOARD_CONFIGURATION_ALERT, SETUP_DASHBOARD_CONFIGURATION_STATUS, RESET_DASHBOARD_CONFIGURATION_ALERT, RESET_DASHBOARD_CONFIGURATION_STATUS } from "../../applicationConstants";
import { setDashboardConfiguration, getDashboardConfiguration } from "../../sharedVariable";

import { reloadAll } from "../../../index";

export default class DashboardSettingHandler {
    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.dashboardSettingFormDOM = document.querySelector("#dashboard-setting");
        this.dashboardSettingSubmitButtonDOM = document.querySelector("#dashboardSettingSubmitButton");
        this.dashboardSettingResetAsDefaultButtonDOM = document.querySelector("#reset-default-link");
    }

    /**
     * Initial button listener.
     * 
     */
    initialEventListener() {

        const resetButtonFn = (event) => {
            event.preventDefault();
            this.onResetAsDefaultButtonClick();
        };

        this.dashboardSettingResetAsDefaultButtonDOM.removeEventListener("click", resetButtonFn);
        this.dashboardSettingResetAsDefaultButtonDOM.addEventListener("click", resetButtonFn, false);


        // Form validator.

        const formValidatorFn = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.dashboardSettingFormDOM.checkValidity() === false) {
                this.dashboardSettingFormDOM.classList.add("was-validated");
                return;
            }
            this.dashboardSettingFormDOM.classList.add("was-validated");
            setTimeout(this.onSubmitButtonClick.bind(this), 250);
        };
        this.dashboardSettingFormDOM.addEventListener("submit", formValidatorFn, false);


    }

    resetValidatorStatus() {
        this.dashboardSettingFormDOM.classList.remove("was-validated");
    }

    /**
     * Fetch the dashboard setting from server.
     * @returns {object} Dashboard setting.
     */
    async fetchDashboardSetting() {
        const response = await apiHandler.getDashboardConfigAPI();
        if (!response) {
            // alertUtils.mixinAlert(GET_DASHBOARD_CONFIGURATION_STATUS.FAILED.ICON, GET_DASHBOARD_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
            return getDashboardConfiguration();
        }
        return response;
    }

    /**
     * On dashboard page loading.
     */
    async onPageShow() {
        const response = await this.fetchDashboardSetting();
        setDashboardConfiguration(response);
        JSONToForm(this.dashboardSettingFormDOM, response, ["configId"]);
    }

    /**
     * On dashboard setting submit button clicked.
     * 
     */
    async onSubmitButtonClick() {


        const alert = await alertUtils.customQuestionAlert(SETUP_DASHBOARD_CONFIGURATION_ALERT.ICON, SETUP_DASHBOARD_CONFIGURATION_ALERT.TITLE, SETUP_DASHBOARD_CONFIGURATION_ALERT.MESSAGE, true);

        // Press OK button.
        if (alert.isConfirmed) {
            await this.applyDashboardSetting();
            // Reload entire dashboard.
            await reloadAll();
        }


        if (alert.dismiss) return alertUtils.mixinAlert(SETUP_DASHBOARD_CONFIGURATION_STATUS.CANCEL.ICON, SETUP_DASHBOARD_CONFIGURATION_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

        console.log("Current dashboard config:", getDashboardConfiguration());
    }

    /**
     * On reset as default button clicked.
     */
    async onResetAsDefaultButtonClick() {
        // Insert the default setting to form.
        JSONToForm(this.dashboardSettingFormDOM, getDashboardDefaultConfiguration());
        const alert = await alertUtils.customQuestionAlert(RESET_DASHBOARD_CONFIGURATION_ALERT.ICON, RESET_DASHBOARD_CONFIGURATION_ALERT.TITLE, RESET_DASHBOARD_CONFIGURATION_ALERT.MESSAGE, true);

        // Press OK button.
        if (alert.isConfirmed) {
            await this.applyDashboardSetting();
            // Reload entire dashboard.
            await reloadAll();
        }


        if (alert.dismiss) return alertUtils.mixinAlert(RESET_DASHBOARD_CONFIGURATION_STATUS.CANCEL.ICON, RESET_DASHBOARD_CONFIGURATION_STATUS.CANCEL.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

    }


    /**
     * Apply the dashboard setting. 
     */
    async applyDashboardSetting() {
        const config = formToJSON(this.dashboardSettingFormDOM);

        // Modify the server address.
        apiHandler.setServerAddress(config.serverAddress);
        const result = await apiHandler.upsertDashboardConfigAPI(config);

        if (!result) {
            return alertUtils.mixinAlert(SETUP_DASHBOARD_CONFIGURATION_STATUS.FAILED.ICON, SETUP_DASHBOARD_CONFIGURATION_STATUS.FAILED.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });
        }

        alertUtils.mixinAlert(SETUP_DASHBOARD_CONFIGURATION_STATUS.SUCCESS.ICON, SETUP_DASHBOARD_CONFIGURATION_STATUS.SUCCESS.MESSAGE, { showConfirmButton: false, timer: 3 * 1000, timerProgressBar: true });

        setDashboardConfiguration(config);
        apiHandler.setServerAddress(config["serverAddress"]);
    }


}

export const dashboardSettingHandler = new DashboardSettingHandler();

export const dashboardSettingInitial = async () => {
    dashboardSettingHandler.getRequireDOMElements();
    dashboardSettingHandler.initialEventListener();
    dashboardSettingHandler.resetValidatorStatus();
    await dashboardSettingHandler.onPageShow();
};