/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Page LED Indicator handler.
 * This handler controls page LED indicator display.
 * 
 * 
 */

export default class LEDIndicatorHandler {

    /**
     * Set the specified LED indicator & text label status to offline.
     * @param {HTMLElement} led LED indicator element.
     * @param {HTMLElement} text Text label.
     */
    setLedRed(led, text) {

        if (!led || !text) return;
        // Set the specified DOMElement led indicator status.
        led.classList.remove("led-success", "led-warning");
        led.classList.add("led-danger");

        // Set the the specified DOMElement text label.
        text.innerHTML = "Offline";
    }

    /**
     * Set the specified LED indicator & text label status to online.
     * @param {HTMLElement} led LED indicator element.
     * @param {HTMLElement} text Text label.
     */
    setLedGreen(led, text) {
        if (!led || !text) return;

        // Set the specified DOMElement led indicator status.
        led.classList.remove("led-danger", "led-warning");
        led.classList.add("led-success");

        // Set the the specified DOMElement text label.
        text.innerHTML = "Online";
    }

    /**
     * Set the specified LED indicator & text label status to warning.
     * @param {HTMLElement} led LED indicator element.
     * @param {HTMLElement} text Text label.
     */
    setLedWarning(led, text) {

        if (!led || !text) return;
        // Set the specified DOMElement led indicator status.
        led.classList.remove("led-success", "led-danger");
        led.classList.add("led-warning");

        // Set the the specified DOMElement text label.
        text.innerHTML = "Warning";
    }
}
