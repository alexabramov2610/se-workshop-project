// import {Req, Res} from 'se-workshop-20-interfaces'
// import {UserManager} from "../../../../src/user/UserManager";
// import {RegisteredUser, User, StoreManager} from "../../../../src/user/internal_api";
// import {ExternalSystemsManager} from "../../../../src/external_systems/internal_api";
// import {BagItem, Cart, CartProduct, ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";
// import {mocked} from "ts-jest/utils";
// import {SecuritySystem} from "../../../../src/external_systems/security_system/SecuritySystem";
// import {Guest} from "../../../../src/user/users/Guest";
// import {UserModel} from "dal"
//
// jest.mock('../../../../src/external_systems/security_system/SecuritySystem');
// jest.mock('dal');

describe("User Manager tmp", () => {
    test("temp111", () => {
        expect(true).toBe(true);
    })
});

// describe("User Manager  Unit Tests", () => {
// const encPassword: string = "enchardpwformocking";
// const token: string = "mock-token-for-testing";
// let userManager: UserManager;


//     beforeEach(() => {
//         mockSecuritySystem();
//         mockDAL();
//         userManager = new UserManager(new ExternalSystemsManager());
//     });
//
//
//     test("Registration Success Test", (done) => {
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(null);
//         jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
//         userManager.register({
//             body: {username: 'ron', password: '123456'},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("Registration user exist Fail Test", (done) => {
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
//         jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
//         userManager.register({
//             body: {username: 'ron', password: '123456'},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("Login Success Test", (done) => {
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron', '123456'));
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)
//
//         userManager.login({
//             body: {username: 'ron', password: '123456'},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("Login already logged in fail Test", (done) => {
//         const username: string = "mockname";
//         const password: string = "mock-pw";
//         const user: RegisteredUser = new RegisteredUser(username, password);
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true);
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(true);
//         userManager.login({
//             body: {username: 'ron', password: '123456'},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("Login Failure - as admin req", (done) => {
//         const username: string = "mockname";
//         const password: string = "mock-pw";
//         const user: RegisteredUser = new RegisteredUser(username, password);
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true);
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false);
//         jest.spyOn(userManager, "isAdmin").mockReturnValue(false);
//
//         userManager.login({body: {username, password, asAdmin: true}, token: "token"})
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("logout Success Test", (done) => {
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(true);
//         jest.spyOn(userManager, "getLoggedInUserByToken").mockReturnValue(new RegisteredUser("ron", "ron123"));
//         userManager.logout({body: {}, token: "token"})
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("verifyPassword", () => {
//         const password: string = "pw123toenc";
//         const encPassword: string = password + "enchard" + password;
//         expect(userManager.verifyPassword("usernamemock", password, encPassword)).toBeTruthy();
//     });
//
//     test("isValidPassword success", () => {
//         const password: string = "pw123toenc";
//         expect(userManager.isValidPassword(password)).toBe(true);
//     });
//
//     test("isValidPassword failure", () => {
//         let password: string = "";
//         expect(userManager.isValidPassword(password)).toBe(false);
//
//         password = "asda";
//         expect(userManager.isValidPassword(password)).toBe(false);
//     });
//
//
//     test("getRegisteredUsers success", (done) => {
//         const user: RegisteredUser = new RegisteredUser('mockmock', '123456');
//         const encUser: RegisteredUser = new RegisteredUser('mockmock', encPassword);
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(undefined);
//         jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
//         userManager.register({
//             body: {username: user.name, password: user.password},
//             token: "token"
//         })
//             .then((res) => {
//                 // const registeredUsers: RegisteredUser[] = userManager.getRegisteredUsers();
//                 // expect(registeredUsers).toBeDefined();
//                 // expect(registeredUsers).toHaveLength(1);
//                 // expect(registeredUsers).toContainEqual(encUser);
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("getLoggedInUsers success", (done) => {
//         const user: RegisteredUser = new RegisteredUser('mockmock', '123456');
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)
//
//         userManager.login({
//             body: {username: user.name, password: user.password},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 const loggedInUsers: RegisteredUser[] = userManager.getLoggedInUsers();
//                 expect(loggedInUsers).toBeDefined();
//                 expect(loggedInUsers).toHaveLength(1);
//                 expect(loggedInUsers).toContain(user);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//
//     test("getUserByName success", (done) => {
//         const user: RegisteredUser = new RegisteredUser('mockmock', '123456');
//         const encUser: RegisteredUser = new RegisteredUser('mockmock', encPassword);
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(undefined);
//         jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
//         userManager.register({
//             body: {username: user.name, password: user.password},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 // const registeredUser: RegisteredUser = userManager.getUserByName(user.name);
//                 // expect(registeredUser).toBeDefined();
//                 // expect(registeredUser).toEqual(encUser);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//
//     test("getUserByToken success - registered user", (done) => {
//         const user: RegisteredUser = new RegisteredUser('mockmock', '123456');
//         const token: string = "mock-token-for-testing";
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)
//
//         userManager.login({body: {username: user.name, password: user.password}, token})
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 const userByToken: User = userManager.getUserByToken(token);
//                 expect(userByToken).toBeDefined();
//                 expect(userByToken).toEqual(user);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("getUserByToken success - guest", () => {
//         const token: string = "mock-token-for-testing";
//         userManager.addGuestToken(token);
//
//         const userByToken: User = userManager.getUserByToken(token);
//         expect(userByToken).toBeDefined();
//         expect(userByToken instanceof Guest).toBe(true);
//     });
//
//
//     test("getLoggedInUserByToken success", (done) => {
//         const user: RegisteredUser = new RegisteredUser('mockmock', '123456');
//         const token: string = "mock-token-for-testing";
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)
//
//         userManager.login({body: {username: user.name, password: user.password}, token})
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 const registeredUser: RegisteredUser = userManager.getLoggedInUserByToken(token);
//                 expect(registeredUser).toBeDefined();
//                 expect(registeredUser).toEqual(user);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("isAdmin - failure", () => {
//         const adminUserName: string = "admin-super-mock";
//         const adminUser: RegisteredUser = new RegisteredUser(adminUserName);
//
//         expect(userManager.isAdmin(adminUser)).toBe(false);
//     });
//
//     test("isAdmin - success", () => {
//         const adminUserName: string = "admin-super-mock";
//         const adminUser: RegisteredUser = setFirstAdmin(adminUserName);
//
//         expect(userManager.isAdmin(adminUser)).toBe(true);
//     });
//
//
//     function setFirstAdmin(adminUserName: string): RegisteredUser {
//         const adminUser: RegisteredUser = new RegisteredUser(adminUserName);
//         const req: Req.SetAdminRequest = {body: {newAdminUserName: adminUserName}, token};
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(adminUser);
//         jest.spyOn(userManager, "isAdmin").mockReturnValueOnce(false);
//
//         const res: Res.BoolResponse = userManager.setAdmin(req);
//         expect(res.data.result).toBe(true);
//         return adminUser;
//     }
//
//     test("setAdmin Success - first admin", () => {
//         const adminUserName: string = "admin-super-mock";
//         setFirstAdmin(adminUserName);
//     });
//
//     test("setAdmin Success - not first admin and authorized", () => {
//         const adminUserName: string = "admin-super-mock";
//         const adminUser: RegisteredUser = setFirstAdmin(adminUserName);
//         const newAdminUser: RegisteredUser = new RegisteredUser(adminUserName + "2", "mock-pw");
//
//         const req: Req.SetAdminRequest = {body: {newAdminUserName: adminUserName + "not-first"}, token};
//         jest.spyOn(userManager, "getLoggedInUserByToken").mockReturnValueOnce(adminUser);
//         jest.spyOn(userManager, "getUserByName").mockReturnValueOnce(newAdminUser);
//         jest.spyOn(userManager, "isAdmin").mockReturnValueOnce(false);
//
//         const res: Res.BoolResponse = userManager.setAdmin(req);
//         expect(res.data.result).toBe(true);
//     });
//
//
//     test("setAdmin failure - not first admin and not authorized user", () => {
//         const adminUserName: string = "admin-super-mock";
//         setFirstAdmin(adminUserName);
//
//         const req: Req.SetAdminRequest = {
//             body: {newAdminUserName: adminUserName + "not-first"},
//             token: token + "not-first"
//         };
//
//         const res: Res.BoolResponse = userManager.setAdmin(req);
//         expect(res.data.result).toBe(false);
//     });
//
//     test("setAdmin failure - invalid user", () => {
//         const adminUserName: string = "admin-super-mock";
//         const req: Req.SetAdminRequest = {body: {newAdminUserName: adminUserName}, token};
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(undefined);
//
//         const res: Res.BoolResponse = userManager.setAdmin(req);
//         expect(res.data.result).toBe(false);
//     });
//
//     test("setAdmin failure - already admin", () => {
//         const adminUserName: string = "admin-super-mock";
//         const adminUser: RegisteredUser = new RegisteredUser(adminUserName);
//         const req: Req.SetAdminRequest = {body: {newAdminUserName: adminUserName}, token};
//
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(adminUser);
//         jest.spyOn(userManager, "isAdmin").mockReturnValue(true);
//
//         const res: Res.BoolResponse = userManager.setAdmin(req);
//         expect(res.data.result).toBe(false);
//     })
//
//
//     test("isLoggedIn Success", (done) => {
//         const user: RegisteredUser = new RegisteredUser("username-mock", '123456')
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValueOnce(false)
//
//         userManager.login({
//             body: {username: user.name, password: user.password},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(userManager.isLoggedIn(user.name)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("isLoggedIn Failure", (done) => {
//         const user: RegisteredUser = new RegisteredUser("username-mock", '123456')
//         jest.spyOn(userManager, "getUserByName").mockReturnValue(user);
//         jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
//         jest.spyOn(userManager, "isLoggedIn").mockReturnValueOnce(false)
//
//         userManager.login({
//             body: {username: user.name, password: user.password},
//             token: "token"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 done();
//                 // expect(userManager.isLoggedIn(user.name + "-new-one")).toBe(false);
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("removeGuest success & failure", () => {
//         const token1: string = "token1";
//         expect(userManager.getUserByToken(token1)).toBeUndefined();
//
//         userManager.addGuestToken(token1);
//         let user: User = userManager.getUserByToken(token1);
//         expect(user).toBeDefined();
//         expect(user instanceof Guest).toBe(true);
//
//         userManager.removeGuest(token1);
//         user = userManager.getUserByToken(token1);
//         expect(user).toBeUndefined();
//     });
//
//
//     test("removeProductFromCart Success", (done) => {
//         const user: User = new RegisteredUser('dor', '12345');
//         jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
//         const product: Product = new Product('table', 5, 120, ProductCategory.HOME);
//         userManager.saveProductToCart(user, 'store', product, 5);
//         expect(user.cart.get('store')).toEqual([{product, amount: 5}])
//
//         const req: Req.RemoveFromCartRequest = {
//             body: {storeName: 'store', catalogNumber: product.catalogNumber, amount: 4},
//             token: "whatever"
//         }
//         userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount)
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(user.cart.get('store')).toEqual([{product, amount: 1}])
//             })
//             .catch(err => done.fail(err))
//
//         const req2: Req.RemoveFromCartRequest = {
//             body: {storeName: 'store', catalogNumber: product.catalogNumber, amount: 3},
//             token: "whatever"
//         }
//         userManager.removeProductFromCart(user, req2.body.storeName, product, req2.body.amount)
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     })
//
//     test("removeProductFromCart fail no such store", (done) => {
//         const user: User = new RegisteredUser('dor', '12345');
//         const product: Product = new Product('table', 5, 120, ProductCategory.HOME);
//         jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
//         const req: Req.RemoveFromCartRequest = {
//             body: {storeName: 'store', catalogNumber: 5, amount: 1},
//             token: "whatever"
//         }
//         userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount)
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test('viewCart Success', async(done) => {
//         const user: User = new RegisteredUser('dor', '12345');
//         jest.spyOn(userManager, "getUserByToken").mockReturnValue(user);
//         const product = new Product('table', 15, 120, ProductCategory.HOME);
//
//         await userManager.viewCart({body: {}, token: 'whatever'})
//             .then((res) => {
//                 expect(res.data.cart).toEqual(transferToCartRes(user.cart))
//                 expect(res.data.result).toBeTruthy();
//             })
//             .catch(err => done.fail(err))
//
//         user.saveProductToCart('store', product, 3);
//         userManager.viewCart({body: {}, token: 'whatever'})
//             .then((res) => {
//                 expect(res.data.cart).toEqual(transferToCartRes(user.cart));
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     })
//
//     test("viewRegisteredUserPurchasesHistory success", (done) => {
//         const user: RegisteredUser = new RegisteredUser("user-mock", "user-mock-pw");
//         const res: Res.ViewRUserPurchasesHistoryRes = {data: {result: true, receipts: user.receipts}};
//         userManager.viewRegisteredUserPurchasesHistory(user)
//             .then((response) => {
//                 expect(response).toEqual(res);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     function mockSecuritySystem() {
//         mocked(SecuritySystem).mockClear();
//         mocked(SecuritySystem).mockImplementation((): any => {
//             return {
//                 comparePassword: () => true,
//                 encryptPassword: () => encPassword
//             }
//         });
//     }
//
//     function mockDAL() {
//         mocked(UserModel).mockClear();
//         mocked(UserModel).mockImplementation((): any => {
//             return {
//                 save: () => true,
//                 findOne: (name) => new RegisteredUser(name, "password-mock")
//             }
//         });
//     }
//
//     function transferToCartRes(cart: Map<string, BagItem[]>): Cart {
//         const cartProducts: CartProduct[] = [];
//         for (const [storeName, bagItems] of cart) {
//             cartProducts.push({storeName, bagItems})
//         }
//         const cartRes: Cart = {products: cartProducts}
//         return cartRes
//     }
// });
