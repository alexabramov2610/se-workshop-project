import { Error } from "./internal_api";
import {User} from "../user/User"

interface Response {
  data: any;
  error?: Error;
}



interface ConnectResponse extends Response {
  data: { name: string , isConnected: boolean };
}

interface UserResponse extends Response {
  data: { user: User};
}


interface BoolResponse extends Response {
  data: { result: boolean };
}
export { Response,ConnectResponse,BoolResponse };
