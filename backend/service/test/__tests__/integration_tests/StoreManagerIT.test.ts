import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"

describe("Store Manager Integration Tests", () => {
    const storeManagerName: string = "store-manager";
    const storeManagerPassword: string = "store-manager-pw";
    const storeName: string = "store-name";

    let token: string;

    beforeAll(() => {
        utils.systemInit();
    });

    beforeEach(() => {
        utils.systemReset();
        token = utils.initSessionRegisterLogin(storeManagerName, storeManagerPassword);
        expect(token).toBeDefined();
    });



    it("dummy test",() => {
        expect(true).toBe(true);
    });


});

