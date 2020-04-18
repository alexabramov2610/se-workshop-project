import * as Types from "../";
import * as Env from "../";
import { ServiceFacade } from "service_layer";

let token;
const wrapWithToken = (req: any) => {
  return { body: { ...req }, token };
};

export const Adapter: Partial<Env.Bridge> = {
  setToken(sessionToken: string): void {
    token = sessionToken;
  },
  register(credentials: Types.Credentials): Types.Response {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
    };
    const response = ServiceFacade.registerUser(wrapWithToken(reqCred));
    return response.error
      ? { data: undefined, error: response.error }
      : { data: response.data };
  },
  login(credentials: Types.Credentials): Types.Response {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
    };
    const { data, error } = ServiceFacade.loginUser(wrapWithToken(reqCred));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },
};
