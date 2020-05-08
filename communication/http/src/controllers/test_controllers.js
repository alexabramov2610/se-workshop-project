import {ServiceFacade} from "service_layer"

export async function test1(req,res) {
    const result =  ServiceFacade.test1();
    return res.send(result)
}

export async function test2(req,res) {
    const result =  ServiceFacade.test2();
    return res.send(result)
}