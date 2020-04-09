import {Store, StoreManagement} from "../../src/store/internal_api";
import * as Responses from "../../src/common/Response";
import {StoreOwner, UserManagement} from "../../src/user/internal_api";
import {TradingSystem} from "../../src/trading_system/TradingSystem";
import {Item} from "../../src/trading_system/internal_api";

describe("Store Management Unit Tests", () => {
    let tradingSystem: TradingSystem;
    let store: Store;
    let user: StoreOwner;
    let userManagement: UserManagement;
    let storeManagement: StoreManagement;

    beforeEach(() => {
        tradingSystem = new TradingSystem();
        store = new Store("store", 5);
        user = new StoreOwner("name","123123");
        userManagement = new UserManagement();
        storeManagement = new StoreManagement();
    });

    test("addItems success", () => {
        // const items: Item[] = generateItems(5);
        // jest.spyOn(userManagement, 'isLoggedIn').mockReturnValue(true);
        // jest.spyOn(storeManagement, 'verifyStore').mockReturnValue(true);
        // jest.spyOn(storeManagement, 'verifyStoreOwner').mockReturnValue(true);
        // jest.spyOn(store, 'addItems').mockReturnValue({data: {result:true , ItemsNotAdded: []}});
        //
        // let res :Responses.StoreItemsAdditionResponse = tradingSystem.addItems(items, user, store);
        // expect(res.data.result).toBeTruthy();
    });




    function generateItems(numOfItems: number): Item[] {
        let items: Item[] = [];
        for (let i = 0; i < numOfItems; i ++)
            items.push(new Item(1, 2));

        return items;
    }

});
