import * as Types from "../";
import * as Env from "../";
import {ServiceFacade} from "service_layer";
import * as DummyTypes from "../../__tests__/mocks/responses";


let token;
const wrapWithToken = (req: any) => {
    return {body: {...req}, token};
};

export const Adapter: Partial<Env.Bridge> = {

    setToken(sessionToken: string): void {
        token = sessionToken;
    },

    startSession() {
        const token: string = ServiceFacade.startNewSession();
        return {data: {token: token}};
    },

    init(credentials: Types.Credentials): DummyTypes.IResponse {
        const initReq = {firstAdminName: credentials.userName, firstAdminPassword: credentials.password};
        const {data, error} = ServiceFacade.systemInit(wrapWithToken(initReq));
        return error
            ? {data: undefined, error: error}
            : {data: data, error: undefined};
    },

    reset() {
        ServiceFacade.reset();
    },

    register(credentials: Types.Credentials): DummyTypes.IResponse {
        const reqCred = {
            username: credentials.userName,
            password: credentials.password,
        };
        const response = ServiceFacade.registerUser(wrapWithToken(reqCred));
        return response.error
            ? {data: undefined, error: response.error}
            : {data: response.data};
    },

    login(credentials: Types.Credentials): DummyTypes.IResponse {
        const reqCred = {
            username: credentials.userName,
            password: credentials.password,
        };
        const {data, error} = ServiceFacade.loginUser(wrapWithToken(reqCred));
        return error
            ? {data: undefined, error: error}
            : {data: data, error: undefined};
    },

    logout(userName: string): DummyTypes.IResponse {
        const {data, error} = ServiceFacade.logoutUser(
            wrapWithToken({username: userName})
        );
        return error
            ? {data: undefined, error: error}
            : {data: data, error: undefined};
    },

    createStore(store: Types.Store): DummyTypes.IStoreResponse {
        const req = wrapWithToken({storeName: store.name});
        const {error, data} = ServiceFacade.createStore(req);
        if (error || !data.result) return error;
        else if (data.result) return {data: {name: store.name}};
    },

};
