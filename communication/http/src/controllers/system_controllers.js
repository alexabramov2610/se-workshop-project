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

export async function setPaymentSystem(req,res) {
    const result = await wrapHttp(req, ServiceFacade.setPaymentSystem);
    return res.send(result)
}
export async function setDeliverySystem(req,res) {
    const result = await wrapHttp(req, ServiceFacade.setDeliverySystem);
    return res.send(result)
}
// get



export async function isLoggedIn(req, res) {
    const result = await wrapHttp(req, ServiceFacade.isLoggedInUser);
    return res.send(result)
}

export async function startNewSession(req,res) {
    let token = undefined;

    if (req.cookies['token'] && req.cookies['token'].length > 0) {
        const verifyTokenRes = await ServiceFacade.verifyToken({token: req.cookies['token']});
        if (verifyTokenRes.data.result) {
            token = req.cookies['token']
        }
    }
    if(!token)
        token = await wrapHttp(req, ServiceFacade.startNewSession);

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000,
        expires: false
        // secure: true
    });
    return res.send(token)
}

export async function getIsSystemUp(req, res) {
    const result =await wrapHttp(req, ServiceFacade.isSystemUp);
    return res.send(result)
}

export async function getVisitorsStatistics(req, res) {
    try {
        const watchVisitorsInfoReq = {
            body: {from: new Date(req.query.from), to: new Date(req.query.to)},
            token: req.cookies['token']
        };
        req.body = watchVisitorsInfoReq;
        const result = await wrapHttp(req, ServiceFacade.watchVisitorsInfo);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function stopVisitorsStatistics(req, res) {
    const result =await wrapHttp(req, ServiceFacade.stopVisitorsStatistics);
    return res.send(result)
}
