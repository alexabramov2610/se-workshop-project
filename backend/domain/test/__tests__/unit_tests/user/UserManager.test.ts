import * as Res from "../../../../src/api-ext/Response";
import * as Req from "../../../../src/api-ext/Request";
import {UserManager} from "../../../../src/user/UserManager";
import {RegisteredUser, User, StoreManager} from "../../../../src/user/internal_api";
import {ExternalSystemsManager} from "../../../../src/external_systems/internal_api";
import {ProductCategory} from "../../../../src/api-ext/CommonInterface";
import {Product} from "../../../../src/trading_system/data/Product";
import {loggerW, UserRole, RemoveFromCartRequest} from "../../../../src/api-int/internal_api";
const logger = loggerW(__filename)

describe("RegisteredUser Management Unit Tests", () => {
    let userManager: UserManager;

    beforeEach(() => {
        userManager = new UserManager(new ExternalSystemsManager());
    });


    test("Registration Success Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(null);
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
        const res: Res.BoolResponse = userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeTruthy();
    });

    test("Registration user exist Fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
        const res: Res.BoolResponse = userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });

    test("Registration bad pass Fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(null);
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(false)
        const res: Res.BoolResponse = userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });


    test("Login Success Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)

        const res: Res.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeTruthy();
    });

    test("Login bad password fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(false);
        const res: Res.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });

    test("Login already logged in fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(false);
        const res: Res.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });


    test("logout Success Test", () => {
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(true);
        jest.spyOn(userManager, "getLoggedInUserByToken").mockReturnValue(new RegisteredUser("ron", "ron123"));
        const res: Res.BoolResponse = userManager.logout({body: {}, token: "token"})
        expect(res.data.result).toBeTruthy();
    });

    test("logout already out fail Test", () => {
        jest.spyOn(userManager, "getLoggedInUserByToken").mockReturnValue(undefined);
        const res: Res.BoolResponse = userManager.logout({body: {}, token: "token"})
        expect(res.data.result).toBeFalsy();
    });


    test("setUserRole - Manager, logged in - Success", () => {
        const isLoggedIn: boolean = true;
        const buyer: RegisteredUser = new RegisteredUser('test', '111111');
        const roleToAssign: UserRole = UserRole.MANAGER;
        jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(buyer);
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);

        const dupUser: RegisteredUser = userManager.setUserRole(buyer.name, roleToAssign)
        expect(dupUser).toBeDefined();
        expect(dupUser.name).toBe(buyer.name);
    });

    test("setUserRole - Manager - Failure - User doesn't exist", () => {
        const isLoggedIn: boolean = true;
        const buyer: RegisteredUser = new RegisteredUser('test', '111111');
        const roleToAssign: UserRole = UserRole.MANAGER;
        jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(undefined);
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);

        const userChangedInRegistered: RegisteredUser = userManager.getRegisteredUsers().pop();
        const userChangedInLoggedIn: RegisteredUser = userManager.getLoggedInUsers().pop();

        expect(userChangedInRegistered).toBeUndefined();
        expect(userChangedInLoggedIn).toBeUndefined();
    });

    test("setUserRole - Manager - Failure - Invalid role", () => {
        const isLoggedIn: boolean = true;
        const buyer: RegisteredUser = new RegisteredUser('test', '111111');
        jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(buyer);
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);

        const userChangedInRegistered: RegisteredUser = userManager.getRegisteredUsers().pop();
        const userChangedInLoggedIn: RegisteredUser = userManager.getLoggedInUsers().pop();

        expect(userChangedInRegistered).toBeUndefined();
        expect(userChangedInLoggedIn).toBeUndefined();
    });

    test("removeProductFromCart Success", () => {
        const user: User = new RegisteredUser('dor', '12345');
        jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
        const product: Product = new Product('table', 5, 120, ProductCategory.Home);
        userManager.saveProductToCart(user, 'store', product, 5);
        expect(user.cart.get('store')).toEqual([{product, amount: 5}])

        const req: RemoveFromCartRequest = {
            body: {storeName: 'store', catalogNumber: product.catalogNumber, amount: 4},
            token: "whatever"
        }
        const res: Res.BoolResponse = userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount);
        expect(res.data.result).toBeTruthy();
        expect(user.cart.get('store')).toEqual([{product, amount: 1}])

        const req2: RemoveFromCartRequest = {
            body: {storeName: 'store', catalogNumber: product.catalogNumber, amount: 3},
            token: "whatever"
        }
        const res2: Res.BoolResponse = userManager.removeProductFromCart(user, req2.body.storeName, product, req2.body.amount);
        expect(res.data.result).toBeTruthy();
    })

    test("removeProductFromCart fail no such store", () => {
        const user: User = new RegisteredUser('dor', '12345');
        const product: Product = new Product('table', 5, 120, ProductCategory.Home);
        jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
        const req: Req.RemoveFromCartRequest = {body: {storeName: 'store', catalogNumber: 5, amount: 1}, token: "whatever"}
        const res: Res.BoolResponse = userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount);
        expect(res.data.result).toBeFalsy();
    });

    test('view cart Success test', () => {
        const user: User = new RegisteredUser('dor', '12345');
        jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
        const product = new Product('table', 15, 120, ProductCategory.Home);

        const res: Res.ViewCartRes = userManager.viewCart({body: {}, token: 'whatever'});
        expect(res.data.cart).toEqual(user.cart);
        expect(res.data.result).toBeTruthy();

        user.saveProductToCart('store', product, 3);
        const res2: Res.ViewCartRes = userManager.viewCart({body: {}, token: 'whatever'});
        expect(res2.data.cart).toEqual(user.cart);
        expect(res2.data.result).toBeTruthy();
    })


    // TODO: fix setUserRole tests

    // test("setUserRole - Owner, logged in - Success", () => {
    //     const isLoggedIn: boolean = true;
    //     const buyer: RegisteredUser = new RegisteredUser('test', '111111');
    //     const roleToAssign: UserRole = UserRole.OWNER;
    //     jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(buyer);
    //     jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);
    //
    //     const userChangedInRegistered: RegisteredUser = userManager.getRegisteredUsers().pop();
    //     const userChangedInLoggedIn: RegisteredUser = userManager.getLoggedInUsers().pop();
    //
    //     expect(userChangedInRegistered).toBeDefined();
    //     expect(userChangedInRegistered.name).toBe(buyer.name);
    //     expect(userChangedInRegistered.password).toBe(buyer.password);
    //
    //     expect(userChangedInLoggedIn).toBeDefined();
    //     expect(userChangedInLoggedIn.name).toBe(buyer.name);
    //     expect(userChangedInLoggedIn.password).toBe(buyer.password);
    // });
    //
    // test("setUserRole - Owner - Failure - User doesn't exist", () => {
    //     const isLoggedIn: boolean = true;
    //     const buyer: RegisteredUser = new RegisteredUser('test', '111111');
    //     const roleToAssign: UserRole = UserRole.OWNER;
    //     jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(undefined);
    //     jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);
    //
    //     const userChangedInRegistered: RegisteredUser = userManager.getRegisteredUsers().pop();
    //     const userChangedInLoggedIn: RegisteredUser = userManager.getLoggedInUsers().pop();
    //
    //     expect(userChangedInRegistered).toBeUndefined();
    //     expect(userChangedInLoggedIn).toBeUndefined();
    // });
    //
    // test("setUserRole - Owner - Failure - Invalid role", () => {
    //     const isLoggedIn: boolean = true;
    //     const buyer: RegisteredUser = new RegisteredUser('test', '111111');
    //     jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(buyer);
    //     jest.spyOn(userManager, "isLoggedIn").mockReturnValue(isLoggedIn);
    //
    //     const userChangedInRegistered: RegisteredUser = userManager.getRegisteredUsers().pop();
    //     const userChangedInLoggedIn: RegisteredUser = userManager.getLoggedInUsers().pop();
    //
    //     expect(userChangedInRegistered).toBeUndefined();
    //     expect(userChangedInLoggedIn).toBeUndefined();
    // });


});
