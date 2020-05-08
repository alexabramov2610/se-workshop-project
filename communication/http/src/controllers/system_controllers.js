import {ServiceFacade} from "service_layer"

/*
curl --header "Content-Type: application/json" --request POST --data '{}'   http://localhost:4000/system/newtoken
 */
export async function startNewSession(req,res) {
    const result =  ServiceFacade.startNewSession();
    return res.send(result)
}

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"firstAdminName": "tal", "firstAdminPassword": "taltal"}, "token": "1"}'   http://localhost:4000/system/init
 */
export async function systemInit(req,res) {
    const result =  ServiceFacade.systemInit(req.body);
    return res.send(result)
}

// export async function test(req,res) {
//     const result =  ServiceFacade.test(req.body);
//     return res.send(result)
// }