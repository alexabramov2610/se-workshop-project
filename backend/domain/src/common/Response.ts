import { Error } from "./internal_api";
import { User } from "../user/User";

interface Response {
  data: any;
  error?: Error;
}

interface RegisterResponse extends Response {
  data: { isAdded: boolean };
}

export { Response, RegisterResponse };
