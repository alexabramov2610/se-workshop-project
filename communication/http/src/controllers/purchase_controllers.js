import {ServiceFacade} from "service_layer"

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */
export async function pay(req,res) {
    const result = ServiceFacade.pay(req.body);
    return res.send(result)
}

export async function deliver(req,res) {
    const result = ServiceFacade.deliver(req.body);
    return res.send(result)
}
