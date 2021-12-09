// https://stackoverflow.com/a/58084885
export const compareObjects = (a, b) => {

    if (!a || !b) return;
    let s = (o) => Object.entries(o).sort().map(i => {
        if (i[1] instanceof Object) i[1] = s(i[1]);
        return i;
    });
    return JSON.stringify(s(a)) === JSON.stringify(s(b));
};
