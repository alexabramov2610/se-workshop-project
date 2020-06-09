import {ServiceFacade} from "service_layer"
import {wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */
export async function pay(req,res) {
    const result = await wrapHttp(req, ServiceFacade.pay);
    return res.send(result)
}

export async function deliver(req,res) {
    const result = await wrapHttp(req, ServiceFacade.deliver);
    return res.send(result)
}
