import {
    Bridge,
    Driver,
    Store,
    Product, Item
} from "../..";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {
    IDiscount,
    Purchase,
    ISimplePurchasePolicy,
    IPurchasePolicy,
    IDiscountPolicy,
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, ProductCategory, Rating, WeekDays} from "se-workshop-20-interfaces/dist/src/Enums"


import {Req, Res} from "se-workshop-20-interfaces";
import * as utils from "../../utils"


describe("Store owner add Disconts and policies , UC: 4.2", () => {

    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testStore1: Store;
    let _testStore2: Store;

    let _testMilk: Product;
    let _testEggs: Product;
    let _testBanana: Product;
    let _testCola: Product;
    let _testGold: Product

    let _testMilk1: Item;
    let _testEggs1: Item;
    let _testMilk2: Item;
    let _testCola1: Item;
    let _testCola2: Item;
    let _testCola3: Item;
    let _testBanana1: Item;

    let _testExpensiveItem: Item;
    let _testSimpleDiscount1: IDiscount;
    let _testSimpleDiscount2: IDiscount;
    let _testCondDiscount1: IDiscount;
    let _testCondDiscount2: IDiscount;


    beforeEach(async() => {

        _driver.dropDB()
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = _driver.getBridge();

        _testMilk = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).withPrice(5).getProduct();
        _testEggs = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).withPrice(30).getProduct();
        _testBanana = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).withPrice(2).getProduct();
        _testCola = new ProductBuilder().withName("testProduct4").withCatalogNumber(555).withPrice(50).getProduct();
        _testGold = new ProductBuilder().withName("testExpensiveProduct").withCategory(ProductCategory.CLOTHING).withCatalogNumber(777).withPrice(99999).getProduct();

        _testMilk1 = new ItemBuilder().withId(1).withCatalogNumber(_testMilk.catalogNumber).getItem();
        _testEggs1 = new ItemBuilder().withId(2).withCatalogNumber(_testEggs.catalogNumber).getItem();

        _testMilk2 = new ItemBuilder().withId(3).withCatalogNumber(_testMilk.catalogNumber).getItem();

        _testCola1 = new ItemBuilder().withId(4).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola2 = new ItemBuilder().withId(5).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola3 = new ItemBuilder().withId(6).withCatalogNumber(_testCola.catalogNumber).getItem();

        _testBanana1 = new ItemBuilder().withId(7).withCatalogNumber(_testBanana.catalogNumber).getItem();


        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        _testSimpleDiscount1 = {
            startDate: new Date(),
            percentage: 50,
            duration: 5,
            products: [_testCola.catalogNumber]
        };
        _testSimpleDiscount2 = {
            startDate: new Date(),
            percentage: 50,
            duration: 5,
            products: [_testMilk.catalogNumber]
        };


        _testCondDiscount1 = {
            startDate: new Date(), percentage: 50, duration: 5,
            products: [_testCola.catalogNumber],
            condition: [{condition: {catalogNumber: 555, minAmount: 1}, operator: Operators.AND}]
        }

        _testCondDiscount2 = {
            startDate: new Date(), percentage: 50, duration: 5,                 // 50% on cola if
            products: [_testCola.catalogNumber],
            condition: [{condition: {catalogNumber: _testEggs.catalogNumber, minAmount: 1}, operator: Operators.OR},  //buy eggs  OR
                {condition: {catalogNumber: _testBanana.catalogNumber, minAmount: 1}, operator: Operators.AND},                 // buy 2+ banana and milk
                {condition: {catalogNumber: _testMilk.catalogNumber, minAmount: 1}, operator: Operators.AND}]
        }


        await _serviceBridge.createStore(_testStore1);
        await _serviceBridge.createStore(_testStore2);

        await _serviceBridge.addProductsToStore(_testStore1, [_testMilk, _testBanana, _testCola, _testEggs]);
        await _serviceBridge.addProductsToStore(_testStore2, [_testMilk, _testEggs]);

        await _serviceBridge.addItemsToStore(_testStore1, [_testMilk1, _testMilk2, _testCola1, _testCola2, _testCola3, _testEggs1, _testBanana1]);
        await _serviceBridge.addItemsToStore(_testStore2, [_testMilk2, _testEggs1]);


        //  await _serviceBridge.logout();


    });

    afterAll(() => {
        utils.terminateSocket();
    });


//discounts
    test("Non empty cart, items in stock, with simple discount(50% on milk)",async () => {

        const storeName = _testStore1.name
        const policy: IDiscountPolicy = {discounts: [{discount: _testSimpleDiscount2, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }


      await _driver.loginWithDefaults();

        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);

        await _serviceBridge.logout();

        expect(makeDiscountRes.data.result).toBeTruthy()


        const {data, error} =await _driver.given.store(_testStore1).products([_testMilk]).makeABuy();
        expect(data).toBeDefined();
        expect(error).toBeUndefined();


        const totalCharged = data.receipt.payment.totalCharged
        const prod = data.receipt.purchases[0]

        const reducedPrice: number = _testMilk.price - (_testMilk.price * _testSimpleDiscount1.percentage / 100);
        expect(totalCharged).toEqual(reducedPrice);
    });

    test('simple catagory discount',async () => {

        const storeName = _testStore1.name
        const startDate = new Date()
        const categoryDiscount: IDiscount = {
            startDate,
            duration: 3,
            products: [],
            category: ProductCategory.CLOTHING,
            percentage: 10,
        }

        const policy: IDiscountPolicy = {discounts: [{discount: categoryDiscount, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

      await  _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);

        const _testShoes = new ProductBuilder().withName("Shoes").withCatalogNumber(219).withPrice(50).withCategory(ProductCategory.CLOTHING).getProduct();
        const _testShoes1 = new ItemBuilder().withId(100).withCatalogNumber(_testShoes.catalogNumber).getItem();

        await _serviceBridge.addProductsToStore(_testStore1, [_testShoes]);
        await _serviceBridge.addItemsToStore(_testStore1, [_testShoes1]);
        await _serviceBridge.logout();

        expect(makeDiscountRes.data.result).toBeTruthy()


        const {data, error} = await _driver.given.store(_testStore1).products([_testShoes]).makeABuy();
        expect(data).toBeDefined();
        expect(data.receipt.purchases.length).toBe(1)


        const totalCharged = data.receipt.payment.totalCharged

        const reducedPrice: number = _testShoes.price - (_testShoes.price * categoryDiscount.percentage / 100);
        expect(totalCharged).toEqual(reducedPrice);


    })

    test(" Buy items with XOR discount(50 on milk or 50 on cola but noth both)",async () => {
        const storeName = _testStore1.name
        const policy: IDiscountPolicy = {
            discounts: [{
                discount: _testSimpleDiscount1,
                operator: Operators.XOR
            }, {discount: _testSimpleDiscount2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: "123"
        }

       await _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);
        await _serviceBridge.logout()

        const {data, error} = await _driver.given.store(_testStore1).products([_testMilk, _testCola]).makeABuy(2);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();
        const totalCharged = data.receipt.payment.totalCharged
        expect(totalCharged).toEqual(60); //(50*2)*0.5 + 5*2 =70

    })

    test('Non empty cart, items in stock, with Cond discount , buy 1 get 2nd for 50%',async () => {
        const storeName = _testStore1.name
        const policy: IDiscountPolicy = {discounts: [{discount: _testCondDiscount1, operator: Operators.AND}]}

        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

       await _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        await _serviceBridge.logout();

        const {data, error} = await _driver.given.store(_testStore1).products([_testCola]).makeABuy(2); //buys 2 items


        expect(makeDiscountRes.data.result).toBeTruthy()

        expect(error).toBeUndefined()
        expect(data.result).toBeTruthy()
        expect(data.receipt.purchases.length).toEqual(2)
        expect(data.receipt.payment.totalCharged).toEqual(75)   //50+50*0.5=75

    });

    test('Cond discount,get 50% of cola if you buy eggs or 2 bananas and milk ',async () => {
        const storeName = _testStore1.name
        const policy: IDiscountPolicy = {discounts: [{discount: _testCondDiscount2, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

      await  _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        const _testEggs2 = new ItemBuilder().withId(8).withCatalogNumber(_testEggs.catalogNumber).getItem();
        await _serviceBridge.addItemsToStore(_testStore1, [_testEggs2])

        await _serviceBridge.logout();


        const {data, error} = await _driver.given.store(_testStore1).products([_testCola, _testEggs]).makeABuy(2); //buys 2 items
        expect(data.result).toBeTruthy()

        const expectedCharge = (2 * _testCondDiscount2.percentage * _testCola.price / 100) + (2 * _testEggs.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)


    })


    test('Cond discount,get 50% of cola if you buy eggs or  banana and milk 2nd cond ',async () => {
        const storeName = _testStore1.name
        const policy: IDiscountPolicy = {discounts: [{discount: _testCondDiscount2, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        await _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        const _testEggs2 = new ItemBuilder().withId(8).withCatalogNumber(_testEggs.catalogNumber).getItem();
        await _serviceBridge.addItemsToStore(_testStore1, [_testEggs2])

        await _serviceBridge.logout();


        const {data, error} = await _driver.given.store(_testStore1).products([_testCola, _testBanana, _testMilk]).makeABuy();
        expect(data.result).toBeTruthy()

        const expectedCharge = (_testCondDiscount2.percentage * _testCola.price / 100) + (_testBanana.price + _testMilk.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)

    })





//policies

    test('set and view buying policy ',async () => {

        const storeName = _testStore1.name

        const simplePolicy1 = {productPolicy: {catalogNumber: 1, minAmount: 2, maxAmount: 4}}
        const simplePolicy2 = {bagPolicy: {minAmount: 2, maxAmount: 3}}
        const simplePolicy3 = {systemPolicy: {notForSellDays: [WeekDays.FRIDAY]}}
        const simplePolicy4 = {userPolicy: {countries: ["israel"]}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.OR},
                {policy: simplePolicy2, operator: Operators.AND},
                {policy: simplePolicy3, operator: Operators.XOR},
                {policy: simplePolicy4, operator: Operators.AND}]
        }

        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        const req: Req.ViewStorePurchasePolicyRequest = {body: {storeName}, token: '123'};
        const res: Res.ViewStorePurchasePolicyResponse = await _serviceBridge.viewPurchasePolicy(req);
        expect(res.data.policy).toEqual(policy);

    })


    test('buy with simple product buying policy',async () => {
        const storeName = _testStore1.name
        const simplePolicy1 = {productPolicy: {catalogNumber: _testCola.catalogNumber, minAmount: 1, maxAmount: 2}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.OR}
            ]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }
        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        const {data, error} = await _driver.given.store(_testStore1).products([_testCola]).makeABuy(3);
        expect(error).toBeDefined()
        expect(data.result).toBeFalsy()

        const req: Req.RemoveFromCartRequest = {
            body: {storeName, catalogNumber: _testCola.catalogNumber, amount: 3},
            token: '123'
        }
        await _serviceBridge.removeProductFromCart(req)

        const res = await _driver.given.store(_testStore1).products([_testCola]).makeABuy(1);
        expect(res.data.result).toBeTruthy()
        expect(res.data.receipt).toBeDefined()

    })

    test('buy with simple bagitem buying policy',async () => {
        const storeName = _testStore1.name
        const simplePolicy1 = {bagPolicy: {minAmount: 2, maxAmount: 2}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.OR}
            ]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }
        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        const {data, error} = await _driver.given.store(_testStore1).products([_testCola, _testBanana, _testEggs]).makeABuy(1);
        expect(error).toBeDefined()
        expect(data.result).toBeFalsy()

        const req: Req.RemoveFromCartRequest = {
            body: {storeName, catalogNumber: _testCola.catalogNumber, amount: 1},
            token: '123'
        }
        await _serviceBridge.removeProductFromCart(req);

        const req2: Req.RemoveFromCartRequest = {
            body: {storeName, catalogNumber: _testBanana.catalogNumber, amount: 1},
            token: '123'
        }
        await _serviceBridge.removeProductFromCart(req2)

        const res = await _driver.given.store(_testStore1).products([_testCola]).makeABuy(1);
        expect(res.data.result).toBeTruthy();
        expect(res.data.receipt).toBeDefined()


    })


    test('buy with Comp And buying policy',async () => {
        const storeName = _testStore1.name
        const simplePolicy1 = {productPolicy: {catalogNumber: _testCola.catalogNumber, minAmount: 1, maxAmount: 3}}
        const simplePolicy2 = {bagPolicy: {minAmount: 3, maxAmount: 5}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.AND},
                {policy: simplePolicy2, operator: Operators.AND}
            ]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }
        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        //fail item amount < bagPolicy minAmount (3)
        const {data, error} = await _driver.given.store(_testStore1).products([_testCola, _testBanana]).makeABuy(1);
        expect(error).toBeDefined()
        expect(data.result).toBeFalsy()
        //success
        const res =await _driver.given.store(_testStore1).products([_testCola, _testMilk]).makeABuy(1); //now cart contains 4 items
        expect(res.data.result).toBeTruthy()
        expect(res.data.receipt).toBeDefined()

    })

    test('buy with Comp OR buying policy',async () => {
        const storeName = _testStore1.name
        const simplePolicy1 = {productPolicy: {catalogNumber: _testCola.catalogNumber, minAmount: 1, maxAmount: 3}}
        const simplePolicy2 = {bagPolicy: {minAmount: 3, maxAmount: 5}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.OR},
                {policy: simplePolicy2, operator: Operators.OR},


            ]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }
        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        // 1<cola<3 success
        const {data, error} =await _driver.given.store(_testStore1).products([_testCola, _testBanana]).makeABuy(1);
        expect(error).toBeUndefined()
        expect(data.result).toBeTruthy()

    })

    test('buy with Comp XOR buying policy',async () => {
        const storeName = _testStore1.name
        const simplePolicy1 = {productPolicy: {catalogNumber: _testCola.catalogNumber, minAmount: 1, maxAmount: 3}}
        const simplePolicy2 = {bagPolicy: {minAmount: 3, maxAmount: 5}}


        const policy: IPurchasePolicy = {
            policy: [
                {policy: simplePolicy1, operator: Operators.XOR},
                {policy: simplePolicy2, operator: Operators.AND}
            ]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }
        const makePolicyRes: Res.BoolResponse = await _serviceBridge.setPurchasePolicy(setPolicyReq);
        expect(makePolicyRes.data.result).toBeTruthy()

        // (1<cola<3) T  XOR  T (3<bag items<5) -> expect to fail and get error
        const {data, error} =await _driver.given.store(_testStore1).products([_testCola, _testMilk]).makeABuy(2); //4 items, 2 cola 2 milk
        expect(error.message).toBeDefined()
        expect(data.result).toBeFalsy()

        // 1<cola<3 and bagitems>5 -> success
        const res =await _driver.given.store(_testStore1).products([_testBanana, _testEggs]).makeABuy(1); //cart contain 6 items
        expect(res.data.result).toBeTruthy()
        expect(res.data.receipt).toBeDefined()

    })


    test('store discount ,get 50% discount on milk if you buy in more then 100$',async () => {
        const storeName = _testStore1.name

        const storeContDiscout = {
            startDate: new Date(), percentage: 50, duration: 5,
            products: [_testMilk.catalogNumber],
            condition: [{condition: {minPay: 90}, operator: Operators.AND}]
        }

        const policy: IDiscountPolicy = {discounts: [{discount: storeContDiscout, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        await _driver.loginWithDefaults();
        const makeDiscountRes = await _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        const _testBanana2 = new ItemBuilder().withId(17).withCatalogNumber(_testBanana.catalogNumber).getItem();
        await _serviceBridge.addItemsToStore(_testStore1, [_testBanana2]);

        await _serviceBridge.logout();

        const {data, error} = await _driver.given.store(_testStore1).products([_testCola, _testBanana, _testMilk]).makeABuy(2);
        expect(data.result).toBeTruthy()

        const expectedCharge = (2 * _testCondDiscount2.percentage * _testMilk.price / 100) + (2 * _testBanana.price + 2 * _testCola.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)

    })


});