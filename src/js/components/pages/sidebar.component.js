import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";
import { dashboardSettingInitial } from "../pages/dashboardSetting.component";
import { getDashboardServiceStatus } from "../../sharedVariable";
export const sidebarInit = () => {

    const doc = document;
    const noDeviceContainer = doc.querySelector("#noDeviceContainer");
    const connectionErrorContainer = doc.querySelector("#connectionErrorContainer");
    const deviceOperationContainer = doc.querySelector("#deviceOperationContainer");
    const dashboardSettingContainer = doc.querySelector("#dashboardSettingContainer");
    const sideInnoAgent = doc.querySelector("#sideInnoAgent");
    const sideSetting = doc.querySelector("#sideSetting");

    // Set default display.
    deviceOperationContainer.classList = "";
    dashboardSettingContainer.classList = "d-none";
    sideInnoAgent.classList = "hover";
    sideSetting.classList = "";

    // InnoAgent tab.
    sideInnoAgent.addEventListener("click", async () => {
        pageLoadingAnimate({ type: "loading" });

        deviceOperationContainer.classList.remove("d-none");
        dashboardSettingContainer.classList.add("d-none");
        noDeviceContainer.classList.add("d-none");
        connectionErrorContainer.classList.add("d-none");

        const dashboardServiceStatusCode = (+getDashboardServiceStatus());

        if (dashboardServiceStatusCode === -1) {
            connectionErrorContainer.classList.remove("d-none");
            deviceOperationContainer.classList.add("d-none");
        }

        if (dashboardServiceStatusCode === 0) {
            noDeviceContainer.classList.remove("d-none");
            deviceOperationContainer.classList.add("d-none");
        }

        if (dashboardServiceStatusCode === 1) {
            deviceOperationContainer.classList.remove("d-none");
        }

        sideInnoAgent.classList = "hover";
        sideSetting.classList = "";

        pageLoadingAnimate({ type: "stop" });
    }, false);

    // Dashboard setting tab.
    sideSetting.addEventListener("click", async () => {
        pageLoadingAnimate({ type: "loading" });

        dashboardSettingContainer.classList.remove("d-none");

        deviceOperationContainer.classList.add("d-none");
        noDeviceContainer.classList.add("d-none");
        connectionErrorContainer.classList.add("d-none");


        await dashboardSettingInitial();


        sideInnoAgent.classList = "";
        sideSetting.classList = "hover";

        pageLoadingAnimate({ type: "stop" });
    }, false);

};