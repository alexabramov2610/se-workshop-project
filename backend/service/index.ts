import { instance } from "domain_layer";
import { addFacade, addFromUser } from './src/service_facade/ServiceFacade';
console.log(instance.getCounter())
addFacade();
console.log(instance.getCounter())
addFromUser()
console.log(instance.getCounter())
