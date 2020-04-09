import { ServiceBridge } from "./exports";

class ProxyBridge implements ServiceBridge {
  private real: ServiceBridge;

  setReal(adapter: ServiceBridge) {
    this.real = adapter;
  }

  getLoggedInUsers() {
    return this.real
      ? this.real.getLoggedInUsers()
      : { users: ["dummyUser1", "dummyUser2", "dummyUser3"] };
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
      : { success: true, error: null };
  }
}

export { ProxyBridge };
