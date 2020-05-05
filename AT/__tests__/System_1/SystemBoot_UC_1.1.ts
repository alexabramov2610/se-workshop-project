import { Bridge, Driver, Store, Credentials, Item, PERMISSION } from "../../";

describe("System Boot - UC 1", () => {
  let _serviceBridge: Bridge;
  let _driver = new Driver();
  let _credentials: Credentials;

  beforeEach(() => {
    _serviceBridge = _driver.resetState().startSession().getBridge();
    _credentials = { userName: "Admin", password: "Admin" };
  });

  test("SystemBoot, valid admin details", () => {
    const { data, error } = _serviceBridge.init({
      userName: "admin",
      password: "adas123",
    });
    expect(error).toBeUndefined();
    expect(data).toBeDefined();
  });

  test("SystemBoot, valid admin details - init and init again", () => {
    const { data, error } = _serviceBridge.init({
      userName: "admin",
      password: "adas123",
    });
    expect(error).toBeUndefined();
    expect(data).toBeDefined();
    const res2 = _serviceBridge.init({
      userName: "admin",
      password: "adas123",
    });
    expect(res2.data).toBeUndefined();
    expect(res2.error).toBeDefined();
  });

  test("SystemBoot, try to register user without init", () => {
    const { data, error } = _serviceBridge.register({
      userName: "validuser",
      password: "validpwd123",
    });
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });

  test("SystemBoot, invalid admin details - password too short", () => {
    const { data, error } = _serviceBridge.init({
      userName: "admin",
      password: "a",
    });
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });
  test("SystemBoot, invalid admin details - empty string as name", () => {
    const { data, error } = _serviceBridge.init({
      userName: "",
      password: "adas",
    });
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });
});
