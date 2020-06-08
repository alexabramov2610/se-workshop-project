import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */
export async function register(req,res) {
    const result = wrapHttp(req, ServiceFacade.registerUser);
    return res.send(result);
}

export async function login(req,res) {
    const result = wrapHttp(req, ServiceFacade.loginUser);
    return res.send(result);
}

export async function logout(req,res) {
    const result = wrapHttp(req, ServiceFacade.logoutUser);
    return res.send(result)
}

export async function saveProductToCart(req,res) {
    const result = wrapHttp(req, ServiceFacade.saveProductToCart);
    return res.send(result);
}

export async function removeProductFromCart(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeProductFromCart);
    return res.send(result);
}


// get

export async function viewCart(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewCart);
    return res.send(result);
}

export async function personalDetails(req,res) {
    const result = wrapHttp(req, ServiceFacade.getPersonalDetails);
    return res.send(result);
}

export async function viewRegisteredUserPurchasesHistory(req, res) {
    try {
        const getUserPurchasesHistory = {body: {userName: req.query.username}, token: req.cookies['token']};
        req.body = getUserPurchasesHistory;
        const result = wrapHttp(req, ServiceFacade.viewRegisteredUserPurchasesHistory);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

