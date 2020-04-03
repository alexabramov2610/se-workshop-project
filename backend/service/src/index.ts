import { UserDemo, IUserDemoFields } from "domain_layer";
const someFields: IUserDemoFields = { iName: "SomeName", iAge: 78 };
const user = new UserDemo(someFields);
user.printMyName();
