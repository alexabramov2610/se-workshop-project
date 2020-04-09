export interface ServiceBridge {
  getLoggedInUsers(): { users: string[] };
  removeUser(username: string): { success: boolean; error: string };
  getUserByName(username: string): { username: string };
  login(
    userName: string,
    password: string
  ): { success: boolean; error: string };
  register(
    userName: string,
    password: string
  ): { success: boolean; error: string };
}
