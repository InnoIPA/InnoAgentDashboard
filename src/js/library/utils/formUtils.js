import { deepCopy } from "./deepCopy";

// Parse value to specified type library.
import { parseValueToType } from "../../library/utils/parseValueToType";

/**
 * Convert all fields in the specified <form> tag to a JSON object.
 * @param {HTMLElement} formData The specified <form> tag DOM element.
 * @returns {string} The JSON string.
 */
export const formToJSON = (formData) => {


    const data = new FormData(formData);

    const formDataObject = Object.fromEntries(data.entries());

    Object.keys(formDataObject).forEach(value => {
        formDataObject[value] = parseValueToType(formDataObject[value], "boolean");
        
    });

    return formDataObject;
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


        
        // Checkbox
        if (element.type === "checkbox") {
            element.value = dataCopyObject[element.name];
            if (dataCopyObject[element.name]) {
                
                element.checked = "checked";
            }
            else {
                element.checked = "";
            }
        }

        // Checkbox default value.
        if (element.type === "hidden") {
            element.value = "false";
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