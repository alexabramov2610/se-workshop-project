import { Item, Response } from "./types";

export interface ServiceBridge {
  removeItem(id: string): Response;
  removeStore(id: string): Response;
  addStore(id: string, name: string, description: string): Response;
  addItemToStore(storeID: string, item: Item): Response;
  viewStore(storeID: string): Response;
  viewItem(_itemID: string): Response;
  getLoggedInUsers(): Response;
  removeUser(username: string): Response;
  getUserByName(username: string): Response;
  login(userName: string, password: string): Response;
  register(userName: string, password: string): Response;
}
