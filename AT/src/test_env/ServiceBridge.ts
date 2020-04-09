export interface ServiceBridge {
  removeUser(_username: string): { success: boolean, error: string };
  getUserByName(_username: string): { username: string; };
  login(userName, password): { isLoggedin: boolean };
  register(userName, password): { success: boolean, error: string };
}
