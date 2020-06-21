import {
    Bridge,
    Driver,
} from "../../";
import {DeliveryRequest} from "se-workshop-20-interfaces/dist/src/Request";
import * as utils from "../../utils"


describe("Guest buy items, UC: 2.8", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testDeliveryInfo: DeliveryRequest;

    beforeEach(async () => {
        _driver.dropDB()

        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge =  _driver.getBridge();
        await _serviceBridge.logout();

        await _serviceBridge.login(_driver.getInitDefaults(),true);

        const res = await  _serviceBridge.mockDeliverySys();
        await _serviceBridge.logout();
        await _driver.loginWithDefaults();

        const res2 =4;
        const {country, city, address} = _driver.getPaymentInfo().payment;
        _testDeliveryInfo = {
            token: "123",
            body: {
                userDetails: {
                    name:"ron",
                    zip: "123456",
                    country: country,
                    city: city,
                    address: address
                }
            }
        }

    });


    afterAll(() => {
        _driver.dropDB()
        utils.terminateSocket();
    });

    test("Valid delivery",async () => {
        const {data, error} = await _serviceBridge.deliver(_testDeliveryInfo);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();
    });

    test("Invalid delivery - missing address",async () => {
        _testDeliveryInfo.body.userDetails.address = "";
        const {data, error} = await _serviceBridge.deliver(_testDeliveryInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid request - missing location details - city",async () => {
        _testDeliveryInfo.body.userDetails.city = "";
        const {data, error} = await _serviceBridge.deliver(_testDeliveryInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid request - missing location details - country",async () => {
        _testDeliveryInfo.body.userDetails.country = "";
        const {data, error} = await _serviceBridge.deliver(_testDeliveryInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });
});