export const invalidRes = { data: "", error: "invalid request" }

export const wrapHttp = (req, fn) => {
    try {
        const newReq = {body: req.body.body, token: req.cookies['token']};
        return fn.call(this, newReq);
    } catch (e) {
        console.log(e);
        return invalidRes;
    }
}