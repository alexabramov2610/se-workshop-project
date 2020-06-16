import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"
import {IReceipt, Purchase} from "se-workshop-20-interfaces/dist/src/CommonInterface";

describe("Registered User Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";
    const ownerUsername: string = "owner-username";
    const ownerPassword: string = "usernamepw123";

    let token: string;

    beforeAll(async (done) => {
        await utils.clearDB();
        await utils.systemInit();
        done();
    });

    beforeEach(async (done) => {
        await utils.systemReset();
        await utils.systemInit();
        token = await utils.initSessionRegisterLogin(username, password);
        expect(token).toBeDefined();
        done();
    });

    afterAll((done) => {
        utils.safeShutdown();
        done();
    });

    it("logout without login IT", async (done) => {
        token = await utils.getGuestSession();
        const logoutReq: Req.LogoutRequest = {token, body: {}};
        const logoutRes: Res.BoolResponse = await ServiceFacade.logoutUser(logoutReq);
        expect(logoutRes.data.result).toBe(false);
        done();
    });

    it("logout IT test", async (done) => {
        const logoutReq: Req.LogoutRequest = {token, body: {}};
        const logoutRes: Res.BoolResponse = await ServiceFacade.logoutUser(logoutReq);
        expect(logoutRes.data.result).toBe(true);
        done();
    });

    it("create store IT", async (done) => {
        const storeName: string = "store name";
        const req: Req.OpenStoreRequest = {body: {storeName, description:"desc"}, token};
        let res: Res.BoolResponse = await ServiceFacade.createStore(req)
        expect(res.data.result).toBe(true);
        res = await ServiceFacade.createStore(req);
        expect(res.data.result).toBe(false);
        done();
    });

    it("view purchases history IT", async (done) => {
        const storeName: string = "store name";
        const catalogNumber: number = 1;
        let viewRUserPurchasesHistoryReq: Req.ViewRUserPurchasesHistoryReq = {body: {}, token}
        let viewRUserPurchasesHistoryRes: Res.ViewRUserPurchasesHistoryRes = await ServiceFacade.viewRegisteredUserPurchasesHistory(viewRUserPurchasesHistoryReq);
        expect(viewRUserPurchasesHistoryRes.data.result).toBe(true);
        expect(viewRUserPurchasesHistoryRes.data.receipts).toEqual([]);

        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 3, ownerUsername, ownerPassword, storeName , undefined);

        const saveToCartRequest: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const saveToCartResponse: Res.BoolResponse = await ServiceFacade.saveProductToCart(saveToCartRequest)
        expect(saveToCartResponse.data.result).toBeTruthy();

        const lastCC4: string = "0124";
        const purchaseReq: Req.PurchaseRequest = {
            body: {
                payment: {
                    cardDetails: {
                        holderName: "tal",
                        number: "1234-4567-7890-" + lastCC4,
                        expYear: "21",
                        expMonth: "5",
                        cvv: "400",
                        id: "123456789"
                    }, address: "batyam", city: "batya", country: "israel"
                }
            }, token: token
        }
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.lastCC4).toBe(lastCC4);
        expect(purchaseResponse.data.receipt.payment.totalCharged).toBe(products[0].price);
        expect(purchaseResponse.data.receipt.purchases).toHaveLength(1);
        expect(purchaseResponse.data.receipt.purchases[0].userName).toBe(username);
        expect(purchaseResponse.data.receipt.purchases[0].storeName).toBe(storeName);
        expect(purchaseResponse.data.receipt.purchases[0].price).toBe(products[0].price);
        expect(purchaseResponse.data.receipt.purchases[0].item.catalogNumber).toBe(products[0].catalogNumber);
        expect(purchaseResponse.data.receipt.purchases[0].item.id > 0).toBeTruthy();

        viewRUserPurchasesHistoryRes = await ServiceFacade.viewRegisteredUserPurchasesHistory(viewRUserPurchasesHistoryReq);
        expect(viewRUserPurchasesHistoryRes.data.result).toBe(true);
        expect(viewRUserPurchasesHistoryRes.data.receipts).toHaveLength(1);
        const receipt: IReceipt = viewRUserPurchasesHistoryRes.data.receipts[0];
        expect(receipt.purchases).toHaveLength(1);

        const purchase: Purchase = receipt.purchases[0];
        expect(purchase.item.catalogNumber).toBe(products[0].catalogNumber);
        expect(purchase.item.id > 0).toBe(true);
        expect(purchase.price).toBe(products[0].price);
        expect(purchase.storeName).toBe(storeName);
        expect(purchase.userName).toBe(username);

        done();
    });
});

