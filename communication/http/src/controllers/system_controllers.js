import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";


/*
curl --header "Content-Type: application/json" --request POST --data '{}'   http://localhost:4000/system/newtoken
 */


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

export async function startNewSession(req,res) {
    const result = wrapHttp(req, ServiceFacade.startNewSession);
    console.log(result);
    // res.setHeader('Set-Cookie', cookie.serialize('name', String(result), {
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 24 * 7 // 1 week
    // }));
    // res.set('Set-Cookie', `token=${result}`);

    res.cookie('token', result, {
        maxAge: 86400 * 1000, // 24 hours
        httpOnly: true, // http only, prevents JavaScript cookie access
        secure: false // cookie must be sent over https / ssl
    });

    return res.send(result)
}

export async function getIsSystemUp(req, res) {
    const result = wrapHttp(req, ServiceFacade.isSystemUp);
    return res.send(result)
}