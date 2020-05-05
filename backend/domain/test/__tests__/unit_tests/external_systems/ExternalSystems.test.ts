import {DeliverySystem} from "../../../../src/external_systems/delivery_system/DeliverySystem";
import {PaymentSystem} from "../../../../src/external_systems/payment_system/PaymentSystem";
import {SecuritySystem} from "../../../../src/external_systems/security_system/SecuritySystem";
import {Req, Res} from 'se-workshop-20-interfaces'
import {CreditCard} from "se-workshop-20-interfaces/dist/src/CommonInterface";


describe("External System Unit Tests", () => {
    beforeEach(() => {});


    class RealSystemMockSuccess {
        connect() {
            return true;
        }
    }

    class RealSystemMockFailure {
        connect() {
            return false;
        }
    }

    class RealSystemMockException {
        connect() {
            throw new Error("Connection timeout");
        }
    }

    test("DeliverySystem connection - without external", () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: string = "mockDelSystem";
        const res: Res.BoolResponse = deliverySystem.connect();     // todo: change
        expect(res.data.result).toBeTruthy();
    });

    test("DeliverySystem connection - with external - Success", () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockSuccess = new RealSystemMockSuccess();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = deliverySystem.connect();
        expect(res.data.result).toBeTruthy();
    });

    test("DeliverySystem connection - with external - Failure", () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = deliverySystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("DeliverySystem connection - with external - Exception", () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = deliverySystem.connect();
        expect(res.data.result).toBeFalsy();
    });


    class PaymentSystemMockPayException {
        connect() {
            return true;
        }
        pay() {
            throw new Error("timeout exception");
        }
    }

    class PaymentSystemMockPaySuccess {
        connect() {
            return true;
        }
        pay() {
            return true;
        }
        validateCreditCard(){
            return true;
        }
        validateBalance(){
            return true;
        }
    }


    test("PaymentSystem connection - without external", () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: string = "mockDelSystem";
        const res: Res.BoolResponse = paymentSystem.connect();     // todo: change
        expect(res.data.result).toBeTruthy();
    });

    test("PaymentSystem connection - with external - Success", () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockSuccess = new RealSystemMockSuccess();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = paymentSystem.connect();
        expect(res.data.result).toBeTruthy();
    });

    test("PaymentSystem connection - with external - Failure", () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("PaymentSystem connection - with external - Exception", () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("PaymentSystem connection - pay - success", () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "2050", holderName: "mock-holder", number:"123" };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: PaymentSystemMockPaySuccess = new PaymentSystemMockPaySuccess();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: boolean = paymentSystem.pay(amount, creditCard);
        expect(res).toBeTruthy();
    });

    test("PaymentSystem connection - pay - Exception", () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "2000", holderName: "mock-holder", number:"123" };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: PaymentSystemMockPayException = new PaymentSystemMockPayException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: boolean = paymentSystem.pay(amount, creditCard);
        expect(res).toBeFalsy();
    });

    test("PaymentSystem connection - pay - failure - can't connect", () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "2000", holderName: "mock-holder", number:"123" };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: boolean = paymentSystem.pay(amount, creditCard);
        expect(res).toBeFalsy();
    });

    test("PaymentSystem connection - pay - can't connect", () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });


    test("SecuritySystem", () => {
        const securitySystem: SecuritySystem = new SecuritySystem();
        const pw: string = "what-a-long-pw!";
        const encPw: string = securitySystem.encryptPassword(pw);

        expect(encPw).toBeDefined();

        expect(securitySystem.comparePassword(pw, encPw)).toBeTruthy();

    });




})