/**
 * Try parse input json string to object, if the string parse failed, will return the original value.
 * 
 * @param {string} str JSON string 
 * @returns Parsed object.
 */
export const tryParseJSONString = (str) => {
    try {
        // If str can be parse as JSON object, return the parsed object.
        return JSON.parse(String(str));
    } catch (e) {
        // If failed to parse as JSON object, return original string.
        return str;
    }
};