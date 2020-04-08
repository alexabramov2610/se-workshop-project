import { UserManagement, User } from "../user/internal_api";
export class TradingSystem {
  private userManagement: UserManagement;
  public counter: number;
  constructor() {
    this.userManagement = new UserManagement();
    this.counter = 0;
    this.increase = this.increase.bind(this);
    this.getCounter = this.getCounter.bind(this);
  }

  register(userName: string, password: string): void {
    const res = this.userManagement.register(userName,password);
  }
  getUserByName(userName: string) {
    return this.userManagement.getUserByName(userName);
  }
  increase = () => {
    this.counter++;
  };
  getCounter = () => this.counter;
}



