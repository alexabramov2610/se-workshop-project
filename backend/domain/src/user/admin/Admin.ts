import { User } from "../internal_api";

export class Admin extends User{
   constructor(name: string, password: string) {
      super(name,password);
  }
}