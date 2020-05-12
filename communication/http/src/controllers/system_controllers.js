import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"firstAdminName": "tal", "firstAdminPassword": "taltal"}, "token": "1"}'   http://localhost:4000/system/init
 */
export async function systemInit(req,res) {
    console.log('sys init')
    const result = wrapHttp(req, ServiceFacade.systemInit);
    return res.send(result)
}

export async function isLoggedIn(req, res) {
    const result = wrapHttp(req, ServiceFacade.isLoggedInUser);
    return res.send(result)
}





// get

export async function startNewSession(req,res) {
    const token = wrapHttp(req, ServiceFacade.startNewSession);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        secure: true
    });
    return res.send(token)
}

export async function getIsSystemUp(req, res) {
    const result = wrapHttp(req, ServiceFacade.isSystemUp);
    return res.send(result)
}