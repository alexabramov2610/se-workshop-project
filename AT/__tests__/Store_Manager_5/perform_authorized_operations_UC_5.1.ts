import {Bridge, Driver, Store, Credentials, Item, CATEGORY, PERMISSION, Discount, Product} from "../../";

describe("Perform authorized operations, UC: 5.1", () => {
    let _driver = new Driver;
    let _serviceBridge: Bridge;
    let _testDiscount: Discount;
    let _testProduct: Product;
    let _testItem: Item;
    let _testStore: Store;
    let _storeManagerCredentials: Credentials;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .startSession()
            .getBridge();

        _testItem = {
            id: 123,
            catalogNumber: 789,
        };
        _testStore = {
            name: "some-mock-store",
        };

        const date = new Date();
        const dateTomorrow = new Date(date.getDate() + 1);
        _testDiscount = {percents: 20, timePeriod: {startTime: date, endTime: dateTomorrow}};

        _serviceBridge.createStore(_testStore);
        _serviceBridge.addProductsToStore(_testStore,[_testProduct]);
        _serviceBridge.addItemsToStore(_testStore, [_testItem]);

        // _serviceBridge.logout(); // logging out so that manager can register

        _serviceBridge.register(_storeManagerCredentials); // store manager registers
        _serviceBridge.assignManager(_testStore, _storeManagerCredentials);
    });

    test("Default permissions", () => {
        _serviceBridge.logout() // Owner signs out
        _serviceBridge.login(_storeManagerCredentials); // Manager is logged in

        //TODO: check if default permissions granted
        // const {data, error} = _serviceBridge.setDiscountToStore(_testStore, _testDiscount);
        // expect(data).toBeUndefined();
        // expect(error).toBeDefined();
    });

    test("Act, no permissions", () => {
        _serviceBridge.logout() // Owner signs out
        _serviceBridge.login(_storeManagerCredentials); // Manager is logged in

        const {data, error} = _serviceBridge.setDiscountToStore(_testStore, _testDiscount);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Act, with permissions", () => {
        _serviceBridge.grantPermissions(_storeManagerCredentials, _testStore, [PERMISSION.MODIFY_DISCOUNT]);
        _serviceBridge.logout() // Owner signs out
        _serviceBridge.login(_storeManagerCredentials); // Manager is logged in

        const {data, error} = _serviceBridge.setDiscountToStore(_testStore, _testDiscount);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });
});
