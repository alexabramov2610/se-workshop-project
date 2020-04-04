import { instance } from "domain_layer";
export const add = () => instance.increase();
export const printUser = () => console.log(instance.getCounter());
