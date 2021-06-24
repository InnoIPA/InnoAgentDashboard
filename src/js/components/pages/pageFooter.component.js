/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Page footer component.
 * This component is a page footer component that controls page copyright text and web service version text display appearance and related function.
 * 
 * 
 */

// API library.
import { apiHandler } from "../../library/APILibrary";

// Copyright text.
import { copyrightText } from "../../applicationConstants";
export default class PageFooterComponent {
    constructor() {
        // API library.
        this.apiHandler = apiHandler;

        this.getRequireDOMElements();

        // Get dashboard version. (define at package.json)
        this.dashboardVersion = DASHBOARD_VERSION;
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        // Page footer DOM element.
        this.copyrightDOM = document.querySelector("#copyright-section");

        // The web service version & dashboard version DOM element.
        this.serviceVersionDOM = document.querySelector("#service-version");
        this.dashboardVersionDOM = document.querySelector("#dashboard-version");
    }

    /**
     * Set the copyright text.
     * @param {string} text The copyright text to be set as page footer.
     */
    setCopyrightText(text) {

        // If the copyright text params are empty, using the default text.
        if (text.length <= 0 || text === "undefined" || text === null) {
            text = copyrightText;
        }

        this.copyrightDOM.innerHTML = text;
    }

    /**
     * Get the web service version from the web service version API.
     * 
     */
    async getWebServiceVersion() {
        const response = await this.apiHandler.webServiceVersionAPI();
        this.setVersionText(response);
    }

    /**
     * Set the version number to the target DOM element.
     * @param {string} serviceVersion The web service version text.
     */
    setVersionText(serviceVersion) {
        this.serviceVersionDOM.innerHTML = serviceVersion;
        this.dashboardVersionDOM.innerHTML = this.dashboardVersion;
    }
}