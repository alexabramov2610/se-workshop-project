import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"

describe("Store Manager Integration Tests", () => {
    const storeManagerName: string = "store-manager";
    const storeManagerPassword: string = "store-manager-pw";
    const storeName: string = "store-name";

    let token: string;

    beforeAll(async (done) => {
        await utils.clearDB();
        await utils.systemInit();
        done();
    });

    beforeEach(async (done) => {
        await utils.systemReset();
        await utils.systemInit();
        token = await utils.initSessionRegisterLogin(storeManagerName, storeManagerPassword);
        expect(token).toBeDefined();
        done();
    });

    afterAll((done) => {
        utils.safeShutdown();
        done();
    });


    it("dummy test",() => {
        expect(true).toBe(true);
    });


});

