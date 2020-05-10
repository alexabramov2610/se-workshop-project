import {
    Bridge,
    Driver,
    Store,
    Product, Item
} from "../..";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {IDiscount, Purchase,IPolicy} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums"


import { Req } from "se-workshop-20-interfaces";
import * as utils from "../utils"



describe("Store owner add Disconts and policies , UC: 4.2", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
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
    let _testCondDiscount1:IDiscount;
    let _testCondDiscount2:IDiscount;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .startSession()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testMilk = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).withPrice(5).getProduct();
        _testEggs = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).withPrice(30).getProduct();
        _testBanana = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).withPrice(2).getProduct();
        _testCola = new ProductBuilder().withName("testProduct4").withCatalogNumber(555).withPrice(50).getProduct();
        _testGold = new ProductBuilder().withName("testExpensiveProduct").withCatalogNumber(777).withPrice(999999).getProduct();

        _testMilk1 = new ItemBuilder().withId(1).withCatalogNumber(_testMilk.catalogNumber).getItem();
        _testEggs1 = new ItemBuilder().withId(2).withCatalogNumber(_testEggs.catalogNumber).getItem();
        
        _testMilk2 = new ItemBuilder().withId(3).withCatalogNumber(_testMilk.catalogNumber).getItem();

        _testCola1= new ItemBuilder().withId(4).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola2= new ItemBuilder().withId(5).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola3= new ItemBuilder().withId(6).withCatalogNumber(_testCola.catalogNumber).getItem();

        _testBanana1= new ItemBuilder().withId(7).withCatalogNumber(_testBanana.catalogNumber).getItem();





        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        _testSimpleDiscount1 = {startDate: new Date(), percentage: 50, duration: 5,products:[_testCola.catalogNumber]};
        _testSimpleDiscount2 = {startDate: new Date(), percentage: 50, duration: 5,products:[_testMilk.catalogNumber]};


         _testCondDiscount1  = {startDate: new Date(), percentage: 50, duration: 5,
            products:[_testCola.catalogNumber],
            condition: [{condition: {catalogNumber: 555, minAmount: 1},operator: Operators.AND}]}

        _testCondDiscount2={startDate: new Date(), percentage: 50, duration: 5,                 // 50% on cola if
            products:[_testCola.catalogNumber],
            condition: [{condition: {catalogNumber: _testEggs.catalogNumber ,minAmount:1},operator: Operators.OR},  //buy eggs  OR   
            {condition:{catalogNumber:_testBanana.catalogNumber,minAmount:1},operator:Operators.AND},                 // buy 2+ banana and milk 
            {condition:{catalogNumber:_testMilk.catalogNumber,minAmount:1},operator:Operators.AND}]}



        


        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addProductsToStore(_testStore1, [_testMilk, _testBanana, _testCola,_testEggs]);
        _serviceBridge.addProductsToStore(_testStore2, [_testMilk, _testEggs]);

        _serviceBridge.addItemsToStore(_testStore1, [_testMilk1, _testMilk2,_testCola1,_testCola2,_testCola3,_testEggs1,_testBanana1]);
        _serviceBridge.addItemsToStore(_testStore2, [_testMilk2, _testEggs1]);

        _serviceBridge.logout();

        
    });

    afterEach(() => {
        utils.terminateSocket();
     });

  

    test("Non empty cart, items in stock, with simple discount(50% on milk)" ,() => { 

    const storeName = _testStore1.name
    const policy:IPolicy = {discounts: [{discount: _testSimpleDiscount2, operator: Operators.AND}]}
    const setPolicyReq: Req.SetDiscountsPolicyRequest = {
                    body: {storeName, policy},
                    token: '123'
                }

    
    
    _driver.loginWithDefaults();

    const makeDiscountRes = _serviceBridge.setDiscountsPolicy(setPolicyReq);

    _serviceBridge.logout();

    expect(makeDiscountRes.data.result).toBeTruthy()
    

    const {data, error} = _driver.given.store(_testStore1).products([_testMilk]).makeABuy();
    expect(data).toBeDefined();
    expect(error).toBeUndefined();

   
    const totalCharged=data.receipt.payment.totalCharged
    const prod=data.receipt.purchases[0]

    const reducedPrice: number = _testMilk.price - (_testMilk.price * _testSimpleDiscount1.percentage / 100);
    expect(totalCharged).toEqual(reducedPrice);
});

    test(" Buy items with XOR discount(50 on milk or 50 on cola but noth both)",()=>{
        const storeName=_testStore1.name
        const policy: IPolicy = {discounts: [{discount: _testSimpleDiscount1, operator: Operators.XOR},{discount: _testSimpleDiscount2, operator: Operators.AND} ]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: "123"
        }

        _driver.loginWithDefaults();
        const makeDiscountRes= _serviceBridge.setDiscountsPolicy(setPolicyReq);
        _serviceBridge.logout()

        const {data, error} = _driver.given.store(_testStore1).products([_testMilk,_testCola]).makeABuy(2);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();
        const totalCharged=data.receipt.payment.totalCharged
        expect(totalCharged).toEqual(60); //(50*2)*0.5 + 5*2 =70

    })

    test('Non empty cart, items in stock, with Cond discount , buy 1 get 2nd for 50%',()=>{
        const storeName = _testStore1.name
        const policy: IPolicy = {discounts: [{discount: _testCondDiscount1, operator: Operators.AND}]}

        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        _driver.loginWithDefaults();
        const makeDiscountRes= _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount
        
        _serviceBridge.logout();

        const {data, error} = _driver.given.store(_testStore1).products([_testCola]).makeABuy(2); //buys 2 items


        expect(makeDiscountRes.data.result).toBeTruthy()
        
        expect(error).toBeUndefined()
        expect(data.result).toBeTruthy()
        expect(data.receipt.purchases.length).toEqual(2)
        expect(data.receipt.payment.totalCharged).toEqual(75)   //50+50*0.5=75

    });

     test('Cond discount,get 50% of cola if you buy eggs or 2 bananas and milk ',()=>{
        const storeName = _testStore1.name
        const policy: IPolicy = {discounts: [{discount: _testCondDiscount2, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        _driver.loginWithDefaults();
        const makeDiscountRes= _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        const _testEggs2 = new ItemBuilder().withId(8).withCatalogNumber(_testEggs.catalogNumber).getItem();
        _serviceBridge.addItemsToStore(_testStore1,[_testEggs2])

        _serviceBridge.logout();


        const {data, error} = _driver.given.store(_testStore1).products([_testCola,_testEggs]).makeABuy(2); //buys 2 items
        expect(data.result).toBeTruthy()

        const expectedCharge=(2*_testCondDiscount2.percentage *_testCola.price/100) + (2*_testEggs.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)



        
    })


    test('Cond discount,get 50% of cola if you buy eggs or  banana and milk 2nd cond ',()=>{
        const storeName = _testStore1.name
        const policy: IPolicy = {discounts: [{discount: _testCondDiscount2, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        _driver.loginWithDefaults();
        const makeDiscountRes= _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount

        const _testEggs2 = new ItemBuilder().withId(8).withCatalogNumber(_testEggs.catalogNumber).getItem();
        _serviceBridge.addItemsToStore(_testStore1,[_testEggs2])

        _serviceBridge.logout();


        const {data, error} = _driver.given.store(_testStore1).products([_testCola,_testBanana,_testMilk]).makeABuy(); 
        expect(data.result).toBeTruthy()

        const expectedCharge=(_testCondDiscount2.percentage *_testCola.price/100) + (_testBanana.price+_testMilk.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)

    })


    test('store discount ,get 50% discount on milk if you buy in more then 100$',()=>{
        const storeName = _testStore1.name

        const storeContDiscout={startDate: new Date(), percentage: 50, duration: 5,
            products:[_testMilk.catalogNumber],
            condition: [{condition: {minPay : 90},operator: Operators.AND}]} 

        const policy: IPolicy = {discounts: [{discount: storeContDiscout, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: '123'
        }

        _driver.loginWithDefaults();
        const makeDiscountRes= _serviceBridge.setDiscountsPolicy(setPolicyReq);   //add discount    

        const _testBanana2= new ItemBuilder().withId(17).withCatalogNumber(_testBanana.catalogNumber).getItem();
        _serviceBridge.addItemsToStore(_testStore1,[_testBanana2]);

        _serviceBridge.logout();

        const {data, error} = _driver.given.store(_testStore1).products([_testCola,_testBanana,_testMilk]).makeABuy(2); 
        expect(data.result).toBeTruthy()

        const expectedCharge=(2*_testCondDiscount2.percentage *_testMilk.price/100) + (2*_testBanana.price+2*_testCola.price);
        expect(data.receipt.payment.totalCharged).toEqual(expectedCharge)

    })


});