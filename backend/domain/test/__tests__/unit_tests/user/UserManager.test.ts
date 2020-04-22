import * as Responses from "../../../../src/api-int/internal_api";
import {loggerW, UserRole,RemoveFromCartRequest} from "../../../../src/api-int/internal_api";
const logger = loggerW(__filename)
import {UserManager} from "../../../../src/user/UserManager";
import {RegisteredUser,User, StoreManager} from "../../../../src/user/internal_api";
import exp from "constants";
import {ExternalSystemsManager} from "../../../../src/external_systems/internal_api";
import { ProductCategory } from "../../../../src/api-ext/CommonInterface";
import { Product } from "../../../../src/trading_system/data/Product";
import { Store } from "../../../../src/store/Store";


describe("RegisteredUser Management Unit Tests", () => {
    let userManager: UserManager;

    beforeEach(() => {
        userManager = new UserManager(new ExternalSystemsManager());
    });


    test("Registration Success Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(null);
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
        const res: Responses.BoolResponse =  userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeTruthy();
    });

    test("Registration user exist Fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron','123456'));
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
        const res: Responses.BoolResponse = userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });

    test("Registration bad pass Fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(null);
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(false)
        const res: Responses.BoolResponse = userManager.register({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });


    test("Login Success Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron','123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(true)
        jest.spyOn(userManager, "isLoggedIn").mockReturnValue(false)

        const res: Responses.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeTruthy();
    });

    test("Login bad password fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron','123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(false);
        const res: Responses.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });

    test("Login already logged in fail Test", () => {
        jest.spyOn(userManager, "getUserByName").mockReturnValue(new RegisteredUser('ron','123456'));
        jest.spyOn(userManager, "verifyPassword").mockReturnValue(false);
        const res: Responses.BoolResponse = userManager.login({
            body: {username: 'ron', password: '123456'},
            token: "token"
        });
        expect(res.data.result).toBeFalsy();
    });


    test("logout Success Test", () => {
        jest.spyOn(userManager,"isLoggedIn").mockReturnValue(true);
        jest.spyOn(userManager,"getLoggedInUserByToken").mockReturnValue(new RegisteredUser("ron", "ron123"));
        const res: Responses.BoolResponse = userManager.logout({body:{}, token: "token"})
        expect(res.data.result).toBeTruthy();
    });

    test("logout already out fail Test", () => {
        jest.spyOn(userManager,"getLoggedInUserByToken").mockReturnValue(undefined);
        const res: Responses.BoolResponse = userManager.logout({body: {}, token: "token"})
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

    test("removeProductFromCart seccess",()=>{
        const u:User=new RegisteredUser('dor','12345');
         jest.spyOn(userManager,"getUserByToken").mockReturnValue(u);
         const p:Product=new Product('table',5,120,ProductCategory.Home);
         userManager.saveProductToCart(u,'store',p,5);
         expect(u.cart.get('store')).toEqual([{product:p,amount:5}])
    
         const req:RemoveFromCartRequest={body:{storeName:'store',catalogNumber:p.catalogNumber,amount:4},token:"whatever"}
         const res:Responses.BoolResponse=userManager.removeProductFromCart(req);
         expect(res.data.result).toBeTruthy();
         expect(u.cart.get('store')).toEqual([{product:p,amount:1}])

         const req2:RemoveFromCartRequest={body:{storeName:'store',catalogNumber:p.catalogNumber,amount:3},token:"whatever"}
         const res2:Responses.BoolResponse=userManager.removeProductFromCart(req);
         expect(res.data.result).toBeTruthy();
         expect(u.cart.get('store')).toBeFalsy()


    })

    test("removeProductFromCart fail no such store",()=>{
            const u:User=new RegisteredUser('dor','12345');
            const p:Product=new Product('table',5,120,ProductCategory.Home);
            jest.spyOn(userManager,"getUserByToken").mockReturnValue(u);
            const res:Responses.BoolResponse=userManager.removeProductFromCart({body:{storeName:'store',catalogNumber:5,amount:1},token:"whatever"})
            expect(res.data.result).toBeFalsy();
            expect(res.error.message).toEqual("Store does not exist." )
        
        });

    test('view cart  seccess test',()=>{
        const u:User=new RegisteredUser('dor','12345');
        jest.spyOn(userManager,"getUserByToken").mockReturnValue(u);
        const p=new Product('table',15,120,ProductCategory.Home);
    
        const res:Responses.ViewCartRes=userManager.viewCart({body:{},token:'whatever'});
        expect(res.data.cart).toEqual(u.cart);
        expect(res.data.result).toBeTruthy();
    
        u.saveProductToCart('store',p,3);
        const res2:Responses.ViewCartRes=userManager.viewCart({body:{},token:'whatever'});
        expect(res2.data.cart).toEqual(u.cart);
        expect(u.cart.get('store').length).toBe(3)
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
