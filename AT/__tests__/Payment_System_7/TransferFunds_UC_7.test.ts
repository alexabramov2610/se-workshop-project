import {
    Bridge,
    Driver,
} from "../../";
import {PayRequest} from "se-workshop-20-interfaces/dist/src/Request";


describe("Guest buy items, UC: 2.8", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testPaymentInfo: PayRequest;

    beforeEach(() => {
        _serviceBridge = _driver
            .startSession()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testPaymentInfo = {
            token: "123", body: {
                payment: _driver.getPaymentInfo().payment,
                price: 100
            }
        }

    });

    test("Valid request", () => {
        const {data, error} = _serviceBridge.pay(_testPaymentInfo);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();
    });

    test("Invalid request - missing credit card details", () => {
        _testPaymentInfo.body.payment.cardDetails.number = "";
        const {data, error} = _serviceBridge.pay(_testPaymentInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid request - missing location details", () => {
        _testPaymentInfo.body.payment.address = "";
        const {data, error} = _serviceBridge.pay(_testPaymentInfo);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });
});