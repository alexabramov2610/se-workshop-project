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
    let externalSystemManager: ExternalSystemsManager;
    beforeEach(() => {
        externalSystemManager = new ExternalSystemsManager();
    });

    test("Connect external system", async () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true }};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: async () :Promise<Res.BoolResponse> => connectSystemRes }
        });
        mocked(PaymentSystem).mockImplementation(() :any => {
            return {connect: async () :Promise<Res.BoolResponse> => connectSystemRes }
        });
        mocked(SecuritySystem).mockImplementation(() :any => {
            return {connect: async () :Promise<Res.BoolResponse> => connectSystemRes }
        });
        externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = await externalSystemManager.connectSystem(ExternalSystems.DELIVERY);
        expect(response.data.result).toBeTruthy();
                const response1 : Res.BoolResponse = await externalSystemManager.connectSystem(ExternalSystems.PAYMENT);
        expect(response1.data.result).toBeTruthy();
                const response2 : Res.BoolResponse = await externalSystemManager.connectSystem(ExternalSystems.SECURITY);
        expect(response2.data.result).toBeTruthy();
    })

    test("Connect external system failure", async () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false }};
        mocked(DeliverySystem).mockImplementation(() :any => {
            return {connect: () :Res.BoolResponse => connectSystemRes }
        });
        externalSystemManager = new ExternalSystemsManager();
        const response : Res.BoolResponse = await externalSystemManager.connectSystem(ExternalSystems.DELIVERY);

        expect(response.data.result).toBeFalsy();
    })

    // test("Connect all external systems", async () => {
    //     const connectSystemRes: Res.BoolResponse = {data: {result: true }};
    //     mocked(DeliverySystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     mocked(PaymentSystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     mocked(SecuritySystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     externalSystemManager = new ExternalSystemsManager();
    //     const response : Res.BoolResponse = externalSystemManager.connectAllSystems();
    //
    //     expect(response.data.result).toBeTruthy();
    // })

    // test("Connect all external systems failure", async () => {
    //     const connectSystemRes: Res.BoolResponse = {data: {result: false }, error:{message: "error"}};
    //     mocked(DeliverySystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     mocked(PaymentSystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     mocked(SecuritySystem).mockImplementation(() :any => {
    //         return {connect: () :Res.BoolResponse => connectSystemRes }
    //     });
    //     externalSystemManager = new ExternalSystemsManager();
    //     const response : Res.BoolResponse = await externalSystemManager.connectAllSystems();
    //
    //     expect(response.data.result).toBeFalsy();
    // })

    test("Initialization", () => {
        externalSystemManager = new ExternalSystemsManager();
        expect(externalSystemManager.paymentSystem).toBeDefined();
        expect(externalSystemManager.deliverySystem).toBeDefined();
        expect(externalSystemManager.securitySystem).toBeDefined();
    });
})