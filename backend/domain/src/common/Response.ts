import { Error } from "./internal_api";
import {User} from "../user/User"

interface Response {
  data: any;
  error?: Error;
}


interface UserResponse extends Response {
  data: { user: User};
}


interface BoolResponse extends Response {
  data: { result: boolean };
}
export { Response,BoolResponse };
