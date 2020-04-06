import { ServiceBridge } from "./exports";
import { User } from "./types";
class ProxyBridge implements ServiceBridge {
  private real: ServiceBridge;

  setReal(adapter: ServiceBridge) {
    this.real = adapter;
  }

  register(userName: string, password: string) {
    return this.real
      ? this.real.register(userName, password)
      : { success: true };
  }

  login(userName: string, password: string) {
    return this.real
      ? this.real.login(userName, password)
      : { isLoggedin: true };
  }
}

export { ProxyBridge };
