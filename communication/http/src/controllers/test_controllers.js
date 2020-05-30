import {ServiceFacade} from "service_layer"
import {wrapHttp} from "./http_request_wrapper";

export async function test1(req,res) {
    const result = await wrapHttp(req, ServiceFacade.test1);
    return res.send(result)
}

export async function test2(req,res) {
    const result = await wrapHttp(req, ServiceFacade.test2);
    return res.send(result)
}

export async function test3(req,res) {
    const result = await wrapHttp(req, ServiceFacade.test3);
    return res.send(result)
}

export async function test4(req,res) {
    const result = await wrapHttp(req, ServiceFacade.test4);
    return res.send(result)
}

export async function test5(req,res) {
    const result = await wrapHttp(req, ServiceFacade.test5);
    return res.send(result)
}