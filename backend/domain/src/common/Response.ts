import { Error } from "./internal_api";
import { User } from "../user/User";

interface Response {
  data: any;
  error?: Error;
}

interface RegisterResponse extends Response {
  data: { result: boolean };
}

interface LoginResponse extends Response {
  data: { result: boolean };
}
interface LogoutResponse extends Response {
  data: { result: boolean };
}





export { Response, RegisterResponse ,LoginResponse,LogoutResponse };
