/**
 * © 2021 Innodisk Corporation. IPA Jacky
 * Page LED Indicator component.
 * This component is an LED indicator component that controls page LED indicator display.
 * 
 * 
 */

export default class LEDIndicatorComponent {

    constructor() {
        this.getRequireDOMElements();
    }

    /**
     * Get requirement DOMs.
     * 
     */
    getRequireDOMElements() {
        this.ledIndicator = document.querySelector("#deviceOnlineStatus");
        this.ledIndicatorTextLabel = document.querySelector("#deviceOnlineLabel");
    }

    /**
     * Set the LED indicator to red.
     */
    setLedRed() {
        // Set the LED indicator status.
        this.ledIndicator.classList.remove("led-success", "led-warning");
        this.ledIndicator.classList.add("led-danger");

        // Set the LED indicator text label.
        this.ledIndicatorTextLabel.innerHTML = "Offline";
    }

    /**
     * Set the LED indicator to green.
     */
    setLedGreen() {
        // Set the LED indicator status.
        this.ledIndicator.classList.remove("led-danger", "led-warning");
        this.ledIndicator.classList.add("led-success");

        // Set the LED indicator text label.
        this.ledIndicatorTextLabel.innerHTML = "Online";
    }

    /**
     * Set the LED indicator to yellow.
     */
    setLedWarning() {
        // Set the LED indicator status.
        this.ledIndicator.classList.remove("led-success", "led-danger");
        this.ledIndicator.classList.add("led-warning");

        // Set the LED indicator text label.
        this.ledIndicatorTextLabel.innerHTML = "Warning";
    }
}
