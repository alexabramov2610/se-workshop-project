import {ServiceFacade} from "service_layer"

/*
curl --header "Content-Type: application/json" --request POST --data '{}'   http://localhost:4000/system/newtoken
 */
export async function startNewSession(req,res) {
    const request= req.body;
    const result =  ServiceFacade.startNewSession();
    return res.send(result)
}

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"firstAdminName": "tal", "firstAdminPassword": "taltal"}, "token": "1"}'   http://localhost:4000/system/init
 */
export async function systemInit(req,res) {
    const request= req.body;
    console.log(request)
    const result =  ServiceFacade.systemInit(request);
    return res.send(result)
}