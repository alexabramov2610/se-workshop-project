import {ServiceFacade} from "service_layer"
import {wrapHttp} from "./http_request_wrapper";

export async function test1(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.test1);
    return res.send(result)
}

export async function test2(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.test2);
    return res.send(result)
}