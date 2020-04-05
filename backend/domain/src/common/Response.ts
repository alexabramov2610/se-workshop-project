import { Error } from "./internal_api";
import {User} from "../user/User"

interface Response {
  data: any;
  error?: Error;
}

interface RegisterResponse extends Response {
  data: { isAdded: boolean };
}

interface ConnectResponse extends Response {
  data: { name: string , isConnected: boolean };
}

interface UserResponse extends Response {
  data: { user: User};
}

interface AssignResponse extends Response {
  data: { isAssigned: boolean };
}

export { Response, RegisterResponse,ConnectResponse,AssignResponse };
