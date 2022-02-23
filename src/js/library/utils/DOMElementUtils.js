/**
 * 
 * 
 * DOM utils
 * 
 */



/**
 * Insert data into DOM elements.
 * @param {object} data The data to be insert into DOM element.
 * @param {object} DOMSelector The specified DOM element. 
 * 
 * 
 ** Usage:
 * 
 * 1. Set DOM element IDs with the same key name of the input data.
 * 
 * 2. All done!
 * 
 * Example: 
 * InputData: `{"KeyA":"123","KeyB":"456"}`
 * 
 * DOM elements: 
 * 
 * `<td id="KeyA"></td>`
 * `<td id="KeyB"></td>`
 * 
 * The result:
 * `<td id="KeyA">123</td>`
 * `<td id="KeyB">456</td>`
 */
export const insertDataIntoSpecificDOMElement = ({ data, DOMElement }) => {

    // If DOMElement is node list.
    if (typeof (DOMElement[Symbol.iterator]) === "function") {
        // Get input data keys.
        const dataKeys = Object.keys(data);

        // Insert data into DOM.
        for (let i = 0; i < DOMElement.length; i++) {
            if (dataKeys.includes(DOMElement[i].id)) {
                DOMElement[i].innerHTML = data[dataKeys[dataKeys.indexOf(DOMElement[i].id)]];
            }
        }
    }
};

/**
 * Set selected DOM element display status.
 * @param {object} DOMElement The specified DOM element.
 * @param {boolean} display The display status, it must be true or false.
 * 
 */
export const setSelectedDOMElementDisplayStatus = ({ DOMElement, display }) => {

    // If DOMElement is node list.
    if (typeof (DOMElement[Symbol.iterator]) === "function") {
        for (const i of DOMElement) {
            // Set default display status. (hidden)
            i.classList.add("d-none");

            // If display status equal to true
            if (display === true) {
                i.classList.remove("d-none");
            }
        }
    }

    // Otherwise.
    else {
        // Set default display status. (hidden)
        DOMElement.classList.add("d-none");

        // If display status equal to true
        if (display === true) {
            DOMElement.classList.remove("d-none");
        }
    }

};

