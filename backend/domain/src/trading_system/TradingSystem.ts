import { UserManagement, User } from "../user/internal_api";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import { AssignResponse, ConnectResponse, RegisterResponse } from "../common/internal_api";

export class TradingSystem {
  private userManagement: UserManagement;
  private users: User[];
  private externalSystems: ExternalSystemsManager;

  constructor() {
    this.userManagement = new UserManagement();
        this.users = [];
  }

  register(userName: string, password: string): RegisterResponse {
    const newUser: User = new User(userName, password);
    const res = this.userManagement.register(newUser);
    return res;
  }

  getUserByName(userName: string) {
    return this.userManagement.getUserByName(userName);
  }

    connectDeliverySys(): ConnectResponse{
    const res:ConnectResponse = this.externalSystems.connectSystem("Delivery");
    return res;
  }
    connectPaymentSys(): ConnectResponse{
    const res:ConnectResponse = this.externalSystems.connectSystem("Payment");
    return res;
  }

  setAdmin(userName: string): AssignResponse{
    const res:AssignResponse = this.userManagement.setAdmin(userName);
    return res;
  }

}


