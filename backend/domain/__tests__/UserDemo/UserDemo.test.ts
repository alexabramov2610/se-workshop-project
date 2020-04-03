import { UserDemo, IUserDemoFields } from "../../src/User/UserDemo";

describe("User Demo", () => {
  let driver: UserDemo;
  beforeEach(() => {
    //code here will run before each test
    const someDefaultFields: IUserDemoFields = { iName: "MyUser", iAge: 45 };
    driver = new UserDemo(someDefaultFields);
  });

  test("Dummy User Test", () => {
    expect(driver.age).toBe(45);
  });
});
