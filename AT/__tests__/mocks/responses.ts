import {Response, CATEGORY, Cart, Product} from "../../src/test_env/types";

export interface IResponse extends Response {
    data: any;
}

const Response: IResponse = {
    data: {},
};

export interface IBoolResponse extends Response {
    data: { result: boolean };
}

const BoolResponse: IBoolResponse = {
    data: {result: true},
};

export interface IItemResponse extends Response {
    data: { name: string; price: number; description: string };
}

const ItemResponse: IItemResponse = {
    data: {name: "Item", price: 33.5, description: "Description"},
};

export interface ISessionResponse extends Response {
    data: { token: string };
}

const SessionResponse: ISessionResponse = {
    data: {token: "abcdefg"},
};

export interface IInitResponse extends Response {
    data: { success: string };
}

const InitResponse: IInitResponse = {
    data: {success: "true"},
};

export interface IStoreResponse extends Response {
    data: { name: string };
}

const StoreResponse: IStoreResponse = {
    data: {name: "Store"},
};

export interface IUsersResponse extends Response {
    data: { users: string[] };
}

const UsersResponse: IUsersResponse = {
    data: {users: ["User1", "User2", "User3"]},
};

export interface IUserResponse extends Response {
    data: { username: string };
}

const UserResponse: IUserResponse = {
    data: {username: "User"},
};

export interface ICheckoutResponse extends Response {
    data: {
        receiptId: string;
        transaction: {
            ccHoldName: string;
            ccLast4: string;
            amountCharged: number;
            ccVendor: string;
        };
    };
}

const CheckoutResponse: ICheckoutResponse = {
    data: {
        receiptId: "some-fake-id",
        transaction: {
            ccHoldName: "testOwner",
            ccLast4: "4242",
            amountCharged: 100,
            ccVendor: "visa",
        },
    },
};

export interface IPurchaseHistoryResponse extends Response {
    data: { purchases: { productName: string }[] };
}

const PurchaseHistoryResponse: IPurchaseHistoryResponse = {
    data: {purchases: [{productName: "some-name"}]},
};

export interface ISearchResponse extends Response {
    data: {
        products: Product[];
    };
}

const SearchResponse: ISearchResponse = {
    data: {
        products: [
            {
                name: "-name1",
                category: CATEGORY.ELECTRONICS,
                catalogNumber: 123,
                price: 20,
            },
            {
                name: "-name2",
                category: CATEGORY.ELECTRONICS,
                catalogNumber: 456,
                price: 20,
            },
            {
                name: "-name3",
                category: CATEGORY.ELECTRONICS,
                catalogNumber: 789,
                price: 20,
            },
        ],
    },
};

export interface ICartResponse extends Response {
    data: {
        cart: Cart
    };
}

const CartResponse: ICartResponse = {
    data: {
        cart: {
            products: [
                {
                    product: {
                        name: "-name1",
                        category: CATEGORY.ELECTRONICS,
                        price: 20,
                        catalogNumber: 123
                    }, amount: 10
                },
                {
                    product: {
                        name: "-name2",
                        category: CATEGORY.ELECTRONICS,
                        price: 20,
                        catalogNumber: 456
                    }, amount: 1
                },
                {
                    product: {
                        name: "-name3",
                        category: CATEGORY.ELECTRONICS,
                        price: 20,
                        catalogNumber: 789
                    }, amount: 2
                },
            ],
        },
    },
};

const DummyValues = {
    Response,
    ItemResponse,
    StoreResponse,
    UsersResponse,
    UserResponse,
    CheckoutResponse,
    PurchaseHistoryResponse,
    SearchResponse,
    InitResponse,
    SessionResponse,
    CartResponse,
};

export {DummyValues};
