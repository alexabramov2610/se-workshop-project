import {mocked} from "ts-jest/utils";
import {ExternalSystemsManager} from "../../../../src/external_systems/ExternalSystemsManager";
import {DeliverySystem} from "../../../../src/external_systems/delivery_system/DeliverySystem";
import {PaymentSystem} from "../../../../src/external_systems/payment_system/PaymentSystem";
import {SecuritySystem} from "../../../../src/external_systems/security_system/SecuritySystem";
import {Req, Res} from 'se-workshop-20-interfaces'
import {ExternalSystems } from "../../../../src/api-int/internal_api"
jest.mock("../../../../src/external_systems/delivery_system/DeliverySystem");
jest.mock('../../../../src/external_systems/payment_system/PaymentSystem');
jest.mock('../../../../src/external_systems/security_system/SecuritySystem');
describe("External System Unit Tests", () => {
    beforeEach(() => {
        this.externalSystemManager = new ExternalSystemsManager();

    });

    test("Connect external system", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true }};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(PaymentSystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(SecuritySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        this.externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = this.externalSystemManager.connectSystem(ExternalSystems.DELIVERY);
        expect(response.data.result).toBeTruthy();
                const response1 : Res.BoolResponse = this.externalSystemManager.connectSystem(ExternalSystems.PAYMENT);
        expect(response1.data.result).toBeTruthy();
                const response2 : Res.BoolResponse = this.externalSystemManager.connectSystem(ExternalSystems.SECURITY);
        expect(response2.data.result).toBeTruthy();
    })

    test("Connect external system failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false }};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        this.externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = this.externalSystemManager.connectSystem(ExternalSystems.DELIVERY);

        expect(response.data.result).toBeFalsy();
    })
    test("Connect all external systems", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true }};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(PaymentSystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(SecuritySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        this.externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = this.externalSystemManager.connectAllSystems();

        expect(response.data.result).toBeTruthy();
    })
    test("Connect all external systems failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false }, error:{message: "error"}};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(PaymentSystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        mocked(SecuritySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        this.externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = this.externalSystemManager.connectAllSystems();

        expect(response.data.result).toBeFalsy();
    })

    test("Initialization", () => {
        this.externalSystemManager = new ExternalSystemsManager();
        expect(this.externalSystemManager.paymentSystem).toBeDefined();
        expect(this.externalSystemManager.deliverySystem).toBeDefined();
        expect(this.externalSystemManager.securitySystem).toBeDefined();

    });
})