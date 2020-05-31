import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"firstAdminName": "tal", "firstAdminPassword": "taltal"}, "token": "1"}'   http://localhost:4000/system/init
 */
export async function systemInit(req,res) {
    const result = await wrapHttp(req, ServiceFacade.systemInit);
    return res.send(result)
}

export async function initFromFile(req,res) {
    const result = await wrapHttp(req, ServiceFacade.initFromFile);
    return res.send(result)
}





// get



export async function isLoggedIn(req, res) {
    const result = await wrapHttp(req, ServiceFacade.isLoggedInUser);
    return res.send(result)
}

export async function startNewSession(req,res) {
    let token;
    const verifyTokenRes = await ServiceFacade.verifyToken({ token: req.cookies['token'] });
    if (req.cookies['token'] && req.cookies['token'].length > 0 &&
        verifyTokenRes.data.result) {
        token = req.cookies['token']
    }
    else
        token = await wrapHttp(req, ServiceFacade.startNewSession);

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        // secure: true
    });
    return res.send(token)
}

export async function getIsSystemUp(req, res) {
    const result =await wrapHttp(req, ServiceFacade.isSystemUp);
    return res.send(result)
}