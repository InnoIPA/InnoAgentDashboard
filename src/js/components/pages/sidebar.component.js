import { pageLoadingAnimate } from "../../library/pageLoadingAnimateEffect";
import { dashboardSettingInitial } from "../pages/dashboardSetting.component";
export const sidebarInit = () => {

    const doc = document;
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
    sideInnoAgent.addEventListener("click", () => {
        pageLoadingAnimate({ type: "loading" });
        deviceOperationContainer.classList = "";
        dashboardSettingContainer.classList = "d-none";


        sideInnoAgent.classList = "hover";
        sideSetting.classList = "";

        pageLoadingAnimate({ type: "stop" });
    }, false);

    // Dashboard setting tab.
    sideSetting.addEventListener("click", async () => {
        pageLoadingAnimate({ type: "loading" });

        deviceOperationContainer.classList = "d-none";
        dashboardSettingContainer.classList = "";
       
        await dashboardSettingInitial();


        sideInnoAgent.classList = "";
        sideSetting.classList = "hover";

        pageLoadingAnimate({ type: "stop" });
    }, false);

};