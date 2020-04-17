import * as Types from "../";
import * as Env from "../";
import { ServiceFacade } from "service_layer";

let token;
const wrapWithToken = (req: any) => {
  return { body: { ...req }, token: this._sessionToken };
};

const Adapter: Partial<Env.Bridge> = {
  setToken(token: string): void {
    token = token;
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
