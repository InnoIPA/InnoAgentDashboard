export function sideBarInit() {

    let doc = document;
    let header = doc.querySelector("#header");
    let sideInnoAgent = doc.querySelector("#sideInnoAgent");
    let sideSetting = doc.querySelector("#sideSetting");
    let infoTabs = doc.querySelector("#device-info-tabs-section");


    infoTabs.style.display = "";


    sideInnoAgent.classList = "hover";
    sideSetting.classList = "d-none";

    sideInnoAgent.addEventListener("click", () => {
        location.reload();
        header.style.display = "";
        infoTabs.style.display = "";


        sideInnoAgent.classList = "hover";
    }, false);
}