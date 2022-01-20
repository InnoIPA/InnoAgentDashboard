import { deepCopy } from "./deepCopy";

/**
 * Convert all fields in the specified <form> tag to a JSON object.
 * @param {HTMLElement} formData The specified <form> tag DOM element.
 * @returns {string} The JSON string.
 */
export const formToJSON = (formData) => {

    const data = new FormData(formData);
    const value = Object.fromEntries(data.entries());
    return value;
};

/**
 * Insert JSON object to specified <form> tag DOM elements.
 * @param {HTMLElement} formData The specified <form> tag DOM element.
 * @param {object} data The JSON object will insert into the specified <form> tag DOM elements.
 */
export const JSONToForm = (formData, data, ignoreKeys = []) => {

    // Check if the input is valid.
    if (!formData || !data) return;

    const dataCopyObject = deepCopy(data);

    // Remove ignore items from ignore key list.
    ignoreKeys.map((value) => {
        if (data[value] !== "undefined") {
            delete dataCopyObject[value];
        }

    });

    // Insert json into HTML form.
    Array.from(formData).map((element) => {

        if (element.type !== "submit") {
            element.value = dataCopyObject[element.name];
        }

        // Boolean & radio button.
        if (((element.type === "checkbox") || (element.type === "radio"))) {
            (dataCopyObject[element.name] === true)
                ? element.setAttribute("checked", "checked")
                : element.setAttribute("checked", "");
        }

        // Options.
        if (element.type === "select-one") {
            for (const i of element.options) {
                if (i.innerHTML === dataCopyObject[element.name]) {
                    i.setAttribute("selected", "selected");
                }
            }
        }

    });

    return formData;
};