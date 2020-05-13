import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{}'   http://localhost:4000/system/newtoken
 */
export async function startNewSession(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.startNewSession);
    return res.send(result)
}

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"firstAdminName": "tal", "firstAdminPassword": "taltal"}, "token": "1"}'   http://localhost:4000/system/init
 */
export async function systemInit(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.systemInit);
    return res.send(result)
}

export async function isLoggedIn(req, res) {
    const result = wrapHttp(req.body, ServiceFacade.isLoggedInUser);
    return res.send(result)
}





// get

export async function getIsSystemUp(req, res) {
    const result = wrapHttp(req, ServiceFacade.isSystemUp);
    return res.send(result)
}