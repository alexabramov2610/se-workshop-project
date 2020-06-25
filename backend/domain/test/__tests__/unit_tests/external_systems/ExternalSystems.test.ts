import {DeliverySystem} from "../../../../src/external_systems/delivery_system/DeliverySystem";
import {PaymentSystem} from "../../../../src/external_systems/payment_system/PaymentSystem";
import {SecuritySystem} from "../../../../src/external_systems/security_system/SecuritySystem";
import {Req, Res} from 'se-workshop-20-interfaces'
import {CreditCard} from "se-workshop-20-interfaces/dist/src/CommonInterface";


describe("External System Unit Tests", () => {
    beforeEach(() => {});

    const deliverRes: number = 10;
    const errorRes: number = -1;
    const mockPayRes: boolean = true;

    class RealSystemMockSuccess {
        async connect(): Promise<boolean> {
            return true;
        }
        async deliver(): Promise<number> {
            return deliverRes;
        }
    }

    class RealSystemMockFailure {
        async connect(): Promise<boolean> {
            return false;
        }
    }

    class RealSystemMockException {
        async connect(): Promise<boolean> {
            throw new Error("Connection timeout");
        }
    }

    class RealSystemMockDeliveryException {
        async connect(): Promise<Res.BoolResponse> {
            return { data: { result: true } };
        }
        async deliver(): Promise<number> {
            throw new Error("Connection timeout");
        }
    }

    test("DeliverySystem connection - without external", async () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: string = "mockDelSystem";
        const res: Res.BoolResponse = await deliverySystem.connect();
        expect(res.data.result).toBeTruthy();
    });

    test("DeliverySystem connection - with external - Success", async () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockSuccess = new RealSystemMockSuccess();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = await deliverySystem.connect();
        expect(res.data.result).toBeTruthy();
    });

    test("DeliverySystem connection - with external - Failure", async () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = await deliverySystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("DeliverySystem connection - with external - Exception", async () => {
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: Res.BoolResponse = await deliverySystem.connect();
        expect(res.data.result).toBeFalsy();
    });


    test("DeliverySystem deliver - success", async () => {
        const country: string = "israel";
        const city: string = "beer-sheva";
        const address: string = "ben-gurion 10";
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockSuccess = new RealSystemMockSuccess();
        const zip: string = "808008";
        const name: string = "name1";
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: number = await deliverySystem.deliver(name, country, city, address, zip);
        expect(res).toBe(deliverRes);
    });

    test("DeliverySystem deliver - failure - can't connect", async () => {
        const country: string = "israel";
        const city: string = "beer-sheva";
        const address: string = "ben-gurion 10";
        const name: string = "name1";
        const zip: string = "808008";
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: number = await deliverySystem.deliver(name, country, city, address, zip);
        expect(res).toBe(errorRes);
    });

    test("DeliverySystem deliver - failure - external sys exception", async () => {
        const country: string = "israel";
        const city: string = "beer-sheva";
        const address: string = "ben-gurion 10";
        const name: string = "name1";
        const zip: string = "808008";
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const mockDelSystem: RealSystemMockDeliveryException = new RealSystemMockDeliveryException();
        deliverySystem.setDeliverySys(mockDelSystem);
        const res: number = await deliverySystem.deliver(name, country, city, address, zip);
        expect(res).toBe(errorRes);
    });

    test("DeliverySystem deliver - success - without external system", async () => {
        const country: string = "israel";
        const name: string = "name1";
        const city: string = "beer-sheva";
        const zip: string = "808008";
        const address: string = "ben-gurion 10";
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const res: number = await deliverySystem.deliver(name, country, city, address, zip);
        expect(res).toBeGreaterThan(0);
    });

    test("DeliverySystem deliver - failure - without external system - invalid delivery details", async () => {
        const country: string = "";
        const name: string = "name1";
        const city: string = "beer-sheva";
        const address: string = "ben-gurion 10";
        const zip: string = "808008";
        const deliverySystem: DeliverySystem = new DeliverySystem();
        const res: number = await deliverySystem.deliver(name, country, city, address, zip);
        expect(res).toBeGreaterThan(0);
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
            return mockPayRes;
        }
        validateCreditCard(){
            return true;
        }
        validateBalance(){
            return true;
        }
    }


    test("PaymentSystem connection - without external", async () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: string = "mockDelSystem";
        const res: Res.BoolResponse = await paymentSystem.connect();     // todo: change
        expect(res.data.result).toBeTruthy();
    });

    test("PaymentSystem connection - with external - Success", async () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockSuccess = new RealSystemMockSuccess();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = await paymentSystem.connect();
        expect(res.data.result).toBeTruthy();
    });

    test("PaymentSystem connection - with external - Failure", async () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = await paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("PaymentSystem connection - with external - Exception", async () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = await paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });


    test("PaymentSystem pay - success", async () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "50", holderName: "mock-holder", number:"123", id: 'a' };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: PaymentSystemMockPaySuccess = new PaymentSystemMockPaySuccess();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBe(-1);
    });

    test("PaymentSystem pay - Exception", async () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "00", holderName: "mock-holder", number:"123", id: 'a' };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: PaymentSystemMockPayException = new PaymentSystemMockPayException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBe(errorRes);
    });

    test("PaymentSystem pay - failure - can't connect", async () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "00", holderName: "mock-holder", number:"123", id: 'a' };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockFailure = new RealSystemMockFailure();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBe(errorRes);
    });

    test("PaymentSystem pay - can't connect", async () => {
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const mockDelSystem: RealSystemMockException = new RealSystemMockException();
        paymentSystem.setPaymentSys(mockDelSystem);
        const res: Res.BoolResponse = await paymentSystem.connect();
        expect(res.data.result).toBeFalsy();
    });

    test("PaymentSystem pay - success - without external", async () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "50", holderName: "mock-holder", number:"123", id: 'a' };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBeGreaterThan(0);
    });

    test("PaymentSystem pay - failure - without external - invalid credit card", async () => {
        const amount: number = 500;
        const creditCard: CreditCard = { cvv: "", expMonth: "11", expYear: "50", holderName: "mock-holder", number:"123", id: 'a' };
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBeGreaterThan(0);
    });

    test("PaymentSystem pay - failure - without external - invalid balance", async () => {
        const amount: number = 3000;
        const creditCard: CreditCard = { cvv: "111", expMonth: "11", expYear: "50", holderName: "mock-holder", number:"123", id: 'a'};
        const paymentSystem: PaymentSystem = new PaymentSystem();
        const res: number = await paymentSystem.pay(amount, creditCard);
        expect(res).toBeGreaterThan(0);
    });

    test("SecuritySystem", async () => {
        const securitySystem: SecuritySystem = new SecuritySystem();
        const pw: string = "what-a-long-pw!";
        const encPw: string = await securitySystem.encryptPassword(pw);

        expect(securitySystem.connect().data.result).toBe(true);
        expect(encPw).toBeDefined();
        expect(securitySystem.comparePassword(pw, encPw)).toBeTruthy();
    });





})