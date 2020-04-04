import { instance } from "domain_layer";
import { add } from '../user_service/UserService'
export const addFacade = () => instance.increase();
export const addFromUser = () => add();
