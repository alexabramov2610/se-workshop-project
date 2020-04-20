import * as Responses from "../../../../src/api-int/internal_api";
import {logger, UserRole} from "../../../../src/api-int/internal_api";
import {UserManager} from "../../../../src/user/UserManager";
import {RegisteredUser, StoreManager} from "../../../../src/user/internal_api";
import exp from "constants";

describe("RegisteredUser Management Unit Tests", () => {
    let userManager: UserManager;

    beforeEach(() => {
        userManager = new UserManager();
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
        jest.spyOn(userManager, "isValidPassword").mockReturnValue(true)
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
