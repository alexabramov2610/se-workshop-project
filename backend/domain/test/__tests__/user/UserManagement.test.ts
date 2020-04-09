import { UserManagementDriver } from "../../helpers/UserManagement.driver";
import * as Responses from "../../../src/common/internal_api";

describe("User Management Unit Tests", () => {
  let driver: UserManagementDriver;
  beforeEach(() => {
    driver = new UserManagementDriver();
  });


  test("Registration Success Test", () => {
    const res: Responses.BoolResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeTruthy();
  });

  test("Set Admin", () => {
    const res: Responses.BoolResponse = driver.setAdmin("ron");
    expect(res.data.result).toBeTruthy();
  });

});
