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
    const response = ServiceFacade.registerUser(this.wrapWithToken(reqCred));
    return response.error
      ? { data: undefined, error: response.error }
      : { data: response.data };
  },
};
