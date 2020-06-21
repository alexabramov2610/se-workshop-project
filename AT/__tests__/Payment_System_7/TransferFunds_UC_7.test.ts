import {
    Bridge,
    Driver,
} from "../../";
import {PayRequest} from "se-workshop-20-interfaces/dist/src/Request";
import * as utils from "../../utils"


describe("Guest buy items, UC: 2.8", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testPaymentInfo: PayRequest;

    beforeEach(async() => {
        let _driver = new Driver();
        _driver.dropDBDor();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = await _driver.getBridge();

        await _serviceBridge.logout();
        await _serviceBridge.login(_driver.getInitDefaults());

        const res = await  _serviceBridge.mockDeliverySys();
        await _serviceBridge.logout();
        await _driver.loginWithDefaults();


        _testPaymentInfo = {
            token: "123", body: {
                payment: _driver.getPaymentInfo().payment,
                price: 100
            }
        }

    });


    afterAll(() => {
        utils.terminateSocket();
        _driver.dropDBDor();

    });

    test("Valid request",async () => {
        const {data, error} =await _serviceBridge.pay(_testPaymentInfo);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();
    });

    test("Invalid request - missing credit card details",async () => {
        _testPaymentInfo.body.payment.cardDetails.number = "";
        const {data, error} = await _serviceBridge.pay(_testPaymentInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid request - missing credit invalid date",async () => {
        _testPaymentInfo.body.payment.cardDetails.expMonth = "11";
        _testPaymentInfo.body.payment.cardDetails.expYear = "11";
        const {data, error} = await _serviceBridge.pay(_testPaymentInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    // test("Invalid request - missing location details", async () => {
    //     _testPaymentInfo.body.payment.address = undefined;
    //     const {data, error} =await _serviceBridge.pay(_testPaymentInfo);
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });
 });