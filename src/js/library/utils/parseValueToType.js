export const parseValueToType = (value, type) => {
    if (type === "boolean") return Boolean(value);
    if (type === "number") return Number(value);

    return value;
};