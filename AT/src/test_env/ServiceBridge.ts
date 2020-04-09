export interface ServiceBridge {
  login(userName, password): { isLoggedin: boolean };
  register(userName, password): { success: boolean };
}
