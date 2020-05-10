const invalidRes = { data: "", error: "invalid request" }

export const wrapHttp = (req, fn) => {
    try {
        return fn.call(this, req);
    } catch (e) {
        return invalidRes;
    }
}