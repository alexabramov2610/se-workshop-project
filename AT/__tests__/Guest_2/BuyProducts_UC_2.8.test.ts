import {
    Bridge,
    Driver,
    Store,
    Product, Item
} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {IDiscount, Purchase, IDiscountInPolicy} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums"


import {Req} from "se-workshop-20-interfaces";
import * as utils from "../../utils"


describe("Guest buy items, UC: 2.8", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testMilk: Product;
    let _testEggs: Product;
    let _testBanana: Product;
    let _testCola: Product;
    let _testGold: Product;
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
    afterAll(()=>{
        _driver.dropDB();
    })
    beforeEach(async() => {
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        _serviceBridge = await _driver.getBridge();
        await _serviceBridge.login(_driver.getInitDefaults(),true);
        await _serviceBridge.mockPaymentSys();
        await _serviceBridge.logout();
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _testMilk = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).withPrice(5).getProduct();
        _testEggs = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).withPrice(30).getProduct();
        _testBanana = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).withPrice(2).getProduct();
        _testCola = new ProductBuilder().withName("testProduct4").withCatalogNumber(555).withPrice(50).getProduct();
        _testGold = new ProductBuilder().withName("testExpensiveProduct").withCatalogNumber(777).withPrice(999999).getProduct();
        _testMilk1 = new ItemBuilder().withId(1).withCatalogNumber(_testMilk.catalogNumber).getItem();
        _testEggs1 = new ItemBuilder().withId(2).withCatalogNumber(_testEggs.catalogNumber).getItem()
        _testMilk2 = new ItemBuilder().withId(3).withCatalogNumber(_testMilk.catalogNumber).getItem();
        _testCola1 = new ItemBuilder().withId(4).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola2 = new ItemBuilder().withId(5).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testCola3 = new ItemBuilder().withId(6).withCatalogNumber(_testCola.catalogNumber).getItem();
        _testBanana1 = new ItemBuilder().withId(7).withCatalogNumber(_testBanana.catalogNumber).getItem();
        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};
      await _serviceBridge.createStore(_testStore1);
      await _serviceBridge.createStore(_testStore2);
      await  _serviceBridge.addProductsToStore(_testStore1, [_testMilk, _testBanana, _testCola, _testEggs]);
      await    _serviceBridge.addProductsToStore(_testStore2, [_testMilk, _testEggs]);
      await  _serviceBridge.addItemsToStore(_testStore1, [_testMilk1, _testMilk2, _testCola1, _testCola2, _testCola3, _testEggs1, _testBanana1]);
      await   _serviceBridge.addItemsToStore(_testStore2, [_testMilk2, _testEggs1]);
      await  _serviceBridge.logout();
    });

    afterAll(() => {
        utils.terminateSocket();
        _driver.dropDB();
    });

    test("Non empty cart, items in stock, no discount", async() => {
        const {data, error} = await _driver.given.store(_testStore1).products([_testMilk]).makeABuy();
        expect(data).toBeDefined();
        expect(error).toBeUndefined();

        const {receipt} = data;
        const today = new Date();
        receipt.date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        expect(receipt.date).toEqual(today);

        const purchases: Purchase[] = receipt.purchases;
        expect(purchases.length).toEqual(1);
        expect(purchases[0].storeName).toEqual(_testStore1.name);
        expect(purchases[0].price).toEqual(_testMilk.price);
        expect(purchases[0].item.id).toEqual(_testMilk1.id);
        expect(purchases[0].item.catalogNumber).toEqual(_testMilk.catalogNumber);

        const {lastCC4, totalCharged} = receipt.payment;
        const last4IdxStart = _driver.getPaymentInfo().payment.cardDetails.number.length - 4;
        const last4: string = _driver.getPaymentInfo().payment.cardDetails.number.substring(last4IdxStart, last4IdxStart + 4);
        expect(lastCC4).toEqual(last4);
        expect(totalCharged).toEqual(_testMilk.price);
    });

    test("empty cart, no discount", async() => {
        const req = {token: "123", body: {payment: _driver.getPaymentInfo().payment}};
        const {error} = await _serviceBridge.purchase(req);
        expect(error).toBeDefined();
    });

    test('Non empty cart, items not stock', async () => {
        const res = await _driver.given.store(_testStore2).products([_testEggs]).makeABuy();
        expect(res.data.result).toBeTruthy()
        expect(res.data.receipt).toBeDefined()
        expect(res.error).toBeUndefined()
        const res2 = await _driver.given.store(_testStore2).products([_testEggs]).makeABuy();

        expect(res2.error.message).toEqual('The cart is empty')
        expect(res2.data.result).toBeFalsy()
        expect(res2.data.receipt).toBeUndefined()

    })

    test('Non empty cart, items in stock,card expaired,check stock ', async() => {
        const {data} =await _serviceBridge.viewProduct(_testStore1, _testMilk);
        const ItemStockBefore = data.info.quantity
      const res1=  await _serviceBridge.addToCart(_testStore1, _testMilk, 1);
        const res2 = res1
        const req = {
            body: {
                payment: {
                    cardDetails: {
                        holderName: "Mr Cat",
                        number: "4242424242424242",
                        expMonth: "12",
                        expYear: "08",
                        id:"203314666",
                        cvv: "123",
                    },
                    address: "St. Cats 123",
                    city: "Cat City",
                    country: "CatZone",
                }
            }
        };
        const res = await _serviceBridge.purchase(req);
        expect(res.data.result).toBeFalsy()
        expect(res.error.message).toEqual('Payment failure.')
        const response  = await _serviceBridge.viewProduct(_testStore1, _testMilk)
        const ItemStockAfter = response.data.info.quantity
        expect(ItemStockBefore).toEqual(ItemStockAfter)
    })

    test('Non empty cart, items in stock,invalid ID,check stock ', async() => {
        const {data} =await _serviceBridge.viewProduct(_testStore1, _testMilk);
        const ItemStockBefore = data.info.quantity
        const res1=  await _serviceBridge.addToCart(_testStore1, _testMilk, 1);
        const res2 = res1
        const req = {
            body: {
                payment: {
                    cardDetails: {
                        holderName: "Mr Cat",
                        number: "4242424242424242",
                        expMonth: "12",
                        expYear: "23",
                        id:"blabla123",
                        cvv: "123",
                    },
                    address: "St. Cats 123",
                    city: "Cat City",
                    country: "CatZone",
                }
            }
        };

        const res = await _serviceBridge.purchase(req);
        expect(res.data.result).toBeFalsy()
        expect(res.error.message).toEqual('Payment failure.')
        const response  = await _serviceBridge.viewProduct(_testStore1, _testMilk)
        const ItemStockAfter = response.data.info.quantity
        expect(ItemStockBefore).toEqual(ItemStockAfter)

    })

    test('Non empty cart, items in stock,no money', async() => {
        const {data, error} =await _driver.given.store(_testStore1).products([_testGold]).makeABuy();
        expect(error).toBeDefined
        expect(data.result).toBeFalsy()
    })

    test('logged in user, Non empty cart, items in stock', async () => {
        _driver.loginWithDefaults()
        const res =await _driver.given.store(_testStore1).products([_testMilk]).makeABuy();
        expect(res.data.result).toBeTruthy()
        expect(res.error).toBeUndefined();
        expect(res.data.receipt.purchases.length).toEqual(1)
    })


});