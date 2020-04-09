import { ServiceBridge } from "./exports";
import { User } from "./types";
class ProxyBridge implements ServiceBridge {
  private real: ServiceBridge;

  setReal(adapter: ServiceBridge) {
    this.real = adapter;
  }

  removeUser(username: string) {
    return this.real
      ? this.real.removeUser(username)
      : { success: true, error: null };
  }

  getUserByName(username: string) {
    return this.real
      ? this.real.getUserByName(username)
      : { username: username };
  }

  register(userName: string, password: string) {
    return this.real
      ? this.real.register(userName, password)
      : { success: true, error: null };
  }

  login(userName: string, password: string) {
    return this.real
      ? this.real.login(userName, password)
      : { isLoggedin: true };
  }
}

export { ProxyBridge };
