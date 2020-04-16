import {Response, CATEGORY, Cart} from "../../src/test_env/types";


const DummyResponse: Response = {
    data: {},
};

const DummyItemResponse: Response = {
    data: {name: "dummyItem", price: 33.5, description: "dummyDescription"},
};

const DummyStoreResponse: Response = {
    data: {name: "dummyStore", description: "dummyDescription"},
};

const DummyUsersResponse: Response = {
    data: {users: ["dummyUser1", "dummyUser2", "dummyUser3"]},
};

const DummyUserResponse: Response = {
    data: {username: "dummyUser"},
};

const DummyCheckoutResponse: Response = {
    data: {
        receiptId: "some-fake-id",
        transaction: {ccHoldName: "testOwner", ccLast4: "4242", amountCharged: 100, ccVendor: "visa"}
        },
};

const DummyPurchaseHistoryResponse: Response = {
    data: {purchases: [{productName: "some-name"}]},
};

const DummySearchResponse: Response = {
    data: {
        items: [
            {name: "dummy-name1", category: CATEGORY.ELECTRONICS, description: "dummy-description1", price: 20},
            {name: "dummy-name2", category: CATEGORY.ELECTRONICS, description: "dummy-description2", price: 20},
            {name: "dummy-name3", category: CATEGORY.ELECTRONICS, description: "dummy-description3", price: 20}
        ]
    },
};

const DummyCartResponse: Response = {
    data: {
        cart: {
            items: [
                {name: "dummy-name1", category: CATEGORY.ELECTRONICS, description: "dummy-description1", price: 20},
                {name: "dummy-name2", category: CATEGORY.ELECTRONICS, description: "dummy-description2", price: 20},
                {name: "dummy-name3", category: CATEGORY.ELECTRONICS, description: "dummy-description3", price: 20}
            ], quantities: [5, 2, 7],
        }
    },
};

export {
    DummyResponse,
    DummyItemResponse,
    DummyStoreResponse,
    DummyUsersResponse,
    DummyUserResponse,
    DummyCheckoutResponse,
    DummyPurchaseHistoryResponse,
    DummySearchResponse,
    DummyCartResponse
};
