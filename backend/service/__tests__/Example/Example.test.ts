import { ExampleClass } from "../../src/Example/example";

interface IExampleClassDriver {
  instance: ExampleClass;
  getInstance: () => ExampleClass;
}

describe("Example Class Demo", () => {
  let driver: IExampleClassDriver;
  beforeEach(() => {
    //code here will run before each test
    const instance = new ExampleClass(5);
    const getInstance = () => instance;
    driver = { instance, getInstance };
  });

  test("Dummy Example Test", () => {
    //you can do the Test Logic Here
    expect(driver.getInstance().getMyPrivateId()).toBe(5);
  });
});
