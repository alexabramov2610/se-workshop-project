import { Error } from "./internal_api";
import { User } from "../user/User";

interface Response {
  data: any;
  error?: Error;
}

interface RegisterResponse extends Response {
  data: { isAdded: boolean };
}

interface LoginResponse extends Response {
  data: { isLoggedIn: boolean };
}
interface LogoutResponse extends Response {
  data: { isLoggedout: boolean };
}





export { Response, RegisterResponse ,LoginResponse,LogoutResponse };
