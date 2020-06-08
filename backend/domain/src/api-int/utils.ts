export function formatString(str: string, placeholders: string[]) {
    // if (arguments.length === 0) {
    //     throw "No arguments";
    // }
    // const string = arguments[0];
    const lst = str.split("{}");
    // if (lst.length !== arguments.length) {
    //     throw "Placeholder format mismatched";
    // }
    let string2 = "";
    let off = 0;
    for (let i = 0; i < lst.length; i++) {
        if (off < placeholders.length) {
            string2 += lst[i] + placeholders[off++]
        } else {
            string2 += lst[i]
        }
    }
    return string2;
}


export function mapToJson(map) {
    return Array.from(map).reduce((acc, [key, val]) => Object.assign(acc, {[key]: val}), {});
}