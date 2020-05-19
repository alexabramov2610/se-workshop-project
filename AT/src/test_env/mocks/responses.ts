import {Response, Product, PERMISSION} from "../types";
import {ProductCatalogNumber, ProductCategory, ProductInStore} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import { Res } from "se-workshop-20-interfaces"

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

export interface IPermissionsResponse extends Response {
    data: { result: boolean, permissions: PERMISSION[] };
}

const PermissionsResponse: IPermissionsResponse = {
    data: {result: true, permissions: [PERMISSION.MODIFY_DISCOUNT, PERMISSION.WATCH_USER_QUESTIONS]},
};

export interface IProductResponse extends Response {
    data: { info: Product };
}

const ProductResponse: IProductResponse = {
    data: {
        info: {
            name: "Item",
            price: 33.5,
            catalogNumber: 123,
            category: ProductCategory.CLOTHING,
        },
    },
};

export interface IViewProductResponse extends Response {
    data: { result: boolean, info?: { name: string, catalogNumber: number, price: number, category: ProductCategory, quantity: number } }
}

const ViewProductResponse: Res.ProductInfoResponse = {
    data: {
        result: true,
        info: {
            name: "Item",
            price: 33.5,
            catalogNumber: 123,
            category: ProductCategory.CLOTHING,
            quantity: 2,
            finalPrice: 2
        },
    },
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
    data: {name: "store"},
};

export interface IViewStoreResponse extends Response {
    data: {
        storeName: string;
        storeOwnersNames: string[];
        storeManagersNames: string[];
        productsNames: string[];
    };
}

const ViewStoreResponse: IViewStoreResponse = {
    data: {
        storeName: "store",
        storeOwnersNames: ["avishai", "ron"],
        storeManagersNames: ["avishaiM", "ronM"],
        productsNames: ["Bamba", "Laptop"],
    },
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
    data: { products: ProductInStore[] }
}

const SearchResponse: ISearchResponse = {
    data: {
        products: [
            {
                storeName: "store-name1",storeRating:5,
                product: {
                    name: "p-name1",
                    category: ProductCategory.ELECTRONICS,
                    catalogNumber: 123,
                    price: 20,
                    
                }
            },
        ],
    },
};

const CartResponse: Res.ViewCartRes = {
    data: {
        result: true,
        cart: {
            products: [
                {
                    storeName: "store-name",
                    bagItems: [{
                        product: {name: "product", catalogNumber: 123, price: 20, category: ProductCategory.CLOTHING},
                        amount: 2,
                        finalPrice: 25
                    }]
                }
            ]
        }
    }
};


// export interface Cart {
//     products: CartProduct[]
// }
//
// export interface CartProduct {
//     storeName: string,
//     bagItems: BagItem[]
// }
// export interface BagItem {
//     product: Product,
//     amount: number;
//     finalPrice?: number
// }

const ProductsRemovalResponse: IProductsRemovalResponse = {
    data: {result: true, productsNotRemoved: []},
};

export interface IProductsRemovalResponse extends Response {
    data: { result: boolean; productsNotRemoved: ProductCatalogNumber[] };
}

const DummyValues = {
    Response,
    ProductResponse,
    StoreResponse,
    UsersResponse,
    UserResponse,
    CheckoutResponse,
    PurchaseHistoryResponse,
    SearchResponse,
    InitResponse,
    SessionResponse,
    ProductsRemovalResponse,
    CartResponse,
    ViewStoreResponse,
    ViewProductResponse,
    PermissionsResponse
};

export {DummyValues};
