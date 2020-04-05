import { UserManagement, User } from "../user/internal_api";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import { BoolResponse,ExternalSystems } from "../common/internal_api";

export class TradingSystem {
  private userManagement: UserManagement;
  private externalSystems: ExternalSystemsManager;
  constructor() {
    this.userManagement = new UserManagement();
  }

  register(userName: string, password: string): BoolResponse {
    const res = this.userManagement.register(userName,password);
    return res;
  }

  getUserByName(userName: string) {
    return this.userManagement.getUserByName(userName);
  }

    connectDeliverySys(): BoolResponse{
    const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.DELIVERY);
    return res;
  }
    connectPaymentSys(): BoolResponse{
    const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.PAYMENT);
    return res;
  }

  setAdmin(userName: string): BoolResponse{
    const res:BoolResponse = this.userManagement.setAdmin(userName);
    return res;
  }

}


