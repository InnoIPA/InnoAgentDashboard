export const parseValueToType = (value, type) => {
    if (type === "boolean") {
        if (value === "true") {
            return true;
        }

        if (value === "false") {
            return false;
        }
    }

    if (type === "number") {
        if (!isNaN(value.trim())) {
            return parseInt(value);
        }
    }

    return value;
};