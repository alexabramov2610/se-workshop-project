import { ServiceBridge, Driver, ProxyBridge } from "../../src/test_env/exports";
describe("User Management Unit Tests", () => {
  let sb: ServiceBridge;
  beforeEach(() => {
    sb = Driver.makeBridge();
  });

  test("Login With Registered User", () => {
    const userName: string = "Ron";
    const password: string = "Avishai";
    sb.register(userName, password);
    const { isLoggedin } = sb.login(userName, password);
    expect(isLoggedin).toBeTruthy();
  });

  test("Login With UnRegistered User", () => {
    const userName: string = "Ron_Not_Exists";
    const password: string = "Avishai_Likes_Banana";
    const { isLoggedin } = sb.login(userName, password);
    expect(isLoggedin).not.toBeTruthy();
  });
  
});
